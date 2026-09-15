import { error, fail } from '@sveltejs/kit';
import { eq } from 'drizzle-orm';
import { reservationByCode } from '$lib/server/paradise/queries';
import { makeStripe } from '$lib/server/paradise/payments';
import { sendReservationRefunded } from '$lib/server/email/paradise';
import { paradiseReservations, paradiseEvents, paradiseRooms } from '$lib/server/db/schema';
import type { Actions, PageServerLoad } from './$types';

async function context(db: App.Locals['db'], code: string) {
	const reservation = await reservationByCode(db, code);
	if (!reservation) return null;
	const event = (
		await db.select().from(paradiseEvents).where(eq(paradiseEvents.id, reservation.eventId)).limit(1)
	)[0];
	const room = (
		await db
			.select({ name: paradiseRooms.name })
			.from(paradiseRooms)
			.where(eq(paradiseRooms.id, reservation.roomId))
			.limit(1)
	)[0];
	return { reservation, event, roomName: room?.name ?? '' };
}

function isRefundable(reservation: { status: string }, event: { refundsAvailableUntil: string | null }) {
	if (reservation.status !== 'confirmed') return false;
	if (!event?.refundsAvailableUntil) return true;
	return Date.now() < new Date(event.refundsAvailableUntil).getTime();
}

export const load: PageServerLoad = async ({ params, locals }) => {
	const ctx = await context(locals.db, params.code);
	if (!ctx) throw error(404, 'Reservation not found');
	return {
		reservation: ctx.reservation,
		eventName: ctx.event?.name ?? 'Camp Paradise',
		roomName: ctx.roomName,
		refundable: isRefundable(ctx.reservation, ctx.event)
	};
};

export const actions: Actions = {
	refund: async ({ params, locals, platform }) => {
		const db = locals.db;
		const ctx = await context(db, params.code);
		if (!ctx) return fail(404, { message: 'Reservation not found.' });
		if (!isRefundable(ctx.reservation, ctx.event))
			return fail(400, { message: 'This reservation cannot be refunded.' });

		const stripe = makeStripe(
			platform?.env?.STRIPE_SECRET_KEY,
			platform?.env?.STRIPE_WEBHOOK_SECRET
		);
		if (!stripe) return fail(500, { message: 'Payments are not configured.' });

		const pct = ctx.event?.refundPercentage ?? 0;
		const refundCents = Math.round((ctx.reservation.price * pct) / 100);

		try {
			if (ctx.reservation.stripePaymentIntent && refundCents > 0) {
				await stripe.refund(ctx.reservation.stripePaymentIntent, refundCents);
			}
		} catch (e) {
			console.error('refund error:', e);
			return fail(502, { message: 'Refund could not be processed. Please contact us.' });
		}

		await db
			.update(paradiseReservations)
			.set({ status: 'refunded', updatedAt: new Date().toISOString() })
			.where(eq(paradiseReservations.id, ctx.reservation.id));

		await sendReservationRefunded(db, {
			firstName: ctx.reservation.firstName,
			email: ctx.reservation.email,
			eventName: ctx.event?.name ?? 'Camp Paradise',
			code: ctx.reservation.confirmationCode ?? '',
			amount: refundCents / 100
		});

		return { refunded: true };
	}
};
