import { db } from '$lib/server/db';
import {
	youthEvents,
	youthNewsArticles,
	childrensEvents,
	childrensNewsArticles
} from '$lib/server/db/schema';
import { env } from '$env/dynamic/private';


export async function load({ params }) {
	const [youth_events, youth_news_articles, childrens_events, childrens_news_articles] =
		await Promise.all([
			db.select().from(youthEvents).orderBy('startAt'),
			db.select().from(youthNewsArticles).orderBy('date'),
			db.select().from(childrensEvents).orderBy('startAt'),
			db.select().from(childrensNewsArticles).orderBy('date')
		]);
	console.log('ENV HEREJklA');
	console.log(env);
	return {
		events: [...youth_events, ...childrens_events],
		news_articles: [...youth_news_articles, ...childrens_news_articles],
		media_url: env.MEDIA_URL
	};
}
