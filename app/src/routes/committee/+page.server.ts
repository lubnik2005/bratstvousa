import { env } from '$env/dynamic/private';

export async function load({ params }) {
	return {
		media_url: env.MEDIA_URL
	};
}
