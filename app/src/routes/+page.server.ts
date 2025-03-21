import { db } from '$lib/server/db';
import { newsArticles, eventSchemas, Event } from '$lib/server/db/schema';
import { env } from '$env/dynamic/private';
import { lte, desc, asc, or, sql, eq, gte, isNull, and, lt } from 'drizzle-orm';
import { unionAll } from 'drizzle-orm/pg-core';
import {
	eventsSchema,
	eventsSchemaOrdered,
	newsArticlesSchemaOrdered
} from '$lib/server/db/queries';
export async function load() {
	const today = new Date().toISOString(); // Convert Date to ISO string
	const events = await eventsSchemaOrdered.limit(5);
	const news_articles = await newsArticlesSchemaOrdered.limit(4);

	events.map((event: Event) => {
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
