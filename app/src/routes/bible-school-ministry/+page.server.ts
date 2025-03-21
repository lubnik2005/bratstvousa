import { env } from '$env/dynamic/private';
import { getMinistryEvents, getMinistryNewsArticles } from '$lib/server/db/queries';
import { bibleEducationEvents, bibleEducationNewsArticles } from '$lib/server/db/schema';

export async function load({ params }) {
	return {
		events: getMinistryEvents(bibleEducationEvents),
		articles: getMinistryNewsArticles(bibleEducationNewsArticles),
		media_url: env.MEDIA_URL
	};
}
