import { env } from '$env/dynamic/private';
import { db } from '$lib/server/db';
import { childrensEvents, childrensFiles, childrensNewsArticles } from '$lib/server/db/schema';
import { isNull, and, desc, or, gte, lt, isNotNull } from 'drizzle-orm';
import { formatDate } from '$lib/helpers';
import { getMinistryEvents, getMinistryNewsArticles } from '$lib/server/db/queries';

export async function load({ params }) {
	const childrens_files = await db.select().from(childrensFiles).orderBy(childrensFiles.name);

	return {
		media_url: env.MEDIA_URL,
		articles: await getMinistryNewsArticles(childrensNewsArticles),
		events: await getMinistryEvents(childrensEvents),
		childrens_files
	};
}
