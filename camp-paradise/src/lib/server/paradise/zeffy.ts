import { and, eq, sql } from 'drizzle-orm';
import type { DrizzleD1Database } from 'drizzle-orm/d1';
import {
	paradiseAttendees,
	paradiseEvents,
	paradiseLedger,
	paradiseZeffyPayments
} from '$lib/server/db/schema';

export const ZEFFY_API_BASE = 'https://api.zeffy.com';
const SIGNATURE_TOLERANCE_SECONDS = 300;

type Db = DrizzleD1Database<Record<string, never>> | DrizzleD1Database;

export interface ZeffyItem {
	id: string;
	object?: string;
	type?: string;
	amount?: number;
	currency?: string;
	rate_id?: string | null;
	rate_title?: string | null;
	contact_id?: string | null;
	questions?: Array<{ question?: string; type?: string; answer?: string | null }>;
}

export interface ZeffyPaymentPayload {
	id: string;
	object?: string;
	created?: number;
	amount?: number;
	eligible_amount?: number;
	currency?: string;
	status?: string;
	type?: string;
	refund_status?: string | null;
	refunds?: unknown[];
	dispute?: unknown | null;
	description?: string | null;
	contact?: string | null;
	contact_id?: string | null;
	campaign_id?: string | null;
	campaign_type?: string | null;
	campaign_category?: string | null;
	buyer?: {
		email?: string | null;
		first_name?: string | null;
		last_name?: string | null;
	} | null;
	buyer_questions?: Array<{ question?: string; type?: string; answer?: string | null }>;
	items?: ZeffyItem[];
	metadata?: Record<string, unknown>;
}

const enc = new TextEncoder();

const toHex = (buf: ArrayBuffer): string =>
	Array.from(new Uint8Array(buf))
		.map((b) => b.toString(16).padStart(2, '0'))
		.join('');

const safeEqual = (a: string, b: string): boolean => {
	if (a.length !== b.length) return false;
	let diff = 0;
	for (let i = 0; i < a.length; i++) diff |= a.charCodeAt(i) ^ b.charCodeAt(i);
	return diff === 0;
};

/** Verify `Zeffy-Signature: t=<unix>,v1=<hex hmac sha256 of "${t}.${rawBody}">`. */
export async function verifySignature(
	rawBody: string,
	header: string | null,
	secret: string
): Promise<boolean> {
	if (!header || !secret) return false;
	const parts = Object.fromEntries(
		header.split(',').map((kv) => {
			const idx = kv.indexOf('=');
			return [kv.slice(0, idx).trim(), kv.slice(idx + 1).trim()];
		})
	) as Record<string, string>;
	const t = Number(parts.t);
	const v1 = parts.v1;
	if (!Number.isFinite(t) || !v1) return false;
	const now = Math.floor(Date.now() / 1000);
	if (Math.abs(now - t) > SIGNATURE_TOLERANCE_SECONDS) return false;
	const key = await crypto.subtle.importKey(
		'raw',
		enc.encode(secret),
		{ name: 'HMAC', hash: 'SHA-256' },
		false,
		['sign']
	);
	const sig = toHex(await crypto.subtle.sign('HMAC', key, enc.encode(`${t}.${rawBody}`)));
	return safeEqual(sig, v1.toLowerCase());
}

export async function fetchPayment(
	id: string,
	apiKey: string
): Promise<ZeffyPaymentPayload | null> {
	const res = await fetch(`${ZEFFY_API_BASE}/api/v1/payments/${encodeURIComponent(id)}`, {
		headers: { Authorization: `Bearer ${apiKey}`, Accept: 'application/json' }
	});
	if (res.status === 404) return null;
	if (!res.ok) throw new Error(`Zeffy fetchPayment ${id} failed: ${res.status}`);
	return (await res.json()) as ZeffyPaymentPayload;
}

