import {
	listOpenEvents,
	listUpcomingEvents,
	listPastEvents,
	eventCapacity,
	siteStats
} from '$lib/server/paradise/queries';
import type { PageServerLoad } from './$types';

type OpenEvent = {
	id: number;
	name: string;
	startOn: string | null;
	endOn: string | null;
	registrationEndAt: string | null;
	description: string | null;
	total: number;
	available: number;
};

type UpcomingEvent = {
	id: number;
	name: string;
	startOn: string | null;
	endOn: string | null;
	registrationStartAt: string | null;
	description: string | null;
};

type PastEvent = { id: number; name: string; startOn: string | null; endOn: string | null };

export const load: PageServerLoad = async ({ locals }) => {
	const open: OpenEvent[] = [];
	let upcoming: UpcomingEvent[] = [];
	let past: PastEvent[] = [];
	let stats = { campers: 0, camps: 0 };

	try {
		const openRows = await listOpenEvents(locals.db);
		for (const e of openRows) {
			const cap = await eventCapacity(locals.db, e.id);
			open.push({
				id: e.id,
				name: e.name,
				startOn: e.startOn,
				endOn: e.endOn,
				registrationEndAt: e.registrationEndAt,
				description: e.description,
				total: cap.total,
				available: cap.available
			});
		}

		upcoming = (await listUpcomingEvents(locals.db)).map((e) => ({
			id: e.id,
			name: e.name,
			startOn: e.startOn,
			endOn: e.endOn,
			registrationStartAt: e.registrationStartAt,
			description: e.description
		}));

		past = await listPastEvents(locals.db, 8);
		stats = await siteStats(locals.db);
	} catch (err) {
		console.error('load home failed:', err);
	}

	return { open, upcoming, past, stats };
};
