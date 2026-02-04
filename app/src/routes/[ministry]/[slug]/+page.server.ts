import { db, isMockDb } from '$lib/server/db';
import { parseEditorJS } from '$lib/server/editorjs';
import { eventSchemas } from '$lib/server/db/schema';
import { unionAll } from 'drizzle-orm/mysql-core';
import { sql, eq } from 'drizzle-orm';
import { env } from '$env/dynamic/private';
import { error } from '@sveltejs/kit';

// Load function
export async function load({
	params: { ministry, slug },
	url
}: {
	params: { slug: 'string'; url: 'string' };
}) {
	if (!slug) {
		throw new Error('Slug is required');
	}

	const isPreview = url.searchParams.get('preview');

	let event: any;

	// Mock database branch - directly search all event tables
	if (isMockDb) {
		const mockData = (db as any)._mockData;
		const allEventTables = [
			'youthEvents',
			'childrensEvents',
			'bibleEducationEvents',
			'gospelEvents',
			'musicEvents',
			'familyEvents',
			'generalEvents'
		];

		// Search through all event tables for matching slug
		for (const tableName of allEventTables) {
			const events = mockData[tableName] || [];
			const found = events.find((e: any) => e.slug === slug);
			if (found) {
				// Map to expected structure
				event = {
					id: found.id,
					title: found.title,
					startAt: found.startAt,
					endAt: found.endAt,
					slug: found.slug,
					featuredImage: found.featuredImage,
					description: found.description,
					content: found.content,
					editorjs: found.editorjs,
					use_editorjs: found.use_editorjs
				};
				break;
			}
		}
	} else {
		// Real database branch - use unionAll
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
						content: eventSchema.content,
						editorjs: eventSchema.editorjs,
						use_editorjs: eventSchema.use_editorjs
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
				content: sql`result.content`,
				editorjs: sql`result.editorjs`,
				use_editorjs: sql`result.use_editorjs`
			})
			.from(unionQuery)
			.where(eq(sql`result.slug`, slug)) // Correctly reference the aliased column
			.limit(1);
		event = events[0];
	}

	if (!event) {
		error(404, {
			message: 'Страница не найдена'
		});
	}

	//HACK: This is a temporary solution. In reality the url should be changed in the db, probably?
	// Maybe it should always fix it? Not sure yet.
	event.content = event.content?.replaceAll(
		'src="/upfiles/photos/',
		`src="${env.MEDIA_URL}upfiles/photos/`
	);
	event.editorjs_rendered = parseEditorJS(event.editorjs);

	return { event };
}
