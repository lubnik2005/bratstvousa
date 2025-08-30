import { db } from '$lib/server/db';
import { bibleEducationEvents, bibleEducationNewsArticles } from '$lib/server/db/schema';
import { env } from '$env/dynamic/private';
import { formatDate } from '$lib/helpers';

import { eq, lt, gte, or, and, isNull } from 'drizzle-orm/expressions';
import { getMinistryEvents, getMinistryNewsArticles } from '$lib/server/db/queries';
import { getMediaUrl } from '$lib/server/secrets';

export async function load({ params }) {
	return {
		events: await getMinistryEvents(bibleEducationEvents),
		articles: await getMinistryNewsArticles(bibleEducationNewsArticles),
		media_url: getMediaUrl() 
	};
}
