import { env } from '$env/dynamic/private';
import { db } from '$lib/server/db';
import { childrensEvents, childrensFiles, childrensNewsArticles } from '$lib/server/db/schema';
import { isNull, and, desc, or, gte, lt, isNotNull } from 'drizzle-orm';
import { formatDate } from '$lib/helpers';
import { getMinistryEvents, getMinistryNewsArticles } from '$lib/server/db/queries';
import { getMediaUrl } from '$lib/server/secrets';

export async function load({ params }) {
	const allFiles = await db.select().from(childrensFiles).orderBy(childrensFiles.name);

	const childrens_camp_files = allFiles.filter(
		(file) => file.category === 'children-camp' || file.category === 'preteen-camp'
	);

	const childrens_files = allFiles.filter(
		(file) => file.category !== 'children-camp' && file.category !== 'preteen-camp'
	);

	return {
		media_url: getMediaUrl(),
		articles: await getMinistryNewsArticles(childrensNewsArticles),
		events: await getMinistryEvents(childrensEvents),
		childrens_files,
		childrens_camp_files
	};
}
