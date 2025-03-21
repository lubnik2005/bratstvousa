import { env } from '$env/dynamic/private';
import { db } from '$lib/server/db';
import { newsArticlesSchema } from '$lib/server/db/queries';
import { medias, newsArticles } from '$lib/server/db/schema';
import { error } from '@sveltejs/kit';
import { and, eq, sql } from 'drizzle-orm';

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

	//     ??.where(eq(newsArticles.slug, params.slug)))[0] ??
	// null;
	return {
		media_url: env.MEDIA_URL,
		news_article,
		images,
		audios
	};
}
