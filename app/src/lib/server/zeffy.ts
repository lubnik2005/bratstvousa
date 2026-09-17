import { createHmac, timingSafeEqual } from 'node:crypto';
import { and, eq, sql } from 'drizzle-orm';
import type { AppDatabase } from '$lib/server/db';
import {
	campRegistrations,
	zeffyPayments,
	registrationEvents,
	cashEligibilityRules
} from '$lib/server/db/schema';
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
	// Discount applied to the checkout. Observed real webhook shape:
	//   "discount": { "code": "TESTINGNIK", "amount": 35000 }
	// Older guesses (discount_code / promo_code) are kept as fallbacks. The code
	// is a reference/opportunistic-validation signal only — never proof of
	// eligibility (spec §22).
	discount?: { code?: string | null; amount?: number | null } | null;
	discount_code?: string | null;
	discountCode?: string | null;
	promo_code?: string | null;
	// Observed: top-level "contact" is the Zeffy contact UUID.
	contact?: string | null;
	contact_id?: string | null;
	campaign_id?: string | null;
	campaign_type?: string | null;
	description?: string | null;
	occurrence_id?: string | null;
	// Observed: { type: "free" | "card" | ..., brand, last4 } for the checkout.
	payment_method?: { type?: string | null; brand?: string | null; last4?: string | null } | null;
	buyer?: {
		email?: string | null;
		first_name?: string | null;
		last_name?: string | null;
		id?: string | null;
		contact_id?: string | null;
	} | null;
	buyer_questions?: ZeffyQuestionAnswer[] | null;
	items?: Array<{
		id?: string | null;
		ticket_id?: string | null;
		type?: string | null;
		currency?: string | null;
		// Ticket FACE VALUE in cents (e.g. 35000) — present even when the checkout
		// total is $0 because of a 100% discount.
		amount?: number | null;
		rate_id?: string | null;
		rate_title?: string | null;
		contact_id?: string | null;
		questions?: ZeffyQuestionAnswer[] | null;
	}> | null;
}

/** Identifiers we opportunistically capture from a Zeffy payment for QR lookup. */
export interface ZeffyIdentifiers {
	ticketId: string | null;
	contactId: string | null;
	campaignId: string | null;
	discountCode: string | null;
	/** Ticket face value in cents (items[0].amount), independent of the discount. */
	faceValueCents: number | null;
}

