import { setting } from '$lib/server/db/queries';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ locals, platform, setHeaders }) => {
	setHeaders({ 'cache-control': 'public, max-age=0, s-maxage=300, stale-while-revalidate=3600' });
	return {
		media_url: platform?.env?.MEDIA_URL ?? '',
		short_introduction_content: await setting(locals.db, 'short_introduction_content')
	};
};
