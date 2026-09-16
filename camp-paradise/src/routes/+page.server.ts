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

export const load: PageServerLoad = async ({ locals, setHeaders }) => {
	// Cache the rendered home page at Cloudflare's edge so navigations are
	// instant instead of re-running D1 queries on every request. Kept short so
	// bed availability stays reasonably fresh; stale-while-revalidate serves the
	// cached copy instantly while refreshing in the background.
	setHeaders({
		'cache-control': 'public, max-age=0, s-maxage=60, stale-while-revalidate=300'
	});

	let open: OpenEvent[] = [];
	let upcoming: UpcomingEvent[] = [];
	let past: PastEvent[] = [];
	let stats = { campers: 0, camps: 0 };

	try {
		// Independent queries run in parallel to minimise serial D1 round-trips.
		const [openRows, upcomingRows, pastRows, statsRow] = await Promise.all([
			listOpenEvents(locals.db),
			listUpcomingEvents(locals.db),
			listPastEvents(locals.db, 8),
			siteStats(locals.db)
		]);

		const caps = await Promise.all(openRows.map((e) => eventCapacity(locals.db, e.id)));
		open = openRows.map((e, i) => ({
			id: e.id,
			name: e.name,
			startOn: e.startOn,
			endOn: e.endOn,
			registrationEndAt: e.registrationEndAt,
			description: e.description,
			total: caps[i].total,
			available: caps[i].available
		}));

		upcoming = upcomingRows.map((e) => ({
			id: e.id,
			name: e.name,
			startOn: e.startOn,
			endOn: e.endOn,
			registrationStartAt: e.registrationStartAt,
			description: e.description
		}));

		past = pastRows;
		stats = statsRow;
	} catch (err) {
		console.error('load home failed:', err);
	}

	return { open, upcoming, past, stats };
};
