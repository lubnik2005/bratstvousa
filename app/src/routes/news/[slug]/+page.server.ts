import { env } from '$env/dynamic/private';
import { db } from '$lib/server/db';
import { newsArticlesSchema } from '$lib/server/db/queries';
import { medias, newsArticles } from '$lib/server/db/schema';
import { error } from '@sveltejs/kit';
import { and, eq, sql } from 'drizzle-orm';
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
	image
};

const edjsParser = edjsHTML(plugins);

export async function load({ params }) {
	const news_articles = await newsArticlesSchema().where(
		sql`news_articles_union.slug = ${params.slug}`
	);
	const news_article = news_articles[0];

	if (!news_article) {
		error(404, {
			message: 'Страница не найдена'
		});
	}

	news_article.content = news_article.content?.replaceAll(
		'src="/upfiles/photos/',
		`src="${env.MEDIA_URL}upfiles/photos/`
	);

	const images = await db
		.select()
		.from(medias)
		.where(
			and(
				eq(medias.modelType, 'App\\Models\\NewsArticle'),
				eq(medias.modelId, news_article.id),
				eq(medias.collectionName, 'gallery')
			)
		);

	const audios = await db
		.select()
		.from(medias)
		.where(
			and(
				eq(medias.modelType, 'App\\Models\\NewsArticle'),
				eq(medias.modelId, news_article.id),
				eq(medias.collectionName, 'playlist')
			)
		);

	console.log(JSON.stringify(news_article?.editorjs?.blocks));
	const cleanBlocks = news_article.editorjs?.blocks?.filter((b) => b.type !== 'image');
	news_article.editorjs_rendered = cleanBlocks
		? edjsParser.parse({ blocks: news_article.editorjs?.blocks })
		: null;

	//     ??.where(eq(newsArticles.slug, params.slug)))[0] ??
	// null;
	return {
		media_url: env.MEDIA_URL,
		news_article,
		images,
		audios
	};
}
