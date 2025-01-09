import { db } from '$lib/server/db';
import { Event, eventSchemas } from '$lib/server/db/schema';
import { unionAll } from 'drizzle-orm/mysql-core';

export async function load() {
	const events: Event[] = await unionAll(
		...eventSchemas.map((eventSchema) =>
			db
				.select({
					id: eventSchema.id,
					title: eventSchema.title,
					startAt: eventSchema.startAt,
					endAt: eventSchema.endAt,
					slug: eventSchema.slug
				})
				.from(eventSchema)
		)
	);

	return { events };
}
