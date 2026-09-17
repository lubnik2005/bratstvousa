import { and, desc, eq, inArray, isNull, ne, or, gt, sql } from 'drizzle-orm';
import type { AppDatabase } from '$lib/server/db';
import {
	paradiseEvents,
	paradiseRooms,
	paradiseEventRooms,
	paradiseCots,
	paradiseReservations,
	paradiseAttendees,
	paradiseForms,
	paradiseFormAnswers
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

export type RegistrationState = 'open' | 'upcoming' | 'closed';

/**
 * Where an event sits in its lifecycle, based on the registration window.
 * - open: registration has started (or has no start) and has not yet ended.
 *   A null end falls back to the camp's end_on; if that is also null, it stays open.
 * - upcoming: registration has a start that is still in the future.
 * - closed: registration has ended, or the camp itself is over.
 */
export function registrationState(
	event: {
		startOn: string | null;
		endOn: string | null;
		registrationStartAt: string | null;
		registrationEndAt: string | null;
	},
	now: Date = new Date()
): RegistrationState {
	const t = now.getTime();
	const parse = (s: string | null) => {
		if (!s) return null;
		// Stored as 'YYYY-MM-DD HH:MM:SS' (UTC). Normalise to ISO so Date parses it.
		const ms = new Date(s.replace(' ', 'T') + 'Z').getTime();
		return Number.isNaN(ms) ? null : ms;
	};

	const regStart = parse(event.registrationStartAt);
	const regEnd = parse(event.registrationEndAt);
	const campEnd = parse(event.endOn);

	if (regStart !== null && t < regStart) return 'upcoming';

	const effectiveEnd = regEnd ?? campEnd;
	if (effectiveEnd !== null && t >= effectiveEnd) return 'closed';

	return 'open';
}

/** Published events whose registration window is currently open (soonest first). */
export async function listOpenEvents(db: AppDatabase) {
	const rows = await listPublishedEvents(db);
	const now = new Date();
	return rows.filter((e) => registrationState(e, now) === 'open');
}

/** Published events announced but not yet open for registration (soonest first). */
export async function listUpcomingEvents(db: AppDatabase) {
	const rows = await listPublishedEvents(db);
	const now = new Date();
	return rows.filter((e) => registrationState(e, now) === 'upcoming');
}

/** Past/closed published events (most recent first), for the history strip. */
export async function listPastEvents(db: AppDatabase, limit = 8) {
	const rows = await listPublishedEvents(db);
	const now = new Date();
	return rows
		.filter((e) => registrationState(e, now) === 'closed')
		.sort((a, b) => (b.startOn ?? '').localeCompare(a.startOn ?? ''))
		.slice(0, limit)
		.map((e) => ({ id: e.id, name: e.name, startOn: e.startOn, endOn: e.endOn }));
}

/** Headline stats: total camps run and unique campers served. */
export async function siteStats(db: AppDatabase) {
	const campersRows = await db
		.select({ campers: sql<number>`count(distinct lower(${paradiseReservations.email}))` })
		.from(paradiseReservations)
		.where(eq(paradiseReservations.status, 'confirmed'));
	const campsRows = await db
		.select({ camps: sql<number>`count(*)` })
		.from(paradiseEvents)
		.where(eq(paradiseEvents.status, 'published'));
	return {
		campers: Number(campersRows[0]?.campers ?? 0),
		camps: Number(campsRows[0]?.camps ?? 0)
	};
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
	const [totalRows, takenRows] = await Promise.all([
		db
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
			),
		db
			.select({ taken: sql<number>`count(*)` })
			.from(paradiseReservations)
			.where(and(eq(paradiseReservations.eventId, eventId), bedBlockedCondition()))
	]);

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
		.where(and(eq(paradiseEventRooms.eventId, eventId), inArray(paradiseRooms.sex, [sex, 'c'])))
		.orderBy(paradiseRooms.name);

	if (rooms.length === 0) return [];
	const roomIds = rooms.map((r) => r.id);

	// Two set-based queries (instead of 2 per room): cots per room and blocked
	// reservations per room for this event. Only a boolean availability flag is
	// returned — never expose exact counts, so browsing rooms can't reveal how
	// full a cabin is.
	const [cotRows, takenRows] = await Promise.all([
		db
			.select({ roomId: paradiseCots.roomId, n: sql<number>`count(*)` })
			.from(paradiseCots)
			.where(inArray(paradiseCots.roomId, roomIds))
			.groupBy(paradiseCots.roomId),
		db
			.select({ roomId: paradiseReservations.roomId, n: sql<number>`count(*)` })
			.from(paradiseReservations)
			.where(
				and(
					eq(paradiseReservations.eventId, eventId),
					inArray(paradiseReservations.roomId, roomIds),
					bedBlockedCondition()
				)
			)
			.groupBy(paradiseReservations.roomId)
	]);

	const cotsByRoom = new Map(cotRows.map((r) => [r.roomId, Number(r.n)]));
	const takenByRoom = new Map(takenRows.map((r) => [r.roomId, Number(r.n)]));

	return rooms.map((room) => {
		const cots = cotsByRoom.get(room.id) ?? 0;
		const taken = takenByRoom.get(room.id) ?? 0;
		return { ...room, available: cots > taken };
	});
}

