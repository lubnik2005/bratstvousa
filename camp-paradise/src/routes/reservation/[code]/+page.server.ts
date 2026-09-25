import { error, fail } from '@sveltejs/kit';
import { eq } from 'drizzle-orm';
import { reservationByCode } from '$lib/server/paradise/queries';
import {
	paradiseReservations,
	paradiseEvents,
	paradiseRooms,
	paradiseTickets
} from '$lib/server/db/schema';
import type { Actions, PageServerLoad } from './$types';

async function context(db: App.Locals['db'], code: string) {
	const reservation = await reservationByCode(db, code);
	if (!reservation) return null;
	const event = (
		await db
			.select()
			.from(paradiseEvents)
			.where(eq(paradiseEvents.id, reservation.eventId))
			.limit(1)
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

function isCancellable(
	reservation: { status: string },
	event: { refundsAvailableUntil: string | null } | undefined
) {
	if (reservation.status !== 'confirmed') return false;
	if (!event?.refundsAvailableUntil) return true;
	return Date.now() < new Date(event.refundsAvailableUntil).getTime();
}

export const load: PageServerLoad = async ({ params, locals, setHeaders }) => {
	setHeaders({ 'cache-control': 'private, no-cache' });
	const ctx = await context(locals.db, params.code);
	if (!ctx) throw error(404, 'Reservation not found');
	return {
		reservation: ctx.reservation,
		eventName: ctx.event?.name ?? 'Camp Paradise',
		roomName: ctx.roomName,
		cancellable: isCancellable(ctx.reservation, ctx.event)
	};
};

export const actions: Actions = {
	cancel: async ({ params, locals }) => {
		const db = locals.db;
		const ctx = await context(db, params.code);
		if (!ctx) return fail(404, { message: 'Reservation not found.' });
		if (!isCancellable(ctx.reservation, ctx.event))
			return fail(400, { message: 'This reservation can no longer be cancelled.' });

		const now = new Date().toISOString();
		await db
			.update(paradiseReservations)
			.set({ status: 'cancelled', updatedAt: now })
			.where(eq(paradiseReservations.id, ctx.reservation.id));

		if (ctx.reservation.ticketId) {
			await db
				.update(paradiseTickets)
				.set({ status: 'available', reservationId: null, usedAt: null, updatedAt: now })
				.where(eq(paradiseTickets.id, ctx.reservation.ticketId));
		}

		return { cancelled: true };
	}
};
