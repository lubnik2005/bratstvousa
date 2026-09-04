import { env } from '$env/dynamic/private';
import { childrensEvents, childrensFiles, childrensNewsArticles } from '$lib/server/db/schema';
import { getMinistryEvents, getMinistryNewsArticles } from '$lib/server/db/queries';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ locals, setHeaders }) => {
	setHeaders({ 'cache-control': 'public, max-age=0, s-maxage=300, stale-while-revalidate=3600' });
	const allFiles = await locals.db.select().from(childrensFiles).orderBy(childrensFiles.name);

	const childrens_camp_files = allFiles.filter(
		(file) => file.category === 'children-camp' || file.category === 'preteen-camp'
	);

	const childrens_files = allFiles.filter(
		(file) => file.category !== 'children-camp' && file.category !== 'preteen-camp'
	);

	return {
		media_url: env.MEDIA_URL,
		articles: await getMinistryNewsArticles(locals.db, childrensNewsArticles),
		events: await getMinistryEvents(locals.db, childrensEvents),
		childrens_files,
		childrens_camp_files
	};
};
