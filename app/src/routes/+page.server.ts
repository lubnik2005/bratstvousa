import { db } from '$lib/server/db';
import { youthEvents, youthNewsArticles } from '$lib/server/db/schema';

export async function load({ params }) {
	const youth_events = await db.select().from(youthEvents).orderBy('startAt');
	const youth_news_articles = await db.select().from(youthNewsArticles).orderBy('date');
	console.log({ youth_events });

	return {
		youth_events,
		youth_news_articles
	};
}
