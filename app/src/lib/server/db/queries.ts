import { and, desc, eq, gte, isNotNull, or, sql, type SQL } from 'drizzle-orm';
import type { AppDatabase } from '.';
import { eventSchemas, newsArticleSchemas, settings } from './schema';
import { formatDate, formatDateRange } from '$lib/helpers';

type EventTable = (typeof eventSchemas)[number];
type ArticleTable = (typeof newsArticleSchemas)[number];

export async function getMinistryEvents(
	db: AppDatabase,
	events: EventTable,
	where?: SQL | undefined
) {
	const today = new Date().toISOString().split('T')[0]; // YYYY-MM-DD for text comparison

	const baseWhere = or(gte(events.startAt, today), gte(events.endAt, today));
	const finalWhere = where ? and(baseWhere, where) : baseWhere;

	const rows = await db.select().from(events).where(finalWhere).orderBy(events.startAt);

	return rows.map((a) => ({
		startAtString: formatDate(a.startAt),
		dateRange: formatDateRange(a.startAt, a.endAt),
		...a
	}));
}

export async function getMinistryNewsArticles(db: AppDatabase, article: ArticleTable) {
	const rows = await db
		.select()
		.from(article)
		.where(isNotNull(article.date))
		.orderBy(desc(article.date));

	return rows.map((e) => ({ dateString: formatDate(e.date), ...e }));
}

/**
 * Get all events across all ministry tables, union-ed together.
 * SQLite doesn't have a drizzle unionAll helper for sqlite-core,
 * so we fetch from each table and merge in JS.
 */
export async function getAllEvents(db: AppDatabase) {
	const results = await Promise.all(
		eventSchemas.map((schema) =>
			db
				.select({
					id: schema.id,
					title: schema.title,
					startAt: schema.startAt,
					endAt: schema.endAt,
					slug: schema.slug,
					featuredImage: schema.featuredImage,
					description: schema.description,
					content: schema.content,
					editorjs: schema.editorjs,
					use_editorjs: schema.use_editorjs
				})
				.from(schema)
		)
	);
	return results.flat();
}

/**
 * Get all events ordered by start date, filtered to future events.
 */
export async function getAllEventsOrdered(db: AppDatabase) {
	const all = await getAllEvents(db);
	const today = new Date().toISOString().split('T')[0];
	return all
		.filter((e) => (e.startAt && e.startAt > today) || (e.endAt && e.endAt > today))
		.sort((a, b) => (a.startAt ?? '').localeCompare(b.startAt ?? ''));
}

/**
 * Get all news articles across all ministry tables, union-ed together.
 */
export async function getAllNewsArticles(db: AppDatabase) {
	const results = await Promise.all(
		newsArticleSchemas.map((schema) =>
			db
				.select({
					id: schema.id,
					title: schema.title,
					date: schema.date,
					slug: schema.slug,
					content: schema.content,
					editorjs: schema.editorjs,
					use_editorjs: schema.use_editorjs,
					featuredImage: schema.featuredImage
				})
				.from(schema)
		)
	);
	return results.flat();
}

/**
 * Get all news articles ordered by date descending, with non-null dates.
 */
export async function getAllNewsArticlesOrdered(db: AppDatabase) {
	const all = await getAllNewsArticles(db);
	return all
		.filter((a) => a.date !== null)
		.sort((a, b) => (b.date ?? '').localeCompare(a.date ?? ''));
}

export async function setting(db: AppDatabase, name: string): Promise<unknown> {
	return (await db.select().from(settings).where(eq(settings.name, name)))?.[0]?.payload;
}
