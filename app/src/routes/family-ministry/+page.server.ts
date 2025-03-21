import { familyNewsArticles, familyEvents } from '$lib/server/db/schema';
import { env } from '$env/dynamic/private';
import { getMinistryEvents, getMinistryNewsArticles } from '$lib/server/db/queries';

export async function load() {
	return {
		events: await getMinistryEvents(familyEvents),
		news_articles: await getMinistryNewsArticles(familyNewsArticles),
		media_url: env.MEDIA_URL
	};
}
