import { db } from '$lib/server/db';
import { youthEvents } from '$lib/server/db/schema';
import { env } from '$env/dynamic/private';

export async function load({ params }) {
	const youth_events = await db.select().from(youthEvents).orderBy('startAt');

	return {
		youth_events,
    media_url: env.MEDIA_URL
	};
}
