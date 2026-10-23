import { and, eq, gt, isNull, lt, sql } from 'drizzle-orm';
import type { AppDatabase } from '$lib/server/db';
import { paradiseLoginCodes } from '$lib/server/db/schema';
import { sendLoginCode } from '$lib/server/email/paradise';

const CODE_TTL_MS = 10 * 60 * 1000; // 10 minutes
const RESEND_WINDOW_MS = 60 * 1000; // 1 code per email per 60s
const MAX_ATTEMPTS = 5;

/** Unambiguous digits (no 0/1 to avoid confusion with O/I). */
const DIGITS = '23456789';

function generateCode(): string {
	// Eight choices divide 256 exactly, so byte modulo introduces no bias.
	return Array.from(crypto.getRandomValues(new Uint8Array(6)), (byte) => DIGITS[byte % 8]).join('');
}

const encoder = new TextEncoder();

/** SHA-256 hex of a login code (codes are never stored in plaintext). */
async function hashCode(code: string): Promise<string> {
	const digest = await crypto.subtle.digest('SHA-256', encoder.encode(code));
	return Array.from(new Uint8Array(digest))
		.map((b) => b.toString(16).padStart(2, '0'))
		.join('');
}

export type IssueResult = { ok: true } | { ok: false; reason: 'rate_limited' };

/**
 * Issue a one-time login code for an email: rate-limits to one per 60s, stores
 * a hash + 10-minute expiry, and emails the plaintext code. Always call in a
 * way that returns a neutral response to the client (no account enumeration).
 */
export async function issueLoginCode(db: AppDatabase, emailRaw: string): Promise<IssueResult> {
	const email = emailRaw.trim().toLowerCase();

	// Rate-limit: reject if a code was issued for this email in the last 60s.
	const cutoff = new Date(Date.now() - RESEND_WINDOW_MS)
		.toISOString()
		.replace('T', ' ')
		.slice(0, 19);
	const code = generateCode();
	const codeHash = await hashCode(code);
	const expiresAt = new Date(Date.now() + CODE_TTL_MS).toISOString().replace('T', ' ').slice(0, 19);

	// One statement makes the rate-limit check and insert atomic on D1/SQLite.
	const issued = await db.all<{ id: number }>(sql`
		insert into ${paradiseLoginCodes} (email, code_hash, expires_at)
		select ${email}, ${codeHash}, ${expiresAt}
		where not exists (
			select 1 from ${paradiseLoginCodes}
			where ${paradiseLoginCodes.email} = ${email}
			and ${paradiseLoginCodes.createdAt} > ${cutoff}
		)
		returning id
	`);
	if (issued.length === 0) return { ok: false, reason: 'rate_limited' };

	// A send failure must never surface a 500 to the client (that would both
	// break the UX and leak that the email path was reached). Log server-side
	// and still return a neutral success.
	try {
		await sendLoginCode(db, email, code);
	} catch (err) {
		console.error('sendLoginCode failed', err);
	}

	return { ok: true };
}

export type VerifyResult =
	{ ok: true } | { ok: false; reason: 'invalid' | 'expired' | 'too_many_attempts' };

/**
 * Verify a submitted code against the most recent unconsumed code for an email.
 * On success, marks the code consumed. Tracks attempts (max 5) and expiry.
 */
export async function verifyLoginCode(
	db: AppDatabase,
	emailRaw: string,
	code: string
): Promise<VerifyResult> {
	const email = emailRaw.trim().toLowerCase();
	const now = new Date().toISOString().replace('T', ' ').slice(0, 19);

	const rows = await db
		.select()
		.from(paradiseLoginCodes)
		.where(and(eq(paradiseLoginCodes.email, email), isNull(paradiseLoginCodes.consumedAt)))
		.orderBy(sql`${paradiseLoginCodes.createdAt} desc`)
		.limit(1);

	const row = rows[0];
	if (!row) return { ok: false, reason: 'invalid' };

	if (row.attempts >= MAX_ATTEMPTS) {
		await db
			.update(paradiseLoginCodes)
			.set({ consumedAt: now })
			.where(eq(paradiseLoginCodes.id, row.id));
		return { ok: false, reason: 'too_many_attempts' };
	}

	if (row.expiresAt <= now) {
		await db
			.update(paradiseLoginCodes)
			.set({ consumedAt: now })
			.where(eq(paradiseLoginCodes.id, row.id));
		return { ok: false, reason: 'expired' };
	}

	const submittedHash = await hashCode(code.trim());
	if (submittedHash !== row.codeHash) {
		await db
			.update(paradiseLoginCodes)
			.set({ attempts: sql`${paradiseLoginCodes.attempts} + 1` })
			.where(
				and(
					eq(paradiseLoginCodes.id, row.id),
					isNull(paradiseLoginCodes.consumedAt),
					lt(paradiseLoginCodes.attempts, MAX_ATTEMPTS)
				)
			);
		return { ok: false, reason: 'invalid' };
	}

	// Success: burn the code so it can't be reused.
	const claimed = await db
		.update(paradiseLoginCodes)
		.set({ consumedAt: now })
		.where(
			and(
				eq(paradiseLoginCodes.id, row.id),
				isNull(paradiseLoginCodes.consumedAt),
				lt(paradiseLoginCodes.attempts, MAX_ATTEMPTS),
				gt(paradiseLoginCodes.expiresAt, now)
			)
		)
		.returning({ id: paradiseLoginCodes.id });
	return claimed.length ? { ok: true } : { ok: false, reason: 'invalid' };
}

// ---------------------------------------------------------------------------
// Optional passwords (PBKDF2-SHA256 via Web Crypto — Workers compatible).
// Stored as `pbkdf2$<iterations>$<saltB64>$<hashB64>`.
// ---------------------------------------------------------------------------

const PBKDF2_ITERATIONS = 100_000;
export const MIN_PASSWORD_LENGTH = 8;

function toB64(bytes: Uint8Array): string {
	let s = '';
	for (const b of bytes) s += String.fromCharCode(b);
	return btoa(s);
}

function fromB64(value: string): Uint8Array<ArrayBuffer> {
	const s = atob(value);
	const out = new Uint8Array(s.length);
	for (let i = 0; i < s.length; i++) out[i] = s.charCodeAt(i);
	return out;
}

async function pbkdf2(password: string, salt: Uint8Array<ArrayBuffer>, iterations: number) {
	const key = await crypto.subtle.importKey('raw', encoder.encode(password), 'PBKDF2', false, [
		'deriveBits'
	]);
	const bits = await crypto.subtle.deriveBits(
		{ name: 'PBKDF2', hash: 'SHA-256', salt, iterations },
		key,
		256
	);
	return new Uint8Array(bits);
}

export async function hashPassword(password: string): Promise<string> {
	const salt = crypto.getRandomValues(new Uint8Array(16));
	const hash = await pbkdf2(password, salt, PBKDF2_ITERATIONS);
	return `pbkdf2$${PBKDF2_ITERATIONS}$${toB64(salt)}$${toB64(hash)}`;
}

export async function verifyPassword(password: string, stored: string | null): Promise<boolean> {
	if (!stored) return false;
	const [scheme, iter, saltB64, hashB64] = stored.split('$');
	const iterations = Number(iter);
	if (scheme !== 'pbkdf2' || !Number.isInteger(iterations) || !saltB64 || !hashB64) return false;
	const expected = fromB64(hashB64);
	const actual = await pbkdf2(password, fromB64(saltB64), iterations);
	if (actual.length !== expected.length) return false;
	let diff = 0;
	for (let i = 0; i < actual.length; i++) diff |= actual[i] ^ expected[i];
	return diff === 0;
}
