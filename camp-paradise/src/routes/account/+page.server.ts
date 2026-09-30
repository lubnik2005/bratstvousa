import { redirect } from '@sveltejs/kit';
import {
	reservationsForEmail,
	formAnswersForEmail,
	balanceForEmail,
	ledgerForEmail
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

	const [reservations, forms, balanceCents, ledger] = await Promise.all([
		reservationsForEmail(locals.db, identity.email),
		formAnswersForEmail(locals.db, identity.email),
		balanceForEmail(locals.db, identity.email),
		ledgerForEmail(locals.db, identity.email)
	]);

	return { camper: identity, reservations, forms, balanceCents, ledger };
};

export const actions: Actions = {
	signout: async ({ cookies }) => {
		clearSession(cookies);
		throw redirect(303, '/');
	}
};
