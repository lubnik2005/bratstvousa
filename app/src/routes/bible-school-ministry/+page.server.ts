import { db } from '$lib/server/db';
import { bibleEducationEvents } from '$lib/server/db/schema';
import { env } from '$env/dynamic/private';
import { formatDate } from '$lib/helpers';

import { eq, lt, gte, or, and, isNull } from 'drizzle-orm/expressions';

export async function load({ params }) {
	const today = new Date().toISOString(); // Convert Date to ISO string

	// Archive: Events where `endAt` is before today (or `startAt` if `endAt` is null)
	const archivedEvents = (
		await db
			.select()
			.from(bibleEducationEvents)
			.where(
				or(
					lt(bibleEducationEvents.endAt, today),
					and(isNull(bibleEducationEvents.endAt), lt(bibleEducationEvents.startAt, today))
				)
			)
			.orderBy(bibleEducationEvents.startAt, 'desc')
	).map((a) => ({ startAtString: formatDate(a.startAt), ...a })); // Order archive descending

	const allEvents = (
		await db.select().from(bibleEducationEvents).orderBy(bibleEducationEvents.startAt, 'desc')
	).map((a) => ({ startAtString: formatDate(a.startAt), ...a })); // Order archive descending

	// Upcoming/Ongoing: Events where `startAt` is today or later, or are ongoing (`endAt` is after today)
	const upcomingEvents = (
		await db
			.select()
			.from(bibleEducationEvents)
			.where(or(gte(bibleEducationEvents.startAt, today), gte(bibleEducationEvents.endAt, today)))
			.orderBy(bibleEducationEvents.startAt, 'asc')
	).map((a) => ({ startAtString: formatDate(a.startAt), ...a })); // Order by soonest start date

	return {
		upcomingEvents,
		archivedEvents,
		allEvents,
		media_url: env.MEDIA_URL
	};
}
