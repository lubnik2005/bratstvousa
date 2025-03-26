import { env } from '$env/dynamic/private';
import { setting } from '$lib/server/db/queries';

export async function load() {
	return {
		media_url: env.MEDIA_URL,
		donation_url: await setting('donation_url'),
		donation_tokenuid: await setting('donation_tokenuid')
	};
}
