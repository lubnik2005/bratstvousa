import { db } from '$lib/server/db';
import { Event, eventSchemas } from '$lib/server/db/schema';
import { sql } from 'drizzle-orm';
import { unionAll } from 'drizzle-orm/mysql-core';

const ministries = [
	{ name: 'youthEvents', color: '#5A4A42' },
	{ name: 'childrensEvents', color: '#8D230F' },
	{ name: 'bibleEducationEvents', color: '#F2C572' },
	{ name: 'generalEvents', color: '#397367' },
	{ name: 'gospelEvents', color: '#6C4A79' },
	{ name: 'musicEvents', color: '#2176AE' },
	{ name: 'familyEvents', color: '#FF8C42' }
];

export async function load() {
	const events = await unionAll(
		...eventSchemas.map((eventSchema, i) => {
			return db
				.select({
					id: eventSchema.id,
					title: eventSchema.title,
					start: eventSchema.startAt,
					// HACK: in the fullcalendar.io, the end date is exclusive, so I need to add a day.
					end: sql`(${eventSchema.endAt}::TIMESTAMP + INTERVAL '1 day')`,
					// end: eventSchema.endAt,
					// TODO: this should link to the ministry slug, not just 'general-event'
					url: sql`CONCAT('/general-event/', ${eventSchema.slug})`, // Add prefix to the slug
					region: eventSchema.region,
					borderColor: sql`${ministries[i].color}`,
					backgroundColor: sql`${ministries[i].color}`,
					schemaName: sql`${ministries[i].name}` // Add schema name to identify source
				})
				.from(eventSchema);
		})
	);
	return { events };
}
