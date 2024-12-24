import { db } from '$lib/server/db';
import { newsArticles } from '$lib/server/db/schema';
import { desc, eq, isNotNull, count } from 'drizzle-orm';

export async function load({ params, url }) {
	// Get the page parameter from the query string, default to page 1
	const page = Number(url.searchParams.get('page')) || 1;
	const perPage = 30;
	const offset = (page - 1) * perPage;

	// Query the database for the current page
	const news_articles = await db
		.select()
		.from(newsArticles)
		.where(isNotNull(newsArticles.date))
		.orderBy(desc(newsArticles.date))
		.limit(perPage)
		.offset(offset);

	// Query the total count for pagination controls
	const totalArticles = (await db.select({ count: count() }).from(newsArticles))[0].count;

	return {
		news_articles,
		page,
		perPage,
		totalArticles
	};
}