export interface ListPaymentsOptions {
	createdGt?: number;
	status?: string;
	limit?: number;
	maxPages?: number;
}

/** Paginate GET /api/v1/payments (response {data, has_more, next_cursor}). */
export async function listPayments(
	apiKey: string,
	opts: ListPaymentsOptions = {}
): Promise<ZeffyPaymentPayload[]> {
	const out: ZeffyPaymentPayload[] = [];
	let cursor: string | undefined;
	const maxPages = opts.maxPages ?? 10;
	for (let page = 0; page < maxPages; page++) {
		const q = new URLSearchParams({ limit: String(opts.limit ?? 100) });
		if (opts.status) q.set('status', opts.status);
		if (opts.createdGt) q.set('created[gt]', String(opts.createdGt));
		if (cursor) q.set('starting_after', cursor);
		const res = await fetch(`${ZEFFY_API_BASE}/api/v1/payments?${q}`, {
			headers: { Authorization: `Bearer ${apiKey}`, Accept: 'application/json' }
		});
		if (!res.ok) throw new Error(`Zeffy listPayments failed: ${res.status}`);
		const body = (await res.json()) as {
			data?: ZeffyPaymentPayload[];
			has_more?: boolean;
			next_cursor?: string | null;
		};
		out.push(...(body.data ?? []));
		if (!body.has_more || !body.next_cursor) break;
		cursor = body.next_cursor;
	}
	return out;
}

export const normalizeEmail = (e: string | null | undefined): string =>
	(e ?? '').trim().toLowerCase();

export const isRefundedOrDisputed = (p: ZeffyPaymentPayload): boolean =>
	p.refund_status === 'partial' || p.refund_status === 'full' || p.dispute != null;

const now = () => sql`datetime('now')` as unknown as string;

export interface ApplyPaymentOptions {
	apiKey?: string;
	deleted?: boolean;
}

export type ApplyResult = {
	action: 'credited' | 'reversed' | 'skipped' | 'ignored';
	amountCents: number;
	eventId: number | null;
};

type PaymentRow = typeof paradiseZeffyPayments.$inferInsert;

function paymentRow(
	payment: ZeffyPaymentPayload,
	matchStatus: 'matched' | 'unmatched' | 'refunded',
	eventId: number | null,
	creditedCents: number
): PaymentRow {
	return {
		zeffyPaymentId: payment.id,
		status: payment.status ?? 'unknown',
		amount: payment.amount ?? 0,
		currency: payment.currency ?? 'usd',
		buyerEmail: normalizeEmail(payment.buyer?.email) || null,
		buyerFirstName: payment.buyer?.first_name ?? null,
		buyerLastName: payment.buyer?.last_name ?? null,
		campaignId: payment.campaign_id ?? null,
		contactId: payment.contact ?? payment.contact_id ?? null,
		eventId,
		matchStatus,
		creditedCents,
		rawJson: JSON.stringify(payment)
	};
}

async function upsertPayment(db: Db, row: PaymentRow): Promise<void> {
	await db
		.insert(paradiseZeffyPayments)
		.values(row)
		.onConflictDoUpdate({
			target: paradiseZeffyPayments.zeffyPaymentId,
			set: {
				status: row.status,
				amount: row.amount,
				currency: row.currency,
				buyerEmail: row.buyerEmail,
				buyerFirstName: row.buyerFirstName,
				buyerLastName: row.buyerLastName,
				campaignId: row.campaignId,
				contactId: row.contactId,
				eventId: row.eventId,
				matchStatus: row.matchStatus,
				creditedCents: row.creditedCents,
				rawJson: row.rawJson,
				updatedAt: now()
			}
		});
}

async function eventIdForCampaign(db: Db, campaignId: string | null | undefined) {
	if (!campaignId) return null;
	const row = (
		await db
			.select({ id: paradiseEvents.id })
			.from(paradiseEvents)
			.where(eq(paradiseEvents.zeffyCampaignId, campaignId))
			.limit(1)
	)[0];
	return row?.id ?? null;
}

