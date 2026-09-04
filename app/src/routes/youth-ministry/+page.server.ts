import { env } from '$env/dynamic/private';
import { youthEvents } from '$lib/server/db/schema';
import { gte, or, asc } from 'drizzle-orm';
import { formatDate } from '$lib/helpers';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ locals, setHeaders }) => {
	setHeaders({ 'cache-control': 'public, max-age=0, s-maxage=300, stale-while-revalidate=3600' });
	const today = new Date().toISOString().split('T')[0];

	const upcomingEvents = (
		await locals.db
			.select()
			.from(youthEvents)
			.where(or(gte(youthEvents.startAt, today), gte(youthEvents.endAt, today)))
			.orderBy(asc(youthEvents.startAt))
	).map((a) => ({ startAtString: formatDate(a.startAt), ...a }));

	return {
		upcomingEvents,
		media_url: env.MEDIA_URL
	};
};
