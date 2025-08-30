import { env } from '$env/dynamic/private';
import { getMediaUrl } from '$lib/server/secrets';

export async function load() {
	return { media_url: getMediaUrl()};
}
