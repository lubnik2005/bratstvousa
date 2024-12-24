import { db } from '$lib/server/db';
import { newsArticles } from '$lib/server/db/schema';
import { eq } from 'drizzle-orm';

export async function load({ params }) {
	const news_articles = await db
		.select()
		.from(newsArticles)
		.where(eq(newsArticles.slug, params.slug));
	const news_article = news_articles[0];

	//     ??.where(eq(newsArticles.slug, params.slug)))[0] ??
	// null;
	return {
		news_article
	};
}
