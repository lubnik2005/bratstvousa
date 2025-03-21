import { db } from '$lib/server/db';
import { bibleEducationNewsArticles, eventSchemas, newsArticles } from '$lib/server/db/schema';
import { desc, eq, isNotNull, count, sql } from 'drizzle-orm';
import { env } from '$env/dynamic/private';
import { formatDate } from '$lib/helpers';
import { unionAll } from 'drizzle-orm/mysql-core';
import { newsArticlesSchema, newsArticlesSchemaOrdered } from '$lib/server/db/queries';

export async function load({ params, url }) {
	// Get the page parameter from the query string, default to page 1
	const page = Number(url.searchParams.get('page')) || 1;
	const perPage = 30;
	const offset = (page - 1) * perPage;

	// Query the total count for pagination controls
	const b = await db.select().from(newsArticlesSchemaOrdered);
	const a = await db.select({ count: count() }).from(newsArticlesSchemaOrdered);
	const news_articles_count = (
		await db.select({ count: count() }).from(newsArticlesSchemaOrdered)
	)[0].count;
	// Query the database for the current page
	const news_articles = (await newsArticlesSchemaOrdered.limit(perPage).offset(offset)).map(
		(a) => ({
			date_string: formatDate(a.date),
			...a
		})
	);

	return {
		news_articles,
		page,
		perPage,
		news_articles_count,
		media_url: env.MEDIA_URL
	};
}
