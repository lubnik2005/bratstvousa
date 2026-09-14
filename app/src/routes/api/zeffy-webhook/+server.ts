import { env } from '$env/dynamic/private';
import { eq } from 'drizzle-orm';
import { createDb } from '$lib/server/db';
import { zeffyEvents } from '$lib/server/db/schema';
import {
	verifySignature,
	fetchPayment,
	applyPayment,
	type ZeffyPaymentPayload
} from '$lib/server/zeffy';
import type { RequestHandler } from './$types';

interface ZeffyEventEnvelope {
	id: string;
	type: string;
	version?: number;
	dispatchedAt?: string;
	data: { id: string; object?: string } & Partial<ZeffyPaymentPayload>;
}

export const POST: RequestHandler = async ({ request, platform }) => {
	// Raw body is REQUIRED for HMAC verification (must not be re-serialized).
	const rawBody = await request.text();

	const secret = env.ZEFFY_WEBHOOK_SECRET;
	if (!secret) {
		console.error('ZEFFY_WEBHOOK_SECRET not configured');
		return new Response('not configured', { status: 500 });
	}

	if (!verifySignature(rawBody, request.headers.get('Zeffy-Signature'), secret)) {
		return new Response('invalid signature', { status: 400 });
	}

	let evt: ZeffyEventEnvelope;
	try {
		evt = JSON.parse(rawBody) as ZeffyEventEnvelope;
	} catch {
		return new Response('bad json', { status: 400 });
	}

	if (!platform?.env?.DB) {
		console.error('D1 binding missing in zeffy-webhook');
		return new Response('no db', { status: 500 });
	}
	const db = createDb(platform.env.DB);

	// Idempotency: dedup on the stable event id (constant across retries).
	if (evt.id) {
		const seen = (
			await db
				.select({ id: zeffyEvents.id })
				.from(zeffyEvents)
				.where(eq(zeffyEvents.eventId, evt.id))
				.limit(1)
		)[0];
		if (seen) {
			return new Response('ok (dup)', { status: 200 });
		}
		try {
			await db.insert(zeffyEvents).values({ eventId: evt.id, type: evt.type, processed: false });
		} catch {
			// Race: another delivery inserted it first -> treat as duplicate.
			return new Response('ok (dup)', { status: 200 });
		}
	}

	try {
		const type = evt.type ?? '';
		if (type === 'payment.completed' || type === 'payment.created') {
			// data is the full Payment object.
			await applyPayment(db, evt.data as ZeffyPaymentPayload, { apiKey: env.ZEFFY_API_KEY });
		} else if (type === 'payment.updated' || type === 'payment.deleted') {
			// data is id-only -> refetch the full payment.
			const apiKey = env.ZEFFY_API_KEY;
			if (!apiKey) {
				console.error('ZEFFY_API_KEY not configured for refetch');
			} else {
				const payment = await fetchPayment(evt.data.id, apiKey);
				if (payment == null) {
					// 404 => deleted upstream.
					await applyPayment(db, { id: evt.data.id }, { deleted: true });
				} else {
					await applyPayment(db, payment, { apiKey, deleted: type === 'payment.deleted' });
				}
			}
		}
		// contact.* events are ignored.

		if (evt.id) {
			await db.update(zeffyEvents).set({ processed: true }).where(eq(zeffyEvents.eventId, evt.id));
		}
	} catch (err) {
		console.error('zeffy-webhook processing failed:', err);
		// Still 200 so Zeffy doesn't hammer retries; the hourly Laravel sync
		// is the safety net for anything left unprocessed.
	}

	return new Response('ok', { status: 200 });
};
