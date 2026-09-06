import { bibleEducationEvents, bibleEducationNewsArticles } from '$lib/server/db/schema';
import { eq } from 'drizzle-orm/expressions';
import { getMinistryEvents, getMinistryNewsArticles } from '$lib/server/db/queries';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ locals, platform, setHeaders }) => {
	setHeaders({ 'cache-control': 'public, max-age=0, s-maxage=300, stale-while-revalidate=3600' });
	const where_events = eq(bibleEducationEvents.category, 'courses');
	const events = await getMinistryEvents(locals.db, bibleEducationEvents, where_events);
	const news_articles = await getMinistryNewsArticles(locals.db, bibleEducationNewsArticles);
	return {
		events,
		news_articles,
		media_url: platform?.env?.MEDIA_URL ?? ''
	};
};
