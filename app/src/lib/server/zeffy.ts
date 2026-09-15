import { createHmac, timingSafeEqual } from 'node:crypto';
import { and, eq, sql } from 'drizzle-orm';
import type { AppDatabase } from '$lib/server/db';
import { campRegistrations, zeffyPayments } from '$lib/server/db/schema';
import { sendUnmatchedPayment } from '$lib/server/email/camp';

const ZEFFY_API_BASE = 'https://api.zeffy.com';
const SIGNATURE_TOLERANCE_SECONDS = 5 * 60;

/** Minimal shape of a Zeffy QuestionAnswer. */
interface ZeffyQuestionAnswer {
	question?: string;
	type?: string;
	answer?: string | string[] | boolean | null;
}

/** Minimal shape of a Zeffy Payment (only fields we use). */
export interface ZeffyPaymentPayload {
	id: string;
	object?: string;
	created?: number;
	amount?: number;
	currency?: string;
	status?: string;
	refund_status?: string;
	dispute?: unknown;
	buyer?: {
		email?: string | null;
		first_name?: string | null;
		last_name?: string | null;
	} | null;
	buyer_questions?: ZeffyQuestionAnswer[] | null;
	items?: Array<{ questions?: ZeffyQuestionAnswer[] | null }> | null;
}

/**
 * Verifies a Zeffy webhook signature.
 * Header format: `Zeffy-Signature: t=<unix seconds>,v1=<hex hmac>`
 * v1 = hex HMAC-SHA256 of `${t}.${rawBody}` keyed with the whsec_ secret.
 */
export function verifySignature(
	rawBody: string,
	signatureHeader: string | null,
	secret: string
): boolean {
	if (!signatureHeader || !secret) return false;

	let t: string | undefined;
	let v1: string | undefined;
	for (const part of signatureHeader.split(',')) {
		const [k, val] = part.split('=');
		if (k?.trim() === 't') t = val?.trim();
		else if (k?.trim() === 'v1') v1 = val?.trim();
	}
	if (!t || !v1) return false;

	// Replay guard: reject stale timestamps.
	const ts = Number(t);
	if (!Number.isFinite(ts)) return false;
	const nowSec = Math.floor(Date.now() / 1000);
	if (Math.abs(nowSec - ts) > SIGNATURE_TOLERANCE_SECONDS) return false;

	const expected = createHmac('sha256', secret).update(`${t}.${rawBody}`).digest('hex');

	const a = Buffer.from(expected, 'hex');
	const b = Buffer.from(v1, 'hex');
	if (a.length !== b.length) return false;
	return timingSafeEqual(a, b);
}

/** Fetches a single payment by id from the Zeffy API. Returns null on 404. */
export async function fetchPayment(
	id: string,
	apiKey: string
): Promise<ZeffyPaymentPayload | null> {
	const res = await fetch(`${ZEFFY_API_BASE}/api/v1/payments/${id}`, {
		headers: { Authorization: `Bearer ${apiKey}` },
		signal: AbortSignal.timeout(10000)
	});
	if (res.status === 404) return null;
	if (!res.ok) {
		throw new Error(`Zeffy fetchPayment ${id} failed: ${res.status}`);
	}
	return (await res.json()) as ZeffyPaymentPayload;
}

const CAMP_CODE_RE = /CAMP-[A-Z0-9]+/i;

/** Extracts a CAMP-XXXXX code from a payment's buyer_questions or item questions. */
export function extractCampCode(payment: ZeffyPaymentPayload): string | null {
	const scan = (answers?: ZeffyQuestionAnswer[] | null): string | null => {
		if (!answers) return null;
		for (const qa of answers) {
			const ans = qa?.answer;
			if (typeof ans === 'string') {
				const m = ans.match(CAMP_CODE_RE);
				if (m) return m[0].toUpperCase();
			} else if (Array.isArray(ans)) {
				for (const a of ans) {
					if (typeof a === 'string') {
						const m = a.match(CAMP_CODE_RE);
						if (m) return m[0].toUpperCase();
					}
				}
			}
		}
		return null;
	};

	const fromBuyer = scan(payment.buyer_questions);
	if (fromBuyer) return fromBuyer;

	for (const item of payment.items ?? []) {
		const fromItem = scan(item?.questions);
		if (fromItem) return fromItem;
	}
	return null;
}

function isRefundedOrDisputed(payment: ZeffyPaymentPayload): boolean {
	const rs = (payment.refund_status ?? 'none').toLowerCase();
	return rs === 'partial' || rs === 'full' || payment.dispute != null;
}

/**
 * Applies a Zeffy payment to the DB. Idempotent by zeffy_payment_id.
 *   - refunded/disputed/deleted -> mark zeffy_payments 'refunded' + revert reg to 'unpaid'
 *   - succeeded + CAMP code (or buyer email) matches a registration -> mark reg 'paid' + 'matched'
 *   - otherwise -> 'unmatched' + email the payer
 *
 * `deleted` = true when the payment was deleted upstream (404 on refetch).
 */
