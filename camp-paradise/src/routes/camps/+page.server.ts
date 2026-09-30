import { redirect } from '@sveltejs/kit';
import {
	listOpenEvents,
	listUpcomingEvents,
	eventCapacity,
	balanceForEmail,
	reservationsForEmail
} from '$lib/server/paradise/queries';
import { readSession } from '$lib/server/paradise/session';
import type { PageServerLoad } from './$types';

type Booked = { confirmationCode: string | null; roomName: string | null; status: string } | null;

type OpenEvent = {
	id: number;
	name: string;
	startOn: string | null;
	endOn: string | null;
	registrationEndAt: string | null;
	description: string | null;
	total: number;
	available: number;
	booked: Booked;
};

type UpcomingEvent = {
	id: number;
	name: string;
	startOn: string | null;
	endOn: string | null;
	registrationStartAt: string | null;
	description: string | null;
};

const sessionSecret = (platform: App.Platform | undefined): string =>
	platform?.env?.SESSION_SECRET ?? 'dev-insecure-session-secret-change-me';

export const load: PageServerLoad = async ({ locals, cookies, platform, setHeaders }) => {
	// Camps listing is gated behind a signed-in camper. The response carries
	// per-user layout data, so it must never be shared-cached.
	const identity = await readSession(cookies, sessionSecret(platform));
	if (!identity) throw redirect(303, '/?next=/camps');

	setHeaders({ 'cache-control': 'private, no-cache' });

	let open: OpenEvent[] = [];
	let upcoming: UpcomingEvent[] = [];
	let balanceCents = 0;

	try {
		// Independent queries run in parallel to minimise serial D1 round-trips.
		const [openRows, upcomingRows, balance, reservations] = await Promise.all([
			listOpenEvents(locals.db),
			listUpcomingEvents(locals.db),
			balanceForEmail(locals.db, identity.email),
			reservationsForEmail(locals.db, identity.email)
		]);

		const active = reservations.filter((r) => r.status === 'confirmed' || r.status === 'held');

		const caps = await Promise.all(openRows.map((e) => eventCapacity(locals.db, e.id)));
		open = openRows.map((e, i) => {
			const mine = active.find((r) => r.eventId === e.id);
			return {
				id: e.id,
				name: e.name,
				startOn: e.startOn,
				endOn: e.endOn,
				registrationEndAt: e.registrationEndAt,
				description: e.description,
				total: caps[i].total,
				available: caps[i].available,
				booked: mine
					? {
							confirmationCode: mine.confirmationCode,
							roomName: mine.roomName,
							status: mine.status
						}
					: null
			};
		});

		upcoming = upcomingRows.map((e) => ({
			id: e.id,
			name: e.name,
			startOn: e.startOn,
			endOn: e.endOn,
			registrationStartAt: e.registrationStartAt,
			description: e.description
		}));

		balanceCents = balance;
	} catch (err) {
		console.error('load camps failed:', err);
	}

	return { camper: identity, open, upcoming, balanceCents };
};
