import { env } from '$env/dynamic/private';
import { setting } from '$lib/server/db/queries';
import { getMediaUrl } from '$lib/server/secrets';

export async function load() {
	return {
		media_url: getMediaUrl(),
		donation_url: await setting('donation_url'),
		donation_tokenuid: await setting('donation_tokenuid')
	};
}
