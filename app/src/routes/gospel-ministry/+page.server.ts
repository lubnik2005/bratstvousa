import { gospelEvents } from '$lib/server/db/schema';
import { getMinistryEvents } from '$lib/server/db/queries';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ locals, platform, setHeaders }) => {
	setHeaders({ 'cache-control': 'public, max-age=0, s-maxage=300, stale-while-revalidate=3600' });
	return {
		events: await getMinistryEvents(locals.db, gospelEvents),
		articles: [],
		media_url: platform?.env?.MEDIA_URL ?? ''
	};
};
