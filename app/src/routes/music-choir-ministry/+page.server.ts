import { env } from '$env/dynamic/private';
import { getMinistryEvents, getMinistryNewsArticles } from '$lib/server/db/queries';
import { musicEvents, musicNewsArticles } from '$lib/server/db/schema';

export async function load() {
	return {
		media_url: env.MEDIA_URL,
		events: await getMinistryEvents(musicEvents),
		articles: await getMinistryNewsArticles(musicNewsArticles)
	};
}
