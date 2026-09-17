import { error, redirect } from '@sveltejs/kit';
import { formAnswerForEmail } from '$lib/server/paradise/queries';
import { readSession } from '$lib/server/paradise/session';
import type { PageServerLoad } from './$types';

const sessionSecret = (platform: App.Platform | undefined): string =>
	platform?.env?.SESSION_SECRET ?? 'dev-insecure-session-secret-change-me';

export const load: PageServerLoad = async ({ params, locals, cookies, platform, setHeaders }) => {
	const identity = await readSession(cookies, sessionSecret(platform));
	if (!identity) throw redirect(303, '/?next=/account');

	setHeaders({ 'cache-control': 'private, no-cache' });

	const id = Number(params.id);
	if (!Number.isInteger(id) || id <= 0) throw error(404, 'Form not found');

	const form = await formAnswerForEmail(locals.db, id, identity.email);
	if (!form) throw error(404, 'Form not found');

	return { camper: identity, form };
};