export async function applyPayment(
	db: AppDatabase,
	payment: ZeffyPaymentPayload,
	opts: { apiKey?: string; deleted?: boolean } = {}
): Promise<void> {
	const zeffyPaymentId = payment.id;
	const now = new Date().toISOString();
	const code = extractCampCode(payment);
	const buyerEmail = payment.buyer?.email?.trim() || null;

	// --- Refund / dispute / deletion path: revert any matched registration ---
	if (opts.deleted || isRefundedOrDisputed(payment)) {
		const existing = (
			await db
				.select()
				.from(zeffyPayments)
				.where(eq(zeffyPayments.zeffyPaymentId, zeffyPaymentId))
				.limit(1)
		)[0];

		const matchedRegId = existing?.matchedRegistrationId ?? null;
		if (matchedRegId != null) {
			await db
				.update(campRegistrations)
				.set({ paymentStatus: 'unpaid', paidAt: null, updatedAt: now })
				.where(eq(campRegistrations.id, matchedRegId));
		}

		if (existing) {
			await db
				.update(zeffyPayments)
				.set({ matchStatus: 'refunded', status: payment.status ?? existing.status, updatedAt: now })
				.where(eq(zeffyPayments.zeffyPaymentId, zeffyPaymentId));
		} else {
			await db.insert(zeffyPayments).values({
				zeffyPaymentId,
				status: payment.status ?? 'refunded',
				amount: payment.amount ?? null,
				currency: payment.currency ?? null,
				buyerEmail,
				buyerFirstName: payment.buyer?.first_name ?? null,
				buyerLastName: payment.buyer?.last_name ?? null,
				confirmationCode: code,
				matchedRegistrationId: null,
				matchStatus: 'refunded',
				rawJson: JSON.stringify(payment),
				createdAt: now,
				updatedAt: now
			});
		}
		return;
	}

	// --- Only succeeded payments proceed to matching ---
	const status = (payment.status ?? '').toLowerCase();
	if (status && status !== 'succeeded') {
		// Record non-succeeded payments too, but don't match/mark paid.
		await upsertZeffyPayment(db, {
			zeffyPaymentId,
			payment,
			code,
			buyerEmail,
			matchedRegistrationId: null,
			matchStatus: 'unmatched',
			now
		});
		return;
	}

	// --- Find the matching registration ---
	let regId: number | null = null;
	if (code) {
		const row = (
			await db
				.select({ id: campRegistrations.id })
				.from(campRegistrations)
				.where(sql`upper(${campRegistrations.confirmationCode}) = ${code.toUpperCase()}`)
				.limit(1)
		)[0];
		if (row) regId = row.id;
	}
	if (regId == null && buyerEmail) {
		const row = (
			await db
				.select({ id: campRegistrations.id })
				.from(campRegistrations)
				.where(sql`lower(${campRegistrations.email}) = ${buyerEmail.toLowerCase()}`)
				.limit(1)
		)[0];
		if (row) regId = row.id;
	}

	const alreadyProcessed = (
		await db
			.select({ id: zeffyPayments.id })
			.from(zeffyPayments)
			.where(eq(zeffyPayments.zeffyPaymentId, zeffyPaymentId))
			.limit(1)
	)[0];

	if (regId != null) {
		await db
			.update(campRegistrations)
			.set({ paymentStatus: 'paid', zeffyPaymentId, paidAt: now, updatedAt: now })
			.where(eq(campRegistrations.id, regId));

		await upsertZeffyPayment(db, {
			zeffyPaymentId,
			payment,
			code,
			buyerEmail,
			matchedRegistrationId: regId,
			matchStatus: 'matched',
			now
		});
		return;
	}

	// --- No match: record unmatched + email payer (only once) ---
	await upsertZeffyPayment(db, {
		zeffyPaymentId,
		payment,
		code,
		buyerEmail,
		matchedRegistrationId: null,
		matchStatus: 'unmatched',
		now
	});

	if (!alreadyProcessed && buyerEmail) {
		try {
			await sendUnmatchedPayment(db, {
				email: buyerEmail,
				firstName: payment.buyer?.first_name ?? null
			});
		} catch (err) {
			console.error('unmatched-payment email failed:', err);
		}
	}
}

async function upsertZeffyPayment(
	db: AppDatabase,
	args: {
		zeffyPaymentId: string;
		payment: ZeffyPaymentPayload;
		code: string | null;
		buyerEmail: string | null;
		matchedRegistrationId: number | null;
		matchStatus: string;
		now: string;
	}
): Promise<void> {
	const { zeffyPaymentId, payment, code, buyerEmail, matchedRegistrationId, matchStatus, now } =
		args;
	const existing = (
		await db
			.select({ id: zeffyPayments.id })
			.from(zeffyPayments)
			.where(eq(zeffyPayments.zeffyPaymentId, zeffyPaymentId))
			.limit(1)
	)[0];

	const values = {
		status: payment.status ?? null,
		amount: payment.amount ?? null,
		currency: payment.currency ?? null,
		buyerEmail,
		buyerFirstName: payment.buyer?.first_name ?? null,
		buyerLastName: payment.buyer?.last_name ?? null,
		confirmationCode: code,
		matchedRegistrationId,
		matchStatus,
		rawJson: JSON.stringify(payment),
		updatedAt: now
	};

	if (existing) {
		await db
			.update(zeffyPayments)
			.set(values)
			.where(eq(zeffyPayments.zeffyPaymentId, zeffyPaymentId));
	} else {
		await db.insert(zeffyPayments).values({ zeffyPaymentId, createdAt: now, ...values });
	}
}