/**
 * Beds in a room for an event. Each is flagged taken/free; pass
 * `freeOnly: true` to return only the free beds (so taken beds — and thus the
 * count of who's already in a cabin — are never sent to the client).
 */
export async function bedsForRoom(
	db: AppDatabase,
	eventId: number,
	roomId: number,
	opts: { freeOnly?: boolean } = {}
) {
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

	const beds = cots.map((c) => ({ id: c.id, description: c.description, taken: taken.has(c.id) }));
	return opts.freeOnly ? beds.filter((b) => !b.taken) : beds;
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
	return db.select().from(paradiseForms).where(eq(paradiseForms.required, true));
}

/** Find an attendee account by email (case-insensitive). */
export async function findAttendeeByEmail(db: AppDatabase, email: string) {
	const normalized = email.trim().toLowerCase();
	const rows = await db
		.select()
		.from(paradiseAttendees)
		.where(eq(paradiseAttendees.email, normalized))
		.limit(1);
	return rows[0] ?? null;
}

/**
 * Create the attendee account if it doesn't exist, or update its profile.
 * Marks the account verified and stamps last_login_at. Returns the account row.
 */
export async function upsertAttendee(
	db: AppDatabase,
	profile: { email: string; firstName: string; lastName: string; sex: 'm' | 'f' }
) {
	const email = profile.email.trim().toLowerCase();
	const now = sql`datetime('now')`;
	const existing = await findAttendeeByEmail(db, email);
	if (existing) {
		const updated = await db
			.update(paradiseAttendees)
			.set({
				firstName: profile.firstName,
				lastName: profile.lastName,
				sex: profile.sex,
				verifiedAt: existing.verifiedAt ?? (now as unknown as string),
				lastLoginAt: now as unknown as string,
				updatedAt: now as unknown as string
			})
			.where(eq(paradiseAttendees.id, existing.id))
			.returning();
		return updated[0];
	}
	const inserted = await db
		.insert(paradiseAttendees)
		.values({
			email,
			firstName: profile.firstName,
			lastName: profile.lastName,
			sex: profile.sex,
			verifiedAt: now as unknown as string,
			lastLoginAt: now as unknown as string
		})
		.returning();
	return inserted[0];
}

/** Stamp an existing attendee as verified + logged-in (no profile change). */
export async function markAttendeeLogin(db: AppDatabase, attendeeId: number) {
	const now = sql`datetime('now')`;
	await db
		.update(paradiseAttendees)
		.set({
			verifiedAt: now as unknown as string,
			lastLoginAt: now as unknown as string,
			updatedAt: now as unknown as string
		})
		.where(eq(paradiseAttendees.id, attendeeId));
}

/** All reservations for a camper email (most recent first), with event + room names. */
export async function reservationsForEmail(db: AppDatabase, email: string) {
	const normalized = email.trim().toLowerCase();
	return db
		.select({
			id: paradiseReservations.id,
			eventId: paradiseReservations.eventId,
			eventName: paradiseEvents.name,
			startOn: paradiseEvents.startOn,
			endOn: paradiseEvents.endOn,
			roomName: paradiseRooms.name,
			cotId: paradiseReservations.cotId,
			price: paradiseReservations.price,
			status: paradiseReservations.status,
			confirmationCode: paradiseReservations.confirmationCode,
			createdAt: paradiseReservations.createdAt
		})
		.from(paradiseReservations)
		.leftJoin(paradiseEvents, eq(paradiseEvents.id, paradiseReservations.eventId))
		.leftJoin(paradiseRooms, eq(paradiseRooms.id, paradiseReservations.roomId))
		.where(sql`lower(${paradiseReservations.email}) = ${normalized}`)
		.orderBy(sql`${paradiseReservations.createdAt} desc`);
}

/** Look up a reservation by its confirmation code. */
function formAnswerSelect(db: AppDatabase) {
	return db
		.select({
			id: paradiseFormAnswers.id,
			formId: paradiseFormAnswers.formId,
			formName: paradiseForms.name,
			eventId: paradiseFormAnswers.eventId,
			eventName: paradiseEvents.name,
			startOn: paradiseEvents.startOn,
			endOn: paradiseEvents.endOn,
			signedOn: paradiseFormAnswers.signedOn,
			answers: paradiseFormAnswers.answers
		})
		.from(paradiseFormAnswers)
		.leftJoin(paradiseForms, eq(paradiseForms.id, paradiseFormAnswers.formId))
		.leftJoin(paradiseEvents, eq(paradiseEvents.id, paradiseFormAnswers.eventId));
}

/** All form answers (health forms etc.) signed by this camper email, newest first. */
export async function formAnswersForEmail(db: AppDatabase, email: string) {
	const normalized = email.trim().toLowerCase();
	return formAnswerSelect(db)
		.where(sql`lower(${paradiseFormAnswers.email}) = ${normalized}`)
		.orderBy(desc(paradiseFormAnswers.signedOn), desc(paradiseFormAnswers.id));
}

/** A single form answer, only if it belongs to this camper email. */
export async function formAnswerForEmail(db: AppDatabase, id: number, email: string) {
	const normalized = email.trim().toLowerCase();
	const rows = await formAnswerSelect(db)
		.where(
			and(eq(paradiseFormAnswers.id, id), sql`lower(${paradiseFormAnswers.email}) = ${normalized}`)
		)
		.limit(1);
	return rows[0] ?? null;
}

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
