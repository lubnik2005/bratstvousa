import { env } from '$env/dynamic/private';
import { db } from '$lib/server/db';
import { getMinistryEvents, getMinistryNewsArticles } from '$lib/server/db/queries';
import {
	childrensEvents,
	childrensFiles,
	familyEvents,
	familyNewsArticles
} from '$lib/server/db/schema';
import { isNull, and, desc, or, gte, lt } from 'drizzle-orm';

export async function load({ params }) {
	return {
		media_url: env.MEDIA_URL,
		events: await getMinistryEvents(familyEvents),
		articles: await getMinistryNewsArticles(familyNewsArticles)
	};
}
