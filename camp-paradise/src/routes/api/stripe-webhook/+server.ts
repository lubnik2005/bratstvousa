import { eq } from 'drizzle-orm';
import { createDb } from '$lib/server/db';
import { makeStripe } from '$lib/server/paradise/payments';
import { sendReservationConfirmed } from '$lib/server/email/paradise';
import { paradiseReservations, paradiseEvents, paradiseRooms } from '$lib/server/db/schema';
import type { RequestHandler } from './$types';

export const POST: RequestHandler = async ({ request, platform }) => {
	const raw = await request.text();
	const stripe = makeStripe(platform?.env?.STRIPE_SECRET_KEY, platform?.env?.STRIPE_WEBHOOK_SECRET);
	if (!stripe) return new Response('not configured', { status: 500 });

	const evt = await stripe.verifyWebhook(raw, request.headers.get('stripe-signature'));
	if (!evt) return new Response('bad signature', { status: 400 });

	const db = createDb(platform!.env.DB);

	try {
		if (evt.type === 'payment_intent.succeeded') {
			const obj = evt.data.object as Record<string, unknown>;
			const pi = obj.id as string;
			const metaId = Number((obj.metadata as Record<string, string> | undefined)?.reservationId);

			let rows = await db
				.select()
				.from(paradiseReservations)
				.where(eq(paradiseReservations.stripePaymentIntent, pi))
				.limit(1);
			if (!rows.length && Number.isInteger(metaId)) {
				rows = await db
					.select()
					.from(paradiseReservations)
					.where(eq(paradiseReservations.id, metaId))
					.limit(1);
			}

			const res = rows[0];
			if (res && res.status !== 'confirmed') {
				await db
					.update(paradiseReservations)
					.set({
						status: 'confirmed',
						paidAt: new Date().toISOString(),
						stripePaymentIntent: pi,
						updatedAt: new Date().toISOString()
					})
					.where(eq(paradiseReservations.id, res.id));

				const ev = (
					await db
						.select({ name: paradiseEvents.name })
						.from(paradiseEvents)
						.where(eq(paradiseEvents.id, res.eventId))
						.limit(1)
				)[0];
				const room = (
					await db
						.select({ name: paradiseRooms.name })
						.from(paradiseRooms)
						.where(eq(paradiseRooms.id, res.roomId))
						.limit(1)
				)[0];

				await sendReservationConfirmed(db, {
					firstName: res.firstName,
					email: res.email,
					eventName: ev?.name ?? 'Camp Paradise',
					roomName: room?.name ?? '',
					code: res.confirmationCode ?? '',
					amount: res.price / 100
				});
			}
		}
	} catch (e) {
		console.error('stripe-webhook error:', e);
	}

	return new Response('ok', { status: 200 });
};
