import { and, desc, eq, gte, isNotNull, or, sql } from 'drizzle-orm';
import { db } from '.';
import {
	eventSchemas,
	newsArticleSchemas,
	childrensEvents,
	Event,
	Article,
	childrensNewsArticles,
	newsArticles,
	bibleEducationNewsArticles,
	settings
} from './schema';
import { formatDate } from '$lib/helpers';
import { unionAll } from 'drizzle-orm/mysql-core';

export async function getMinistryEvents(events: Event, where?: unknown) {
	const today = new Date().toISOString(); // Use Date object directly

	let query = db.select().from(events);

	if (where) {
		query = query.where(and(or(gte(events.startAt, today), gte(events.endAt, today)), where));
	} else {
		query = query.where(or(gte(events.startAt, today), gte(events.endAt, today))); // Ensure Drizzle handles date conversion
	}
	query = query.orderBy(events.startAt);

	return (await query).map((a) => ({ startAtString: formatDate(a.startAt), ...a }));
}

export async function getMinistryNewsArticles(article: Article) {
	return (
		await db.select().from(article).where(isNotNull(article.date)).orderBy(desc(article.date))
	).map((e) => ({ dateString: formatDate(e.date), ...e })); // Order archive descending
}

export function eventsSchema() {
	return db
		.select({
			title: sql`events_union.title`,
			startAt: sql`events_union.start_at`,
			endAt: sql`events_union.end_at`,
			slug: sql`events_union.slug`,
			featuredImage: sql`events_union.featured_image`,
			editorjs: sql`events_union.editorjs`,
			use_editorjs: sql`events_union.use_editorjs`
		})
		.from(
			unionAll(
				...eventSchemas.map((eventSchema) =>
					db
						.select({
							id: eventSchema.id,
							title: eventSchema.title,
							startAt: eventSchema.startAt,
							endAt: eventSchema.endAt,
							slug: eventSchema.slug,
							featuredImage: eventSchema.featuredImage,
							editorjs: eventSchema.editorjs,
							use_editorjs: eventSchema.use_editorjs
						})
						.from(eventSchema)
				)
			).as('events_union')
		);
}

export function newsArticlesSchema() {
	return db
		.select({
			id: sql<Pick<typeof Article, 'id'>['id']>`ROW_NUMBER() OVER ()`, // Dynamically gets Article.id type
			title: sql<(typeof Article)['title']>`news_articles_union.title`,
			date: sql<(typeof Article)['date']>`news_articles_union.date`,
			slug: sql<(typeof Article)['slug']>`news_articles_union.slug`,
			content: sql<(typeof Article)['content']>`news_articles_union.content`,
			editorjs: sql<(typeof Article)['editorjs']>`news_articles_union.editorjs`,
			use_editorjs: sql<(typeof Article)['use_editorjs']>`news_articles_union.use_editorjs`,
			featuredImage: sql<(typeof Article)['featuredImage']>`news_articles_union.featured_image`
		})
		.from(
			unionAll(...newsArticleSchemas.map((a) => db.select().from(a))).as('news_articles_union')
		);
}

export function eventsSchemaOrdered() {
	return eventsSchema()
		.where(sql`events_union.start_at > NOW()`)
		.orderBy(sql`events_union.start_at`);
}

export function newsArticlesSchemaOrdered() {
	return newsArticlesSchema()
		.where(sql`news_articles_union.date IS NOT NULL`)
		.orderBy(sql`news_articles_union.date DESC`);
}

export async function setting(name: string) {
	return (await db.select().from(settings).where(eq(settings.name, name)))?.[0]?.payload;
}
