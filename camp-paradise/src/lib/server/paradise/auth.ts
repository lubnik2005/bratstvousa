import { and, eq, gt, isNull, sql } from 'drizzle-orm';
import type { AppDatabase } from '$lib/server/db';
import { paradiseLoginCodes } from '$lib/server/db/schema';
import { sendLoginCode } from '$lib/server/email/paradise';

const CODE_TTL_MS = 10 * 60 * 1000; // 10 minutes
const RESEND_WINDOW_MS = 60 * 1000; // 1 code per email per 60s
const MAX_ATTEMPTS = 5;

/** Unambiguous digits (no 0/1 to avoid confusion with O/I). */
const DIGITS = '23456789';

function generateCode(): string {
	let s = '';
	for (let i = 0; i < 6; i++) s += DIGITS[Math.floor(Math.random() * DIGITS.length)];
	return s;
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
	const recent = await db
		.select({ id: paradiseLoginCodes.id })
		.from(paradiseLoginCodes)
		.where(and(eq(paradiseLoginCodes.email, email), gt(paradiseLoginCodes.createdAt, cutoff)))
		.limit(1);
	if (recent.length > 0) return { ok: false, reason: 'rate_limited' };

	const code = generateCode();
	const codeHash = await hashCode(code);
	const expiresAt = new Date(Date.now() + CODE_TTL_MS).toISOString().replace('T', ' ').slice(0, 19);

	await db.insert(paradiseLoginCodes).values({ email, codeHash, expiresAt });
	await sendLoginCode(db, email, code);
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

	if (row.expiresAt < now) {
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
			.set({ attempts: row.attempts + 1 })
			.where(eq(paradiseLoginCodes.id, row.id));
		return { ok: false, reason: 'invalid' };
	}

	// Success: burn the code so it can't be reused.
	await db
		.update(paradiseLoginCodes)
		.set({ consumedAt: now })
		.where(eq(paradiseLoginCodes.id, row.id));
	return { ok: true };
}
