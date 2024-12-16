import { db } from '$lib/server/db';
import { youthEvents } from '$lib/server/db/schema';

export async function load({ params }) {
	const youth_events = await db.select().from(youthEvents);

	return {
		youth_events
	};
}
