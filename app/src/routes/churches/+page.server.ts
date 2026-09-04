import { env } from '$env/dynamic/private';
import { churches } from '$lib/server/db/schema';
import { desc } from 'drizzle-orm';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ locals, setHeaders }) => {
	setHeaders({ 'cache-control': 'public, max-age=0, s-maxage=300, stale-while-revalidate=3600' });
	const allChurches = await locals.db.select().from(churches).orderBy(desc(churches.state));
	return {
		churches: allChurches.sort((a, b) => {
			const stateA = a.city?.split(', ')[1] ?? '';
			const stateB = b.city?.split(', ')[1] ?? '';

			if (stateA < stateB) return -1;
			if (stateA > stateB) return 1;

			const cityA = a.city?.split(', ')[0] ?? '';
			const cityB = b.city?.split(', ')[0] ?? '';
			return cityA.localeCompare(cityB);
		}),
		media_url: env.MEDIA_URL
	};
};
