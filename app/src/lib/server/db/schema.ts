import { pgTable, serial, text, integer, timestamp, varchar, date } from 'drizzle-orm/pg-core';

export const user = pgTable('user', {
	id: text('id').primaryKey(),
	age: integer('age'),
	username: text('username').notNull().unique(),
	passwordHash: text('password_hash').notNull()
});

export const session = pgTable('session', {
	id: text('id').primaryKey(),
	userId: text('user_id')
		.notNull()
		.references(() => user.id),
	expiresAt: timestamp('expires_at', { withTimezone: true, mode: 'date' }).notNull()
});

export type Session = typeof session.$inferSelect;
export type User = typeof user.$inferSelect;

export const Event = {
	id: serial('id').primaryKey(),
	title: varchar('title', { length: 255 }).notNull(),
	slug: varchar('slug', { length: 255 }),
	authorId: integer('author_id'),
	description: varchar('description', { length: 255 }),
	content: text('content'),
	region: varchar('region', { length: 255 }).notNull(),
	thumbnail: varchar('thumbnail'),
	featured_image: varchar('featured_image'),
	startAt: date('start_at'), // Use `timestamp` if storing as datetime
	endAt: varchar('end_at', { length: 255 }), // Use `timestamp` if storing as datetime
	createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
	updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow().notNull()
};

const Article = {
	id: serial('id').primaryKey(),
	title: varchar('title', { length: 255 }), // Adjust length as needed
	slug: varchar('slug', { length: 255 }),
	authorId: integer('author_id'),
	description: varchar('description', { length: 255 }),
	content: text('content'),
	thumbnail: text('thumbnail'),
	featured_image: varchar('featured_image', { length: 255 }),
	date: varchar('date', { length: 255 }), // Adjust length as needed
	createdAt: timestamp('created_at').defaultNow(),
	updatedAt: timestamp('updated_at').defaultNow()
};

export const youthEvents = pgTable('youth_events', Event);
export const childrensEvents = pgTable('childrens_events', Event);
export const bibleEducationEvents = pgTable('bible_education_events', Event);
export const gospelEvents = pgTable('gospel_events', Event);
export const musicEvents = pgTable('music_events', Event);
export const familyEvents = pgTable('family_events', Event);
export const generalEvents = pgTable('general_events', {
	...Event,
	comment: varchar('comment', { length: 255 })
});

// eventSchemas exist for locations where all events are displayed.
export const eventSchemas = [youthEvents, childrensEvents, bibleEducationEvents, generalEvents, gospelEvents, musicEvents, familyEvents];
export const youthNewsArticles = pgTable('youth_news_articles', Article);
export const childrensNewsArticles = pgTable('childrens_news_articles', Article);
export const newsArticles = pgTable('news_articles', Article);

export const childrensFiles = pgTable('childrens_files', {
	id: serial('id').primaryKey(),
	name: varchar('name', { length: 255 }),
	path: varchar('path', { length: 255 }),
	category: varchar('category', { length: 255 }),
	size: varchar('size', { length: 255 }),
	createdAt: timestamp('created_at').defaultNow(),
	updatedAt: timestamp('updated_at').defaultNow()
});

export const churches = pgTable('churches', {
	id: serial('id').primaryKey(),
	state: varchar('state', { length: 255 }),
	city: varchar('city', { length: 255 }),
	name_line_1: varchar('name_line_1', { length: 255 }),
	name_line_2: varchar('name_line_2', { length: 255 }),
	region: varchar('region', { length: 255 }),
	address_line_1: varchar('address_line_1', { length: 255 }),
	address_line_2: varchar('address_line_2', { length: 255 }),
	contact_first_name: varchar('contact_first_name', { length: 255 }),
	contact_last_name: varchar('contact_last_name', { length: 255 }),
	phone: varchar('phone', { length: 255 }),
	youtube: varchar('youtube', { length: 255 }),
	createdAt: timestamp('created_at').defaultNow(),
	updatedAt: timestamp('updated_at').defaultNow()
});
