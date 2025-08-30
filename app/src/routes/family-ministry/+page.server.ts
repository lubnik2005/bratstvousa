import { familyNewsArticles, familyEvents } from '$lib/server/db/schema';
import { env } from '$env/dynamic/private';
import { getMinistryEvents, getMinistryNewsArticles } from '$lib/server/db/queries';
import { getMediaUrl } from '$lib/server/secrets';

export async function load() {
	return {
		events: await getMinistryEvents(familyEvents),
		news_articles: await getMinistryNewsArticles(familyNewsArticles),
		media_url:getMediaUrl() 
	};
}
