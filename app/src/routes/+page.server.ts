import { db } from '$lib/server/db';
import {
	youthEvents,
	youthNewsArticles,
	childrensEvents,
	childrensNewsArticles,
	newsArticles,
	bibleEducationEvents
} from '$lib/server/db/schema';
import { env } from '$env/dynamic/private';
import { lte, desc, asc, or, sql, eq, gte, isNull, and, lt } from 'drizzle-orm';
import { unionAll } from 'drizzle-orm/pg-core';
const event_limit = 5;
const news_limit = 4;

export async function load({ params }) {
	const today = new Date().toISOString(); // Convert Date to ISO string
	const models = [youthEvents, childrensEvents, bibleEducationEvents];

	const queries = models.map((model) =>
		db
			.select({
				id: model.id,
				title: model.title,
				startAt: model.startAt,
				endAt: model.endAt,
				slug: model.slug
			})
			.from(model)
			.where(lte(today, model.startAt)) // This needs to be improved
			.limit(event_limit)
	);

	const combinedEvents = unionAll(...queries).as('combinedEvents');

	const [events, news_articles] = await Promise.all([
		db.select().from(combinedEvents).orderBy(desc(combinedEvents.startAt)).limit(event_limit),
		db.select().from(newsArticles).orderBy(desc(newsArticles.date)).limit(news_limit)
	]);
	//
	// console.log({ events, news_articles });
	const es = events.map((event) => {
		console.log(event.startAt);
		event.month_short = new Intl.DateTimeFormat('ru-RU', { month: 'short' })
			.format(new Date(event.startAt))
			.toUpperCase()
			.replace('.', '');

		event.numerical_date = new Intl.DateTimeFormat('ru-RU', { day: 'numeric' })
			.format(new Date(event.startAt))
			.toUpperCase()
			.replace('.', '');

		event.dates_description = `${new Intl.DateTimeFormat('ru-RU', {
			day: 'numeric',
			month: 'long',
			year: 'numeric'
		}).format(new Date(event.startAt))} ${
			event.endAt
				? ' - ' +
					new Intl.DateTimeFormat('ru-RU', { day: 'numeric', month: 'long' }).format(
						new Date(event.endAt)
					)
				: ''
		}`;

		return event;
	});

	return {
		events,
		news_articles,
		media_url: env.MEDIA_URL
	};
}
