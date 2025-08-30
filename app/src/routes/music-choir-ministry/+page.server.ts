import { env } from '$env/dynamic/private';
import { getMinistryEvents, getMinistryNewsArticles } from '$lib/server/db/queries';
import { musicEvents, musicNewsArticles } from '$lib/server/db/schema';
import { getMediaUrl } from '$lib/server/secrets';

export async function load() {
	return {
		media_url: getMediaUrl(),
		events: await getMinistryEvents(musicEvents),
		articles: await getMinistryNewsArticles(musicNewsArticles)
	};
}
