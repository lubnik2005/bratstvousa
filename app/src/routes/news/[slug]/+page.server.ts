import { env } from '$env/dynamic/private';
import { parseEditorJS } from '$lib/server/editorjs';
import { getAllNewsArticles } from '$lib/server/db/queries';
import { medias } from '$lib/server/db/schema';
import { error } from '@sveltejs/kit';
import { and, eq } from 'drizzle-orm';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ params, locals, setHeaders }) => {
	setHeaders({ 'cache-control': 'public, max-age=0, s-maxage=300, stale-while-revalidate=3600' });
	const db = locals.db;

	// Search all news article tables for matching slug
	const allArticles = await getAllNewsArticles(db);
	const news_article: any = allArticles.find((a) => a.slug === params.slug);

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

	news_article.editorjs_rendered = parseEditorJS(news_article.editorjs);

	return {
		media_url: env.MEDIA_URL,
		news_article,
		images,
		audios
	};
};
