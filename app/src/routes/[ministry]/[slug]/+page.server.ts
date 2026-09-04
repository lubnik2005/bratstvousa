import { parseEditorJS } from '$lib/server/editorjs';
import { eventSchemas } from '$lib/server/db/schema';
import { eq } from 'drizzle-orm';
import { env } from '$env/dynamic/private';
import { error } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ params: { slug }, locals }) => {
	if (!slug) {
		throw new Error('Slug is required');
	}

	const db = locals.db;
	let event: any = null;

	// Search all event tables for matching slug
	for (const schema of eventSchemas) {
		const results = await db
			.select({
				id: schema.id,
				title: schema.title,
				startAt: schema.startAt,
				endAt: schema.endAt,
				slug: schema.slug,
				description: schema.description,
				featuredImage: schema.featuredImage,
				content: schema.content,
				editorjs: schema.editorjs,
				use_editorjs: schema.use_editorjs
			})
			.from(schema)
			.where(eq(schema.slug, slug))
			.limit(1);

		if (results.length > 0) {
			event = results[0];
			break;
		}
	}

	if (!event) {
		error(404, {
			message: 'Страница не найдена'
		});
	}

	//HACK: This is a temporary solution. In reality the url should be changed in the db, probably?
	event.content = event.content?.replaceAll(
		'src="/upfiles/photos/',
		`src="${env.MEDIA_URL}upfiles/photos/`
	);
	event.editorjs_rendered = parseEditorJS(event.editorjs);

	return { event };
};
