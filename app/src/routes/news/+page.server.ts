import { db } from '$lib/server/db';
import { youthNewsArticles } from '$lib/server/db/schema';

export async function load({ params }) {
	const youth_news_articles = await db.select().from(youthNewsArticles).orderBy('date');

	return {
		youth_news_articles
	};
}
