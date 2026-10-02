import { readSession } from '$lib/server/paradise/session';
import { PRIVATE_CONTACT } from '$lib/server/contact-private';
import type { LayoutServerLoad } from './$types';

const sessionSecret = (platform: App.Platform | undefined) =>
	platform?.env?.SESSION_SECRET ?? 'dev-insecure-session-secret-change-me';

export const load: LayoutServerLoad = async ({ cookies, platform }) => {
	const camper = await readSession(cookies, sessionSecret(platform));
	return {
		camper,
		topupUrl: platform?.env?.PUBLIC_ZEFFY_TOPUP_URL ?? null,
		// Signed-in only, so the number never appears in public HTML or JS.
		privateContact: camper ? PRIVATE_CONTACT : null
	};
};
