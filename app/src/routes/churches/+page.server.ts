import { db } from '$lib/server/db';
import { env } from '$env/dynamic/private';
import { churches } from '$lib/server/db/schema';
import { desc } from 'drizzle-orm';

export async function load() {
	return {
		churches: await db.select().from(churches).orderBy(desc(churches.state)),
		media_url: env.MEDIA_URL
	};
}
