import { env } from '$env/dynamic/private';
import { db } from '$lib/server/db';
import { childrensEvents, childrensFiles } from '$lib/server/db/schema';
import { isNull, and, desc, or, gte, lt } from 'drizzle-orm';

export async function load({ params }) {
	const today = new Date().toISOString(); // Convert Date to ISO string
	const childrens_files = await db.select().from(childrensFiles).orderBy(childrensFiles.name);

	const archivedEvents = await db
		.select()
		.from(childrensEvents)
		.where(
			or(
				lt(childrensEvents.endAt, today),
				and(isNull(childrensEvents.endAt), lt(childrensEvents.startAt, today))
			)
		)
		.orderBy(desc(childrensEvents.startAt)); // Order archive descending

	const allEvents = await db
		.select()
		.from(childrensEvents)
		.orderBy(childrensEvents.startAt, 'desc'); // Order archive descending

	// Upcoming/Ongoing: Events where `startAt` is today or later, or are ongoing (`endAt` is after today)
	const upcomingEvents = await db
		.select()
		.from(childrensEvents)
		.where(or(gte(childrensEvents.startAt, today), gte(childrensEvents.endAt, today)))
		.orderBy(childrensEvents.startAt, 'asc'); // Order by soonest start date

	return {
		media_url: env.MEDIA_URL,
		archivedEvents,
		upcomingEvents,
		allEvents,
		childrens_files
	};
}
