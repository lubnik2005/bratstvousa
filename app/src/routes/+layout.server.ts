import { env } from '$env/dynamic/private';
import { setting } from '$lib/server/db/queries';
import type { LayoutServerLoad } from './$types';

export const load: LayoutServerLoad = async ({ locals }) => {
	return {
		media_url: env.MEDIA_URL,
		donation_url: await setting(locals.db, 'donation_url'),
		donation_tokenuid: await setting(locals.db, 'donation_tokenuid')
	};
};
