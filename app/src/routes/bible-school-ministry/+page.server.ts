import { getMinistryEvents, getMinistryNewsArticles } from '$lib/server/db/queries';
import { bibleEducationEvents, bibleEducationNewsArticles } from '$lib/server/db/schema';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ locals, platform, setHeaders }) => {
	setHeaders({ 'cache-control': 'public, max-age=0, s-maxage=300, stale-while-revalidate=3600' });
	return {
		events: await getMinistryEvents(locals.db, bibleEducationEvents),
		articles: await getMinistryNewsArticles(locals.db, bibleEducationNewsArticles),
		media_url: platform?.env?.MEDIA_URL ?? ''
	};
};