async function attendeeIdFor(db: Db, email: string) {
	const row = (
		await db
			.select({ id: paradiseAttendees.id })
			.from(paradiseAttendees)
			.where(eq(paradiseAttendees.email, email))
			.limit(1)
	)[0];
	return row?.id ?? null;
}

/** Sum of the topup already credited for this payment (0 if none). */
async function creditedFor(db: Db, paymentId: string): Promise<number> {
	const row = (
		await db
			.select({ n: sql<number>`coalesce(sum(${paradiseLedger.amountCents}), 0)` })
			.from(paradiseLedger)
			.where(and(eq(paradiseLedger.zeffyPaymentId, paymentId), eq(paradiseLedger.kind, 'topup')))
	)[0];
	return Number(row?.n ?? 0);
}

/**
 * Apply a Zeffy payment to the camper wallet ledger. Idempotent on payment id
 * via the unique (zeffy_payment_id, kind) index.
 * - succeeded -> ledger 'topup' of payment.amount (net of discounts) to the buyer email
 * - refunded / disputed / deleted -> ledger 'reversal' of the credited amount
 */
export async function applyPayment(
	db: Db,
	payment: ZeffyPaymentPayload,
	opts: ApplyPaymentOptions = {}
): Promise<ApplyResult> {
	const email = normalizeEmail(payment.buyer?.email);
	const eventId = await eventIdForCampaign(db, payment.campaign_id);

	if (opts.deleted || isRefundedOrDisputed(payment)) {
		const credited = await creditedFor(db, payment.id);
		let reversed = 0;
		if (credited > 0) {
			const inserted = await db
				.insert(paradiseLedger)
				.values({
					email: email || (await existingEmailFor(db, payment.id)) || 'unknown',
					attendeeId: email ? await attendeeIdFor(db, email) : null,
					eventId,
					kind: 'reversal',
					amountCents: -credited,
					zeffyPaymentId: payment.id,
					note: opts.deleted
						? 'Zeffy payment deleted'
						: `Zeffy ${payment.refund_status ?? 'dispute'}`
				})
				.onConflictDoNothing()
				.returning({ id: paradiseLedger.id });
			reversed = inserted.length ? credited : 0;
		}
		await upsertPayment(db, paymentRow(payment, 'refunded', eventId, credited));
		return { action: 'reversed', amountCents: -reversed, eventId };
	}

	if (payment.status && payment.status !== 'succeeded') {
		await upsertPayment(db, paymentRow(payment, 'unmatched', eventId, 0));
		return { action: 'ignored', amountCents: 0, eventId };
	}

	if (!email) {
		await upsertPayment(db, paymentRow(payment, 'unmatched', eventId, 0));
		return { action: 'skipped', amountCents: 0, eventId };
	}

	const amount = Math.max(0, Math.round(payment.amount ?? 0));
	const inserted = await db
		.insert(paradiseLedger)
		.values({
			email,
			attendeeId: await attendeeIdFor(db, email),
			eventId,
			kind: 'topup',
			amountCents: amount,
			zeffyPaymentId: payment.id,
			note: payment.description ?? null
		})
		.onConflictDoNothing()
		.returning({ id: paradiseLedger.id });

	const credited = inserted.length ? amount : await creditedFor(db, payment.id);
	await upsertPayment(db, paymentRow(payment, 'matched', eventId, credited));
	return { action: inserted.length ? 'credited' : 'skipped', amountCents: credited, eventId };
}

async function existingEmailFor(db: Db, paymentId: string): Promise<string | null> {
	const row = (
		await db
			.select({ email: paradiseLedger.email })
			.from(paradiseLedger)
			.where(eq(paradiseLedger.zeffyPaymentId, paymentId))
			.limit(1)
	)[0];
	return row?.email ?? null;
}
