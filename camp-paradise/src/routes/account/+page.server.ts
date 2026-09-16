import { redirect } from '@sveltejs/kit';
import { reservationsForEmail } from '$lib/server/paradise/queries';
import { readSession, clearSession } from '$lib/server/paradise/session';
import type { Actions, PageServerLoad } from './$types';

const sessionSecret = (platform: App.Platform | undefined) =>
	platform?.env?.SESSION_SECRET ?? 'dev-insecure-session-secret-change-me';

export const load: PageServerLoad = async ({ locals, cookies, platform, setHeaders }) => {
	const identity = await readSession(cookies, sessionSecret(platform));
	if (!identity) {
		throw redirect(303, '/login?next=/account');
	}

	setHeaders({ 'cache-control': 'private, no-cache' });

	const reservations = await reservationsForEmail(locals.db, identity.email);

	return { camper: identity, reservations };
};

export const actions: Actions = {
	signout: async ({ cookies }) => {
		clearSession(cookies);
		throw redirect(303, '/');
	}
};
