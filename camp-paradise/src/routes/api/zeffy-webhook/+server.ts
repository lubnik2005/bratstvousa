import { eq } from 'drizzle-orm';
import { paradiseZeffyEvents } from '$lib/server/db/schema';
import {
	applyPayment,
	fetchPayment,
	verifySignature,
	type ZeffyPaymentPayload
} from '$lib/server/paradise/zeffy';
import type { RequestHandler } from './$types';

interface ZeffyEventEnvelope {
	id: string;
	type: string;
	version?: number;
	dispatchedAt?: string;
	data: { id: string } & Partial<ZeffyPaymentPayload>;
}

const ok = (body = 'ok') => new Response(body, { status: 200 });

export const POST: RequestHandler = async ({ request, platform, locals }) => {
	const rawBody = await request.text();

	const secret = platform?.env?.ZEFFY_WEBHOOK_SECRET;
	if (!secret) {
		console.error('ZEFFY_WEBHOOK_SECRET not configured');
		return new Response('webhook not configured', { status: 500 });
	}

	const valid = await verifySignature(rawBody, request.headers.get('Zeffy-Signature'), secret);
	if (!valid) return new Response('invalid signature', { status: 400 });

	let evt: ZeffyEventEnvelope;
	try {
		evt = JSON.parse(rawBody) as ZeffyEventEnvelope;
	} catch {
		return new Response('invalid json', { status: 400 });
	}
	if (!evt?.id || !evt?.type) return new Response('invalid envelope', { status: 400 });

	const db = locals.db;

	// Idempotency: one row per Zeffy event id.
	const seen = await db
		.select({ id: paradiseZeffyEvents.id })
		.from(paradiseZeffyEvents)
		.where(eq(paradiseZeffyEvents.eventId, evt.id))
		.limit(1);
	if (seen.length) return ok('ok (dup)');
	try {
		await db
			.insert(paradiseZeffyEvents)
			.values({ eventId: evt.id, type: evt.type, processed: false });
	} catch {
		return ok('ok (dup)');
	}

	const apiKey = platform?.env?.ZEFFY_API_KEY;

	try {
		if (evt.type === 'payment.completed' || evt.type === 'payment.created') {
			await applyPayment(db, evt.data as ZeffyPaymentPayload, { apiKey });
		} else if (evt.type === 'payment.updated' || evt.type === 'payment.deleted') {
			if (!apiKey) {
				console.error('ZEFFY_API_KEY not configured; cannot refetch payment', evt.data?.id);
			} else {
				const payment = await fetchPayment(evt.data.id, apiKey);
				if (!payment) {
					await applyPayment(db, { id: evt.data.id }, { deleted: true });
				} else {
					await applyPayment(db, payment, { apiKey, deleted: evt.type === 'payment.deleted' });
				}
			}
		}
		// contact.* and unknown types are ignored.

		await db
			.update(paradiseZeffyEvents)
			.set({ processed: true })
			.where(eq(paradiseZeffyEvents.eventId, evt.id));
	} catch (err) {
		console.error('zeffy webhook processing failed', evt.id, evt.type, err);
	}

	// Always 200 so Zeffy doesn't retry-storm; the periodic sync is the safety net.
	return ok();
};
