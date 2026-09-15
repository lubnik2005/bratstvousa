import { and, eq, inArray, isNull, ne, or, gt, sql } from 'drizzle-orm';
import type { AppDatabase } from '$lib/server/db';
import {
	paradiseEvents,
	paradiseRooms,
	paradiseEventRooms,
	paradiseCots,
	paradiseReservations
} from '$lib/server/db/schema';

/**
 * A reservation blocks a bed when it is confirmed, OR still held with a
 * hold that has not yet expired. Cancelled/refunded/expired-held free the bed.
 */
export function bedBlockedCondition() {
	const now = sql`datetime('now')`;
	return or(
		eq(paradiseReservations.status, 'confirmed'),
		and(eq(paradiseReservations.status, 'held'), gt(paradiseReservations.heldUntil, now))
	);
}

/** All published events (soonest first). */
export async function listPublishedEvents(db: AppDatabase) {
	return db
		.select()
		.from(paradiseEvents)
		.where(eq(paradiseEvents.status, 'published'))
		.orderBy(paradiseEvents.startOn);
}

/** A single published event by id. */
export async function getPublishedEvent(db: AppDatabase, eventId: number) {
	const rows = await db
		.select()
		.from(paradiseEvents)
		.where(and(eq(paradiseEvents.id, eventId), eq(paradiseEvents.status, 'published')))
		.limit(1);
	return rows[0] ?? null;
}

/** Total beds and taken beds for an event (for capacity display). */
export async function eventCapacity(db: AppDatabase, eventId: number) {
	const totalRows = await db
		.select({ total: sql<number>`count(*)` })
		.from(paradiseCots)
		.innerJoin(
			paradiseEventRooms,
			and(
				eq(paradiseEventRooms.roomId, paradiseCots.roomId),
				eq(paradiseEventRooms.eventId, eventId)
			)
		)
		.innerJoin(
			paradiseRooms,
			and(eq(paradiseRooms.id, paradiseCots.roomId), isNull(paradiseRooms.deletedAt))
		);

	const takenRows = await db
		.select({ taken: sql<number>`count(*)` })
		.from(paradiseReservations)
		.where(and(eq(paradiseReservations.eventId, eventId), bedBlockedCondition()));

	const total = Number(totalRows[0]?.total ?? 0);
	const taken = Number(takenRows[0]?.taken ?? 0);
	return { total, taken, available: Math.max(0, total - taken) };
}

/**
 * Rooms offered in an event, filtered to those a given sex may book
 * (the room sex must be the chosen sex or 'c' = coed). Includes price + bed counts.
 */
export async function roomsForEvent(db: AppDatabase, eventId: number, sex: 'm' | 'f') {
	const rooms = await db
		.select({
			id: paradiseRooms.id,
			name: paradiseRooms.name,
			sex: paradiseRooms.sex,
			type: paradiseRooms.type,
			location: paradiseRooms.location,
			price: paradiseEventRooms.price
		})
		.from(paradiseEventRooms)
		.innerJoin(
			paradiseRooms,
			and(eq(paradiseRooms.id, paradiseEventRooms.roomId), isNull(paradiseRooms.deletedAt))
		)
		.where(
			and(
				eq(paradiseEventRooms.eventId, eventId),
				inArray(paradiseRooms.sex, [sex, 'c'])
			)
		)
		.orderBy(paradiseRooms.name);

	// Attach available bed counts per room.
	const result = [];
	for (const room of rooms) {
		const beds = await bedsForRoom(db, eventId, room.id);
		const available = beds.filter((b) => !b.taken).length;
		result.push({ ...room, beds: beds.length, available });
	}
	return result;
}

/** All beds in a room for an event, each flagged taken/free. */
export async function bedsForRoom(db: AppDatabase, eventId: number, roomId: number) {
	const cots = await db
		.select({ id: paradiseCots.id, description: paradiseCots.description })
		.from(paradiseCots)
		.where(eq(paradiseCots.roomId, roomId))
		.orderBy(paradiseCots.id);

	const takenRows = await db
		.select({ cotId: paradiseReservations.cotId })
		.from(paradiseReservations)
		.where(
			and(
				eq(paradiseReservations.eventId, eventId),
				eq(paradiseReservations.roomId, roomId),
				bedBlockedCondition()
			)
		);
	const taken = new Set(takenRows.map((r) => r.cotId));

	return cots.map((c) => ({ id: c.id, description: c.description, taken: taken.has(c.id) }));
}

/** Is a specific bed currently free for an event? (used at hold + confirm time). */
export async function isBedFree(db: AppDatabase, eventId: number, cotId: number) {
	const rows = await db
		.select({ id: paradiseReservations.id })
		.from(paradiseReservations)
		.where(
			and(
				eq(paradiseReservations.eventId, eventId),
				eq(paradiseReservations.cotId, cotId),
				bedBlockedCondition()
			)
		)
		.limit(1);
	return rows.length === 0;
}

/** Required forms for an event's registration flow. */
export async function requiredForms(db: AppDatabase) {
	const { paradiseForms } = await import('$lib/server/db/schema');
	return db.select().from(paradiseForms).where(eq(paradiseForms.required, true));
}

/** Look up a reservation by its confirmation code. */
export async function reservationByCode(db: AppDatabase, code: string) {
	const rows = await db
		.select()
		.from(paradiseReservations)
		.where(
			and(
				eq(paradiseReservations.confirmationCode, code),
				ne(paradiseReservations.status, 'cancelled')
			)
		)
		.limit(1);
	return rows[0] ?? null;
}
