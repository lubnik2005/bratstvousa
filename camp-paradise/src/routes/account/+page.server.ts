import { redirect } from '@sveltejs/kit';
import {
	reservationsForEmail,
	listOpenEvents,
	eventCapacity,
	formAnswersForEmail
} from '$lib/server/paradise/queries';
import { readSession, clearSession } from '$lib/server/paradise/session';
import type { Actions, PageServerLoad } from './$types';

const sessionSecret = (platform: App.Platform | undefined) =>
	platform?.env?.SESSION_SECRET ?? 'dev-insecure-session-secret-change-me';

export const load: PageServerLoad = async ({ locals, cookies, platform, setHeaders }) => {
	const identity = await readSession(cookies, sessionSecret(platform));
	if (!identity) {
		throw redirect(303, '/?next=/account');
	}

	setHeaders({ 'cache-control': 'private, no-cache' });

	const [reservations, forms, openRaw] = await Promise.all([
		reservationsForEmail(locals.db, identity.email),
		formAnswersForEmail(locals.db, identity.email),
		listOpenEvents(locals.db)
	]);
	const open = await Promise.all(
		openRaw.map(async (e) => ({ ...e, ...(await eventCapacity(locals.db, e.id)) }))
	);

	return { camper: identity, reservations, forms, open };
};

export const actions: Actions = {
	signout: async ({ cookies }) => {
		clearSession(cookies);
		throw redirect(303, '/');
	}
};
