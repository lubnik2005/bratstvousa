import { and, eq, inArray, sql } from 'drizzle-orm';
import type { DrizzleD1Database } from 'drizzle-orm/d1';
import {
	paradiseAttendees,
	paradiseEvents,
	paradiseReservations,
	paradiseTickets,
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
	action: 'granted' | 'revoked' | 'unmatched' | 'ignored';
	tickets: number;
	eventId: number | null;
};

type PaymentRow = typeof paradiseZeffyPayments.$inferInsert;

function paymentRow(
	payment: ZeffyPaymentPayload,
	matchStatus: 'matched' | 'unmatched' | 'refunded',
	eventId: number | null,
	ticketsGranted: number
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
		ticketsGranted,
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
				ticketsGranted: row.ticketsGranted,
				rawJson: row.rawJson,
				updatedAt: now()
			}
		});
}

/** Revoke every ticket from this payment and cancel reservations that used them. */
async function revokeTickets(db: Db, paymentId: string): Promise<number> {
	const tickets = await db
		.select({ id: paradiseTickets.id, reservationId: paradiseTickets.reservationId })
		.from(paradiseTickets)
		.where(eq(paradiseTickets.zeffyPaymentId, paymentId));
	if (tickets.length === 0) return 0;

	await db
		.update(paradiseTickets)
		.set({ status: 'revoked', updatedAt: now() })
		.where(eq(paradiseTickets.zeffyPaymentId, paymentId));

	const reservationIds = tickets
		.map((t) => t.reservationId)
		.filter((id): id is number => typeof id === 'number');
	if (reservationIds.length > 0) {
		await db
			.update(paradiseReservations)
			.set({ status: 'cancelled', updatedAt: now() })
			.where(
				and(
					inArray(paradiseReservations.id, reservationIds),
					eq(paradiseReservations.status, 'confirmed')
				)
			);
	}
	return tickets.length;
}

/**
 * Apply a Zeffy payment to the ticket ledger. Idempotent on payment id + item id.
 * - succeeded  -> grant one ticket per ticket item to the buyer email for the event
 *                 whose zeffy_campaign_id matches payment.campaign_id
 * - refunded / disputed / deleted -> revoke tickets + cancel reservations using them
 */
export async function applyPayment(
	db: Db,
	payment: ZeffyPaymentPayload,
	opts: ApplyPaymentOptions = {}
): Promise<ApplyResult> {
	if (opts.deleted || isRefundedOrDisputed(payment)) {
		const revoked = await revokeTickets(db, payment.id);
		await upsertPayment(db, paymentRow(payment, 'refunded', null, 0));
		return { action: 'revoked', tickets: revoked, eventId: null };
	}

	if (payment.status && payment.status !== 'succeeded') {
		await upsertPayment(db, paymentRow(payment, 'unmatched', null, 0));
		return { action: 'ignored', tickets: 0, eventId: null };
	}

	const email = normalizeEmail(payment.buyer?.email);
	const campaignId = payment.campaign_id ?? null;
	const event = campaignId
		? (
				await db
					.select({ id: paradiseEvents.id })
					.from(paradiseEvents)
					.where(eq(paradiseEvents.zeffyCampaignId, campaignId))
					.limit(1)
			)[0]
		: undefined;

	if (!event || !email) {
		await upsertPayment(db, paymentRow(payment, 'unmatched', event?.id ?? null, 0));
		return { action: 'unmatched', tickets: 0, eventId: event?.id ?? null };
	}

	const attendee = (
		await db
			.select({ id: paradiseAttendees.id })
			.from(paradiseAttendees)
			.where(eq(paradiseAttendees.email, email))
			.limit(1)
	)[0];

	const items = (payment.items ?? []).filter((i) => !i.type || i.type === 'ticket');
	let granted = 0;
	for (const item of items) {
		const inserted = await db
			.insert(paradiseTickets)
			.values({
				eventId: event.id,
				email,
				attendeeId: attendee?.id ?? null,
				zeffyPaymentId: payment.id,
				zeffyItemId: item.id,
				rateTitle: item.rate_title ?? null,
				amountCents: item.amount ?? 0,
				status: 'available'
			})
			.onConflictDoNothing()
			.returning({ id: paradiseTickets.id });
		granted += inserted.length;
	}

	const total = (
		await db
			.select({ n: sql<number>`count(*)` })
			.from(paradiseTickets)
			.where(eq(paradiseTickets.zeffyPaymentId, payment.id))
	)[0];

	await upsertPayment(db, paymentRow(payment, 'matched', event.id, Number(total?.n ?? granted)));
	return { action: 'granted', tickets: granted, eventId: event.id };
}
