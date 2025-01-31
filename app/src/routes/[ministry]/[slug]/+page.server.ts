import { db } from '$lib/server/db';
import {
	Event,
	bibleEducationEvents,
	childrensEvents,
	eventSchemas,
	youthEvents
} from '$lib/server/db/schema';
import { unionAll } from 'drizzle-orm/mysql-core';
import { lte, desc, asc, or, sql, eq, gte, isNull, and, lt } from 'drizzle-orm';
import { env } from '$env/dynamic/private';

// Array of event table names

// Load function
export async function load({ params: { ministry, slug } }: { params: { slug: 'string' } }) {
	if (!slug) {
		throw new Error('Slug is required');
	}

	const unionQuery = unionAll(
		...eventSchemas.map((eventSchema) =>
			db
				.select({
					id: eventSchema.id,
					title: eventSchema.title,
					startAt: eventSchema.startAt,
					endAt: eventSchema.endAt,
					slug: eventSchema.slug,
					descripton: eventSchema.description,
					featuredImage: eventSchema.featuredImage,
					content: eventSchema.content
				})
				.from(eventSchema)
		)
	).as('result'); // Alias the unioned query

	const events = await db
		.select({
			id: sql`result.id`, // Use SQL interpolation for column references
			title: sql`result.title`,
			startAt: sql`result.start_at`,
			endAt: sql`result.end_at`,
			slug: sql`result.slug`,
			featuredImage: sql`result.featured_image`,
			description: sql`result.description`,
			content: sql`result.content`
		})
		.from(unionQuery)
		.where(eq(sql`result.slug`, slug)) // Correctly reference the aliased column
		.limit(1);
	const event = events[0];

	//HACK: This is a temporary solution. In reality the url should be changed in the db, probably?
	// Maybe it should always fix it? Not sure yet.
	event.content = event.content?.replaceAll(
		'src="/upfiles/photos/',
		`src="${env.MEDIA_URL}upfiles/photos/`
	);
	return {
		event: event
	};
}
