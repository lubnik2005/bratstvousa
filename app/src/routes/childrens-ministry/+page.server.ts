import { env } from '$env/dynamic/private';
import { db } from '$lib/server/db';
import { youthEvents } from '$lib/server/db/schema';

export async function load({ params }) {
	const youth_events = await db.select().from(youthEvents).orderBy('startAt');
	console.log(youth_events);

	return {
    media_url: env.MEDIA_URL,
		youth_events
	};
}
