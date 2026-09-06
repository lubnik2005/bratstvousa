import { env } from '$env/dynamic/private';
import { formatDate } from '$lib/helpers';
import { getAllNewsArticlesOrdered } from '$lib/server/db/queries';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ locals, url, setHeaders }) => {
	setHeaders({ 'cache-control': 'public, max-age=0, s-maxage=300, stale-while-revalidate=3600' });
	const page = Number(url.searchParams.get('page')) || 1;
	const perPage = 30;
	const offset = (page - 1) * perPage;

	const allArticles = await getAllNewsArticlesOrdered(locals.db);
	const news_articles_count = allArticles.length;
	const news_articles = allArticles.slice(offset, offset + perPage).map((a) => ({
		date_string: formatDate(a.date),
		...a
	}));

	return {
		news_articles,
		page,
		perPage,
		news_articles_count,
		media_url: env.MEDIA_URL
	};
};
