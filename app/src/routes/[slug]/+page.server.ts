import { db } from '$lib/server/db';
import { youthEvents } from '$lib/server/db/schema';
import { eq } from 'drizzle-orm';

export async function load({ params }) {
	const youth_event =
		(await db.select().from(youthEvents).where(eq(youthEvents.slug, params.slug)))[0] ?? null; console.log({ youth_event, params });
	return {
		youth_event
	};
}
