import { db, isMockDb } from '$lib/server/db';
import { eventSchemas } from '$lib/server/db/schema';
import { sql, gte, lte, and } from 'drizzle-orm';
import type { PageServerLoad } from './$types';

// Ministry metadata for calendar display
const ministryMeta: Record<string, { color: string; slug: string }> = {
	youthEvents: { color: '#2176AE', slug: 'youth-ministry' },
	childrensEvents: { color: '#8D230F', slug: 'childrens-ministry' },
	bibleEducationEvents: { color: '#F2C572', slug: 'bible-education-ministry' },
	generalEvents: { color: '#397367', slug: 'general-event' },
	gospelEvents: { color: '#6C4A79', slug: 'gospel-ministry' },
	musicEvents: { color: '#5A4A42', slug: 'music-choir-ministry' },
	familyEvents: { color: '#FF8C42', slug: 'family-ministry' }
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

export const load: PageServerLoad = async ({ url }) => {
	// Get date range from URL params (default: 1 year before to 1 year after today)
	const now = new Date();
	const defaultStart = new Date(now.getFullYear() - 1, now.getMonth(), 1);
	const defaultEnd = new Date(now.getFullYear() + 1, now.getMonth() + 1, 0);

	const startDate = url.searchParams.get('start') ?? defaultStart.toISOString().slice(0, 10);
	const endDate = url.searchParams.get('end') ?? defaultEnd.toISOString().slice(0, 10);

	// Mock database branch
	if (isMockDb) {
		const mockData = (db as any)._mockData;
		const allEvents: CalendarEvent[] = [];

		schemaNames.forEach((schemaName) => {
			const events = mockData[schemaName] || [];
			const meta = ministryMeta[schemaName];

			events.forEach((event: any) => {
				// Apply date filtering
				if (event.startAt < startDate || event.startAt > endDate) return;

				// Add a day to end date for fullcalendar.io (end is exclusive)
				const endPlusOne = event.endAt
					? new Date(new Date(event.endAt).getTime() + 86400000).toISOString().slice(0, 10)
					: event.startAt;

				allEvents.push({
					id: event.id,
					title: event.title,
					start: event.startAt,
					end: endPlusOne,
					url: `/${meta.slug}/${event.slug}`,
					region: event.region || 'all',
					backgroundColor: meta.color,
					borderColor: meta.color,
					schemaName
				});
			});
		});

		// Sort by start date
		allEvents.sort((a, b) => a.start.localeCompare(b.start));

		return { events: allEvents };
	}

	// Real database branch - query each table individually (more efficient than unionAll for filtered queries)
	const allEvents: CalendarEvent[] = [];

	// Execute all queries in parallel
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

		return events.map(
			(event: {
				id: number;
				title: string;
				startAt: string | null;
				endAt: string | null;
				slug: string | null;
				region: string;
			}) => {
				// Add a day to end date for fullcalendar.io (end is exclusive)
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
			}
		);
	});

	const results = await Promise.all(queryPromises);
	results.forEach((eventList) => allEvents.push(...eventList));

	// Sort by start date
	allEvents.sort((a, b) => a.start.localeCompare(b.start));

	return { events: allEvents };
};