/** Pulls the useful Zeffy identifiers off a payment payload (best-effort). */
export function extractZeffyIdentifiers(payment: ZeffyPaymentPayload): ZeffyIdentifiers {
	const firstItem = payment.items?.[0] ?? null;
	const face = firstItem?.amount;
	return {
		ticketId: firstItem?.ticket_id ?? firstItem?.id ?? null,
		contactId:
			payment.contact ??
			payment.contact_id ??
			firstItem?.contact_id ??
			payment.buyer?.contact_id ??
			payment.buyer?.id ??
			null,
		campaignId: payment.campaign_id ?? null,
		discountCode:
			payment.discount?.code ??
			payment.discount_code ??
			payment.discountCode ??
			payment.promo_code ??
			null,
		faceValueCents: typeof face === 'number' && Number.isFinite(face) ? face : null
	};
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
 *
 * Decision logic (spec §11). A $0 Zeffy checkout is NOT proof of free admission;
 * the internal registration's cash_eligible flag is authoritative (spec §2):
 *   - refunded/disputed/deleted -> zeffy_payments 'refunded' + reg REFUNDED
 *   - amount  > 0            -> ONLINE / PAID   (amount_paid = amount, due = 0)
 *   - amount == 0 & eligible -> CASH   / DUE    (due = event_price_cents)
 *                               (+ 'discount_code_mismatch' audit if the code on
 *                                the payload differs from the church's rule)
 *   - amount == 0 & !eligible-> REVIEW_REQUIRED (due = event_price_cents) + audit
 *                               (payload notes which rule/church the code leaked from)
 *   - no matching registration -> 'unmatched' + email the payer (once)
 *
 * Registration-code abuse (spec §23): once a registration is linked to a Zeffy
 * payment, a *different* payment claiming the same code is flagged, not applied.
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
	const ids = extractZeffyIdentifiers(payment);

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
				.set({
					paymentStatus: 'REFUNDED',
					amountPaidCents: 0,
					paidAt: null,
					updatedAt: now
				})
				.where(eq(campRegistrations.id, matchedRegId));
			await insertRegistrationEvent(db, {
				registrationId: matchedRegId,
				event: 'payment_refunded',
				amountCents: payment.amount ?? null,
				payload: { zeffyPaymentId, status: payment.status ?? null }
			});
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
			ids,
			matchedRegistrationId: null,
			matchStatus: 'unmatched',
			now
		});
		return;
	}

	// --- Find the matching registration (code first, email as fallback) ---
	let reg:
		| {
				id: number;
				churchId: number | null;
				eventSlug: string;
				cashEligible: boolean;
				feeWaived: boolean;
				eventPriceCents: number | null;
				amount: number | null;
				zeffyPaymentId: string | null;
		  }
		| undefined;
	const regCols = {
		id: campRegistrations.id,
		churchId: campRegistrations.churchId,
		eventSlug: campRegistrations.eventSlug,
		cashEligible: campRegistrations.cashEligible,
		feeWaived: campRegistrations.feeWaived,
		eventPriceCents: campRegistrations.eventPriceCents,
		amount: campRegistrations.amount,
		zeffyPaymentId: campRegistrations.zeffyPaymentId
	};
	if (code) {
		reg = (
			await db
				.select(regCols)
				.from(campRegistrations)
				.where(sql`upper(${campRegistrations.confirmationCode}) = ${code.toUpperCase()}`)
				.limit(1)
		)[0];
	}
	if (!reg && buyerEmail) {
		reg = (
			await db
				.select(regCols)
				.from(campRegistrations)
				.where(sql`lower(${campRegistrations.email}) = ${buyerEmail.toLowerCase()}`)
				.limit(1)
		)[0];
	}

	const alreadyProcessed = (
		await db
			.select({ id: zeffyPayments.id })
			.from(zeffyPayments)
			.where(eq(zeffyPayments.zeffyPaymentId, zeffyPaymentId))
			.limit(1)
	)[0];

	if (reg) {
		// --- Registration-code abuse guard (spec §23) ---
		// If this registration is already linked to a *different* Zeffy payment,
		// do not overwrite it; flag the incoming one for manual review.
		if (reg.zeffyPaymentId && reg.zeffyPaymentId !== zeffyPaymentId) {
			await upsertZeffyPayment(db, {
				zeffyPaymentId,
				payment,
				code,
				buyerEmail,
				ids,
				matchedRegistrationId: reg.id,
				matchStatus: 'duplicate',
				now
			});
			await insertRegistrationEvent(db, {
				registrationId: reg.id,
				event: 'duplicate_registration_code',
				amountCents: payment.amount ?? null,
				payload: {
					zeffyPaymentId,
					existingZeffyPaymentId: reg.zeffyPaymentId
				}
			});
			return;
		}

		// Price snapshot: prefer the cents snapshot, fall back to legacy dollars.
		const priceCents = reg.eventPriceCents ?? (reg.amount != null ? reg.amount * 100 : 0);
		const amount = payment.amount ?? 0;

		// Audit payload shared by every branch below.
		const auditPayload: Record<string, unknown> = {
			zeffyPaymentId,
			cashEligible: reg.cashEligible,
			discountCode: ids.discountCode,
			faceValueCents: ids.faceValueCents,
			campaignId: ids.campaignId
		};
		const extraEvents: Array<{ event: string; amountCents: number | null }> = [];

		// --- Campaign guard (spec §22) ---
		// If any active rule for this event pins a Zeffy campaign, the ticket must
		// come from one of those campaigns; otherwise force staff review regardless
		// of amount or cash eligibility (a CAMP- code used on a different form).
		const allowedCampaigns = await findCampaignIdsForEvent(db, reg.eventSlug);
		const campaignMismatch =
			allowedCampaigns.length > 0 &&
			(ids.campaignId == null || !allowedCampaigns.includes(ids.campaignId));
		auditPayload.allowedCampaignIds = allowedCampaigns;
		auditPayload.campaignMatch = allowedCampaigns.length > 0 ? !campaignMismatch : null;

		let regUpdate: Record<string, unknown>;
		let auditEvent: string;
		if (campaignMismatch) {
			regUpdate = {
				paymentStatus: 'REVIEW_REQUIRED',
				amountPaidCents: 0,
				amountDueCents: priceCents
			};
			auditEvent = 'campaign_mismatch';
			auditPayload.zeffyAmountCents = amount;
		} else if (amount > 0) {
			// Normal paid online checkout.
			regUpdate = {
				paymentMethod: 'ONLINE',
				paymentStatus: 'PAID',
				amountPaidCents: amount,
				amountDueCents: 0,
				paidAt: now
			};
			auditEvent = 'online_payment';
		} else {
			// $0 checkout. Opportunistically compare the discount code on the payload
			// with the rule for this registrant's church/event. The comparison is
			// informational only — cash_eligible remains the authority (spec §22).
			const rule = await findRuleFor(db, reg.churchId, reg.eventSlug);
			const expectedCode = rule?.discountCode ?? null;
			const codeMatch =
				ids.discountCode != null && expectedCode != null
					? ids.discountCode.toUpperCase() === expectedCode.toUpperCase()
					: null;
			auditPayload.expectedCode = expectedCode;
			auditPayload.codeMatch = codeMatch;
			auditPayload.ruleId = rule?.id ?? null;

			if (reg.cashEligible) {
				// Authorized cash-at-check-in: $0 Zeffy checkout, balance still due.
				regUpdate = {
					paymentMethod: 'CASH',
					paymentStatus: 'DUE',
					amountPaidCents: 0,
					amountDueCents: priceCents
				};
				auditEvent = 'cash_due';
				// Eligible but used the wrong/no code: still DUE, just flag it.
				if (codeMatch !== true) {
					extraEvents.push({ event: 'discount_code_mismatch', amountCents: priceCents });
				}
			} else {
				// Unauthorized $0 checkout (leaked discount code, etc.): do NOT mark
				// paid — require staff review (spec §8/§11). If the code belongs to
				// another church's rule, record where it leaked from.
				regUpdate = {
					paymentStatus: 'REVIEW_REQUIRED',
					amountPaidCents: 0,
					amountDueCents: priceCents
				};
				auditEvent = 'unauthorized_zero_dollar';
				const leaked = await findRuleByCode(db, ids.discountCode, reg.eventSlug);
				auditPayload.leakedFromRuleId = leaked?.id ?? null;
				auditPayload.leakedFromChurchId = leaked?.churchId ?? null;
			}
		}

		await db
			.update(campRegistrations)
			.set({
				...regUpdate,
				zeffyPaymentId,
				zeffyTicketId: ids.ticketId,
				zeffyContactId: ids.contactId,
				zeffyCampaignId: ids.campaignId,
				zeffyDiscountCode: ids.discountCode,
				updatedAt: now
			})
			.where(eq(campRegistrations.id, reg.id));

		await upsertZeffyPayment(db, {
			zeffyPaymentId,
			payment,
			code,
			buyerEmail,
			ids,
			matchedRegistrationId: reg.id,
			matchStatus: 'matched',
			now
		});

		if (!alreadyProcessed) {
			await insertRegistrationEvent(db, {
				registrationId: reg.id,
				event: auditEvent,
				amountCents: amount,
				payload: auditPayload
			});
			for (const extra of extraEvents) {
				await insertRegistrationEvent(db, {
					registrationId: reg.id,
					event: extra.event,
					amountCents: extra.amountCents,
					payload: auditPayload
				});
			}
		}
		return;
	}

	// --- No match: record unmatched + email payer (only once) ---
	await upsertZeffyPayment(db, {
		zeffyPaymentId,
		payment,
		code,
		buyerEmail,
		ids,
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

/**
 * Active cash-eligibility rule for a registrant's (church, event), if any.
 * Best-effort: returns null on any failure so payment processing never breaks.
 */
async function findRuleFor(
	db: AppDatabase,
	churchId: number | null,
	eventSlug: string
): Promise<{ id: number; discountCode: string | null } | null> {
	if (churchId == null) return null;
	try {
		const row = (
			await db
				.select({ id: cashEligibilityRules.id, discountCode: cashEligibilityRules.discountCode })
				.from(cashEligibilityRules)
				.where(
					and(
						eq(cashEligibilityRules.churchId, churchId),
						eq(cashEligibilityRules.eventSlug, eventSlug),
						eq(cashEligibilityRules.active, true)
					)
				)
				.limit(1)
		)[0];
		return row ?? null;
	} catch (err) {
		console.warn('cash_eligibility_rules lookup failed:', err);
		return null;
	}
}

/**
 * Which active rule (for this event) owns a given discount code — used to record
 * where a leaked code came from. Case-insensitive. Best-effort.
 */
async function findRuleByCode(
	db: AppDatabase,
	discountCode: string | null,
	eventSlug: string
): Promise<{ id: number; churchId: number | null } | null> {
	if (!discountCode) return null;
	try {
		const row = (
			await db
				.select({ id: cashEligibilityRules.id, churchId: cashEligibilityRules.churchId })
				.from(cashEligibilityRules)
				.where(
					and(
						sql`upper(${cashEligibilityRules.discountCode}) = ${discountCode.toUpperCase()}`,
						eq(cashEligibilityRules.eventSlug, eventSlug),
						eq(cashEligibilityRules.active, true)
					)
				)
				.limit(1)
		)[0];
		return row ?? null;
	} catch (err) {
		console.warn('cash_eligibility_rules code lookup failed:', err);
		return null;
	}
}

/**
 * Distinct Zeffy campaign ids pinned by active rules for an event. Empty array
 * means "no campaign restriction configured". Best-effort.
 */
async function findCampaignIdsForEvent(db: AppDatabase, eventSlug: string): Promise<string[]> {
	try {
		const rows = await db
			.select({ campaignId: cashEligibilityRules.zeffyCampaignId })
			.from(cashEligibilityRules)
			.where(
				and(
					eq(cashEligibilityRules.eventSlug, eventSlug),
					eq(cashEligibilityRules.active, true),
					sql`${cashEligibilityRules.zeffyCampaignId} IS NOT NULL AND ${cashEligibilityRules.zeffyCampaignId} <> ''`
				)
			);
		return [...new Set(rows.map((r) => r.campaignId).filter((c): c is string => !!c))];
	} catch (err) {
		console.warn('cash_eligibility_rules campaign lookup failed:', err);
		return [];
	}
}

/** Appends a row to the registration_events audit trail (best-effort). */
async function insertRegistrationEvent(
	db: AppDatabase,
	args: {
		registrationId: number;
		event: string;
		amountCents?: number | null;
		staffUser?: string | null;
		payload?: unknown;
	}
): Promise<void> {
	try {
		await db.insert(registrationEvents).values({
			registrationId: args.registrationId,
			event: args.event,
			amountCents: args.amountCents ?? null,
			staffUser: args.staffUser ?? null,
			payload: args.payload ?? null
		});
	} catch (err) {
		// Audit is best-effort: never let it break payment processing.
		console.error('registration_events insert failed:', err);
	}
}

async function upsertZeffyPayment(
	db: AppDatabase,
	args: {
		zeffyPaymentId: string;
		payment: ZeffyPaymentPayload;
		code: string | null;
		buyerEmail: string | null;
		ids?: ZeffyIdentifiers;
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
