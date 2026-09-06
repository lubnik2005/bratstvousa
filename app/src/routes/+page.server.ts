import { env } from '$env/dynamic/private';
import { getAllEventsOrdered, getAllNewsArticlesOrdered } from '$lib/server/db/queries';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ locals, setHeaders }) => {
	setHeaders({
		'cache-control': 'public, max-age=0, s-maxage=300, stale-while-revalidate=3600'
	});

	const events = (await getAllEventsOrdered(locals.db)).slice(0, 5);
	const news_articles = (await getAllNewsArticlesOrdered(locals.db)).slice(0, 4);

	events.map((event: any) => {
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
};
