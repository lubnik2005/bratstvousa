import { eventSchemas } from '$lib/server/db/schema';
import { gte, lte, and } from 'drizzle-orm';
import type { PageServerLoad } from './$types';

// Ministry metadata for calendar display.
// Colours are the muted ministry accent palette; each is dark enough that the
// white FullCalendar event text (#f3efe7) clears WCAG AA contrast (>=4.5:1).
const ministryMeta: Record<string, { color: string; slug: string }> = {
	youthEvents: { color: '#4a5f76', slug: 'youth-ministry' },
	childrensEvents: { color: '#8a5d31', slug: 'childrens-ministry' },
	bibleEducationEvents: { color: '#3f5a68', slug: 'bible-education-ministry' },
	generalEvents: { color: '#5a4a42', slug: 'general-event' },
	gospelEvents: { color: '#7a5540', slug: 'gospel-ministry' },
	musicEvents: { color: '#6a5a72', slug: 'music-choir-ministry' },
	familyEvents: { color: '#5c6b4f', slug: 'family-ministry' }
};

// Schema name mapping (order matches eventSchemas array)
const schemaNames = [
	'youthEvents',
	'childrensEvents',
	'bibleEducationEvents',
	'generalEvents',
	'gospelEvents',
	'musicEvents',
	'familyEvents'
];

export interface CalendarEvent {
	id: number;
	title: string;
	start: string;
	end: string;
	url: string;
	region: string;
	backgroundColor: string;
	borderColor: string;
	schemaName: string;
}

export const load: PageServerLoad = async ({ locals, url, setHeaders }) => {
	setHeaders({ 'cache-control': 'public, max-age=0, s-maxage=300, stale-while-revalidate=3600' });
	const now = new Date();
	const defaultStart = new Date(now.getFullYear() - 1, now.getMonth(), 1);
	const defaultEnd = new Date(now.getFullYear() + 1, now.getMonth() + 1, 0);

	const startDate = url.searchParams.get('start') ?? defaultStart.toISOString().slice(0, 10);
	const endDate = url.searchParams.get('end') ?? defaultEnd.toISOString().slice(0, 10);

	const db = locals.db;
	const allEvents: CalendarEvent[] = [];

	const queryPromises = eventSchemas.map(async (schema, i) => {
		const schemaName = schemaNames[i];
		const meta = ministryMeta[schemaName];

		const events = await db
			.select({
				id: schema.id,
				title: schema.title,
				startAt: schema.startAt,
				endAt: schema.endAt,
				slug: schema.slug,
				region: schema.region
			})
			.from(schema)
			.where(and(gte(schema.startAt, startDate), lte(schema.startAt, endDate)));

		return events.map((event) => {
			const endPlusOne = event.endAt
				? new Date(new Date(event.endAt).getTime() + 86400000).toISOString().slice(0, 10)
				: event.startAt;

			return {
				id: event.id,
				title: event.title,
				start: event.startAt,
				end: endPlusOne,
				url: `/${meta.slug}/${event.slug}`,
				region: event.region || 'all',
				backgroundColor: meta.color,
				borderColor: meta.color,
				schemaName
			} as CalendarEvent;
		});
	});

	const results = await Promise.all(queryPromises);
	results.forEach((eventList) => allEvents.push(...eventList));

	allEvents.sort((a, b) => a.start.localeCompare(b.start));

	return { events: allEvents };
};
