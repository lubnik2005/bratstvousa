import { db } from '$lib/server/db';
import { env } from '$env/dynamic/private';
import { churches } from '$lib/server/db/schema';
import { desc } from 'drizzle-orm';
import { getMediaUrl } from '$lib/server/secrets';

export async function load() {
	return {
		churches: (await db.select().from(churches).orderBy(desc(churches.state))).sort((a, b) => {
			const stateA = a.city.split(', ')[1];
			const stateB = b.city.split(', ')[1];

			if (stateA < stateB) return -1;
			if (stateA > stateB) return 1;

			// If states are the same, compare cities
			const cityA = a.city.split(', ')[0];
			const cityB = b.city.split(', ')[0];
			return cityA.localeCompare(cityB);
		}),
		media_url: getMediaUrl()
	};
}
