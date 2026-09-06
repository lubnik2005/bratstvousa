import { env } from '$env/dynamic/private';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ setHeaders }) => {
	setHeaders({
		'cache-control': 'public, max-age=0, s-maxage=300, stale-while-revalidate=3600'
	});
	return { media_url: env.MEDIA_URL };
};
