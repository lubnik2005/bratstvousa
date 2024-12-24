import { db } from '$lib/server/db';
import { bibleEducationEvents, childrensEvents, youthEvents } from '$lib/server/db/schema';
import { eq } from 'drizzle-orm/expressions';

// Array of event table names

// Load function
export async function load({ params }) {
	const slug = params.slug; // Get the slug from params
	if (!slug) {
		throw new Error('Slug is required');
	}
	const events = (
		await Promise.all([
			db.select().from(bibleEducationEvents).where(eq(bibleEducationEvents.slug, params.slug)),
			db.select().from(childrensEvents).where(eq(childrensEvents.slug, params.slug)),
			db.select().from(youthEvents).where(eq(youthEvents.slug, params.slug))
		])
	).flat();

	return {
		event: events[0]
	};
}
