import { env } from '$env/dynamic/private';
import { setting } from '$lib/server/db/queries';
import { getMediaUrl } from '$lib/server/secrets';

export async function load({ params }) {
	return {
		media_url: getMediaUrl(),
		short_introduction_content: await setting('short_introduction_content')
	};
}
