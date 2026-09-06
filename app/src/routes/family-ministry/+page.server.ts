import { familyNewsArticles, familyEvents } from '$lib/server/db/schema';
import { getMinistryEvents, getMinistryNewsArticles } from '$lib/server/db/queries';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ locals, platform, setHeaders }) => {
	setHeaders({ 'cache-control': 'public, max-age=0, s-maxage=300, stale-while-revalidate=3600' });
	return {
		events: await getMinistryEvents(locals.db, familyEvents),
		news_articles: await getMinistryNewsArticles(locals.db, familyNewsArticles),
		media_url: platform?.env?.MEDIA_URL ?? ''
	};
};
