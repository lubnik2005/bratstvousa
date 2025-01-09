import { db } from '$lib/server/db';
import {
	Event,
	bibleEducationEvents,
	childrensEvents,
	eventSchemas,
	youthEvents
} from '$lib/server/db/schema';
import { eq } from 'drizzle-orm/expressions';
import { unionAll } from 'drizzle-orm/mysql-core';

// Array of event table names

// Load function
export async function load({ params }) {
	const slug = params.slug; // Get the slug from params
	if (!slug) {
		throw new Error('Slug is required');
	}
	const events = await unionAll(
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
	)
		.where(eq(Event.slug, slug))
		.limit(1);

	return {
		event: events[0]
	};
}
