import { env } from '$env/dynamic/private';

export async function load() {
	return { media_url: env.MEDIA_URL };
}
