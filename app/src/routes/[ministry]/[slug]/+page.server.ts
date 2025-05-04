import { db } from '$lib/server/db';
import { error} from '@sveltejs/kit';
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
import edjsHTML from 'editorjs-html';

function linkTool(block) {
  const { link, meta } = block.data;

  return `
<div class="card mb-4 shadow-sm border-0">
  <a href="${link}" target="_blank" class="text-decoration-none text-reset">
    <img src="${meta.imageUrl}" class="card-img-top" alt="${meta.title}" />
    <div class="card-body">
      <h5 class="card-title">${meta.title}</h5>
      <p class="card-text">${meta.description}</p>
      <small class="text-muted">${link}</small>
    </div>
  </a>
</div>
`;
}


function image(block) {
  const { file, caption } = block.data;

  const originalUrl = file.url;
  const smallUrl = originalUrl.replace(/(\.[\w]+)$/, '_small$1');

  return `
  <figure class="mb-4 text-center">
    <a href="${originalUrl}" target="_blank">
      <img src="${smallUrl}" class="img-fluid rounded" alt="${caption || ''}">
    </a>
    ${caption ? `<figcaption class="mt-2 text-muted small">${caption}</figcaption>` : ''}
  </figure>
  `;
}



const plugins = {
  linkTool,
  image,
};

const edjsParser = edjsHTML(plugins);



// Array of event table names

// Load function
export async function load({ params: { ministry, slug }, url }: { params: { slug: 'string', url : 'string' } }) {
	if (!slug) {
		throw new Error('Slug is required');
	}

  const isPreview = url.searchParams.get('preview');

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
          use_editorjs: eventSchema.use_editorjs,
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
      use_editorjs: sql`result.use_editorjs`,
		})
		.from(unionQuery)
		.where(eq(sql`result.slug`, slug)) // Correctly reference the aliased column
		.limit(1);
	const event = events[0];

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
  // console.log(event)
  console.log(JSON.stringify(event?.editorjs?.blocks));
  const cleanBlocks = event.editorjs?.blocks?.filter(b => b.type !== 'image');
  event.editorjs_rendered = cleanBlocks ? edjsParser.parse({ blocks: event.editorjs?.blocks}): null;
  console.log('----');
  console.log(event);


	return { event };
}
