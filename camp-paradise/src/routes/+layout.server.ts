import { readSession } from '$lib/server/paradise/session';
import type { LayoutServerLoad } from './$types';

const sessionSecret = (platform: App.Platform | undefined) =>
	platform?.env?.SESSION_SECRET ?? 'dev-insecure-session-secret-change-me';

export const load: LayoutServerLoad = async ({ cookies, platform }) => {
	const camper = await readSession(cookies, sessionSecret(platform));
	return { camper };
};
