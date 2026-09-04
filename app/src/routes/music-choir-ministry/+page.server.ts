import { getMinistryEvents, getMinistryNewsArticles } from '$lib/server/db/queries';
import { musicEvents, musicNewsArticles } from '$lib/server/db/schema';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ locals, platform, setHeaders }) => {
	setHeaders({ 'cache-control': 'public, max-age=0, s-maxage=300, stale-while-revalidate=3600' });
	return {
		media_url: platform?.env?.MEDIA_URL ?? '',
		events: await getMinistryEvents(locals.db, musicEvents),
		articles: await getMinistryNewsArticles(locals.db, musicNewsArticles)
	};
};
