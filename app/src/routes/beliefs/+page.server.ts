import { env } from '$env/dynamic/private';
import { db } from '$lib/server/db';
import { bibleEducationEvents } from '$lib/server/db/schema';
import { getMediaUrl } from '$lib/server/secrets';
import { isNotNull } from 'drizzle-orm';
import edjsHTML from 'editorjs-html';
const edjsParser = edjsHTML();

export async function load() {
	return { media_url: getMediaUrl()};
}
