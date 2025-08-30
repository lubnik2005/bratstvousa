import { bibleEducationEvents, bibleEducationNewsArticles } from '$lib/server/db/schema';
import { env } from '$env/dynamic/private';

import { eq } from 'drizzle-orm/expressions';
import { getMinistryEvents, getMinistryNewsArticles } from '$lib/server/db/queries';
import { getMediaUrl } from '$lib/server/secrets';

export async function load() {
	const where_events = eq(bibleEducationEvents.category, 'courses'); // Example condition
	const events = await getMinistryEvents(bibleEducationEvents, where_events);
	const news_articles = await getMinistryNewsArticles(bibleEducationNewsArticles);
	return {
		events,
		news_articles,
		media_url:getMediaUrl() 
	};
}
