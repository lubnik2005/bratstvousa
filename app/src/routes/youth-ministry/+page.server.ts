import { db } from '$lib/server/db';
import { youthEvents } from '$lib/server/db/schema';
import { env } from '$env/dynamic/private';

import { lt, gte, or, and, isNull } from 'drizzle-orm/expressions';

export async function load() {
	const today = new Date().toISOString(); // Convert Date to ISO string

	// Archive: Events where `endAt` is before today (or `startAt` if `endAt` is null)
	const archivedEvents = await db
		.select()
		.from(youthEvents)
		.where(
			or(
				lt(youthEvents.endAt, today),
				and(isNull(youthEvents.endAt), lt(youthEvents.startAt, today))
			)
		)
		.orderBy(youthEvents.startAt, 'desc'); // Order archive descending

	const upcomingEvents = await db
		.select()
		.from(youthEvents)
		.where(or(gte(youthEvents.startAt, today), gte(youthEvents.endAt, today)))
		.orderBy(youthEvents.startAt, 'asc'); // Order by soonest start date

	return {
		upcomingEvents,
		archivedEvents,
		media_url: env.MEDIA_URL
	};
}
