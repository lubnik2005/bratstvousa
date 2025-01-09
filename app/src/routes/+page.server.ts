import { db } from '$lib/server/db';
import { newsArticles, eventSchemas, Event } from '$lib/server/db/schema';
import { env } from '$env/dynamic/private';
import { lte, desc, asc, or, sql, eq, gte, isNull, and, lt } from 'drizzle-orm';
import { unionAll } from 'drizzle-orm/pg-core';
export async function load() {
	const today = new Date().toISOString(); // Convert Date to ISO string

	const eventsSchema = unionAll(
		...eventSchemas.map((eventSchema) =>
			db
				.select({
					id: eventSchema.id,
					title: eventSchema.title,
					startAt: eventSchema.startAt,
					endAt: eventSchema.endAt,
					slug: eventSchema.slug
				})
				.from(eventSchema)
		)
	);

	const [events, news_articles] = await Promise.all([
		eventsSchema
			.where(lte(today, Event.startAt))
			.orderBy(sql`start_at ASC`)
			.limit(5),
		db.select().from(newsArticles).orderBy(desc(newsArticles.date)).limit(5)
	]);
	events.map((event: Event) => {
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
				? ' — ' +
					new Intl.DateTimeFormat('ru-RU', {
						day: 'numeric',
						month: 'long',
						year: 'numeric'
					}).format(new Date(event.endAt))
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
