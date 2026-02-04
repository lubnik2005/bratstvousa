import { and, desc, eq, gte, isNotNull, or, sql, type SQL } from 'drizzle-orm';
import { db, isMockDb } from '.';
import {
	eventSchemas,
	newsArticleSchemas,
	childrensEvents,
	Event,
	Article,
	childrensNewsArticles,
	newsArticles,
	bibleEducationNewsArticles,
	settings,
	youthEvents,
	bibleEducationEvents,
	gospelEvents,
	musicEvents,
	familyEvents,
	generalEvents,
	youthNewsArticles
} from './schema';
import { formatDate } from '$lib/helpers';
import { unionAll } from 'drizzle-orm/mysql-core';

export async function getMinistryEvents(
	events: Event,
	where?: SQL | undefined
): Promise<Array<ReturnType<typeof formatDate> & Record<string, unknown>>> {
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

export async function getMinistryNewsArticles(
	article: Article
): Promise<Array<ReturnType<typeof formatDate> & Record<string, unknown>>> {
	return (
		await db.select().from(article).where(isNotNull(article.date)).orderBy(desc(article.date))
	).map((e) => ({ dateString: formatDate(e.date), ...e })); // Order archive descending
}

export function eventsSchema(): any {
	// Simplified version for mock database
	if (isMockDb) {
		return {
			where: (condition: any) => ({
				orderBy: (order: any) => ({
					limit: (n: number) => ({
						offset: (offsetValue: number) => {
							const allEvents = [
								...((db as any)._mockData?.youthEvents || []),
								...((db as any)._mockData?.childrensEvents || []),
								...((db as any)._mockData?.bibleEducationEvents || []),
								...((db as any)._mockData?.gospelEvents || []),
								...((db as any)._mockData?.musicEvents || []),
								...((db as any)._mockData?.familyEvents || []),
								...((db as any)._mockData?.generalEvents || [])
							];
							const today = new Date();
							return Promise.resolve(
								allEvents
									.filter((e: any) => new Date(e.startAt) > today)
									.slice(offsetValue, offsetValue + n)
							);
						},
						then: (resolve: any) => {
							const allEvents = [
								...((db as any)._mockData?.youthEvents || []),
								...((db as any)._mockData?.childrensEvents || []),
								...((db as any)._mockData?.bibleEducationEvents || []),
								...((db as any)._mockData?.gospelEvents || []),
								...((db as any)._mockData?.musicEvents || []),
								...((db as any)._mockData?.familyEvents || []),
								...((db as any)._mockData?.generalEvents || [])
							];
							const today = new Date();
							return resolve(allEvents.filter((e: any) => new Date(e.startAt) > today).slice(0, n));
						}
					}),
					then: (resolve: any) => {
						const allEvents = [
							...((db as any)._mockData?.youthEvents || []),
							...((db as any)._mockData?.childrensEvents || []),
							...((db as any)._mockData?.bibleEducationEvents || []),
							...((db as any)._mockData?.gospelEvents || []),
							...((db as any)._mockData?.musicEvents || []),
							...((db as any)._mockData?.familyEvents || []),
							...((db as any)._mockData?.generalEvents || [])
						];
						return resolve(allEvents.sort((a: any, b: any) => a.startAt.localeCompare(b.startAt)));
					}
				}),
				then: (resolve: any) => {
					const allEvents = [
						...((db as any)._mockData?.youthEvents || []),
						...((db as any)._mockData?.childrensEvents || []),
						...((db as any)._mockData?.bibleEducationEvents || []),
						...((db as any)._mockData?.gospelEvents || []),
						...((db as any)._mockData?.musicEvents || []),
						...((db as any)._mockData?.familyEvents || []),
						...((db as any)._mockData?.generalEvents || [])
					];
					const today = new Date();
					return resolve(allEvents.filter((e: any) => new Date(e.startAt) > today));
				}
			}),
			orderBy: (order: any) => ({
				then: (resolve: any) => {
					const allEvents = [
						...((db as any)._mockData?.youthEvents || []),
						...((db as any)._mockData?.childrensEvents || []),
						...((db as any)._mockData?.bibleEducationEvents || []),
						...((db as any)._mockData?.gospelEvents || []),
						...((db as any)._mockData?.musicEvents || []),
						...((db as any)._mockData?.familyEvents || []),
						...((db as any)._mockData?.generalEvents || [])
					];
					return resolve(allEvents.sort((a: any, b: any) => a.startAt.localeCompare(b.startAt)));
				}
			}),
			then: (resolve: any) => {
				const allEvents = [
					...((db as any)._mockData?.youthEvents || []),
					...((db as any)._mockData?.childrensEvents || []),
					...((db as any)._mockData?.bibleEducationEvents || []),
					...((db as any)._mockData?.gospelEvents || []),
					...((db as any)._mockData?.musicEvents || []),
					...((db as any)._mockData?.familyEvents || []),
					...((db as any)._mockData?.generalEvents || [])
				];
				return resolve(allEvents);
			}
		} as any;
	}

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

export function newsArticlesSchema(): any {
	// Simplified version for mock database
	if (isMockDb) {
		return {
			where: (condition: any) => ({
				orderBy: (order: any) => ({
					limit: (n: number) => ({
						offset: (offsetValue: number) => {
							const allArticles = [
								...((db as any)._mockData?.newsArticles || []),
								...((db as any)._mockData?.youthNewsArticles || [])
							];
							return Promise.resolve(
								allArticles
									.filter((a: any) => a.date)
									.sort((a: any, b: any) => b.date.localeCompare(a.date))
									.slice(offsetValue, offsetValue + n)
							);
						},
						then: (resolve: any) => {
							const allArticles = [
								...((db as any)._mockData?.newsArticles || []),
								...((db as any)._mockData?.youthNewsArticles || [])
							];
							return resolve(
								allArticles
									.filter((a: any) => a.date)
									.sort((a: any, b: any) => b.date.localeCompare(a.date))
									.slice(0, n)
							);
						}
					}),
					then: (resolve: any) => {
						const allArticles = [
							...((db as any)._mockData?.newsArticles || []),
							...((db as any)._mockData?.youthNewsArticles || [])
						];
						return resolve(
							allArticles
								.filter((a: any) => a.date)
								.sort((a: any, b: any) => b.date.localeCompare(a.date))
						);
					}
				}),
				then: (resolve: any) => {
					const allArticles = [
						...((db as any)._mockData?.newsArticles || []),
						...((db as any)._mockData?.youthNewsArticles || [])
					];
					return resolve(allArticles.filter((a: any) => a.date));
				}
			}),
			orderBy: (order: any) => ({
				then: (resolve: any) => {
					const allArticles = [
						...((db as any)._mockData?.newsArticles || []),
						...((db as any)._mockData?.youthNewsArticles || [])
					];
					return resolve(allArticles.sort((a: any, b: any) => b.date.localeCompare(a.date)));
				}
			}),
			then: (resolve: any) => {
				const allArticles = [
					...((db as any)._mockData?.newsArticles || []),
					...((db as any)._mockData?.youthNewsArticles || [])
				];
				return resolve(allArticles);
			}
		} as any;
	}

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

export function eventsSchemaOrdered(): any {
	return eventsSchema()
		.where(sql`events_union.start_at > NOW()`)
		.orderBy(sql`events_union.start_at`);
}

export function newsArticlesSchemaOrdered(): any {
	return newsArticlesSchema()
		.where(sql`news_articles_union.date IS NOT NULL`)
		.orderBy(sql`news_articles_union.date DESC`);
}

export async function setting(name: string): Promise<unknown> {
	return (await db.select().from(settings).where(eq(settings.name, name)))?.[0]?.payload;
}
