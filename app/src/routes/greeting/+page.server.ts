import { env } from '$env/dynamic/private';
import { db } from '$lib/server/db';
import { childrensEvents, childrensFiles } from '$lib/server/db/schema';
import { isNull, and, desc, or, gte, lt } from 'drizzle-orm';

export async function load({ params }) {
	return {
		media_url: env.MEDIA_URL
	};
}
