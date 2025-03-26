import { env } from '$env/dynamic/private';
import { setting } from '$lib/server/db/queries';

export async function load({ params }) {
	return {
		media_url: env.MEDIA_URL,
		short_introduction_content: await setting('short_introduction_content')
	};
}
