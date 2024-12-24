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

export const youthEvents = pgTable('youth_events', {
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
	createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull()
	// updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow().notNull().onUpdateNow()
});

export const youthNewsArticles = pgTable('youth_news_articles', {
	id: serial('id').primaryKey(),
	title: varchar('title', { length: 255 }), // Adjust length as needed
	slug: varchar('slug', { length: 255 }),
	authorId: integer('author_id'),
	description: varchar('description', { length: 255 }),
	content: text('content'),
	thumbnail: text('thumbnail'),
	date: varchar('date', { length: 255 }), // Adjust length as needed
	createdAt: timestamp('created_at').defaultNow(),
	updatedAt: timestamp('updated_at').defaultNow()
});

export const childrensEvents = pgTable('childrens_events', {
	id: serial('id').primaryKey(),
	title: varchar('title', { length: 255 }).notNull(),
	slug: varchar('slug', { length: 255 }),
	authorId: integer('author_id'),
	description: varchar('description', { length: 255 }),
	content: text('content'),
	thumbnail: text('thumbnail'),
	startAt: date('start_at'), // Use `timestamp` if storing as datetime
	endAt: varchar('end_at', { length: 255 }), // Use `timestamp` if storing as datetime
	createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
	// updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow().notNull().onUpdateNow()
});

export const bibleEducationEvents = pgTable('bible_education_events', {
	id: serial('id').primaryKey(),
	title: varchar('title', { length: 255 }).notNull(),
	slug: varchar('slug', { length: 255 }),
	authorId: integer('author_id'),
	description: varchar('description', { length: 255 }),
	content: text('content'),
	thumbnail: text('thumbnail'),
	startAt: date('start_at'), // Use `timestamp` if storing as datetime
	endAt: varchar('end_at', { length: 255 }), // Use `timestamp` if storing as datetime
	createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
	updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow().notNull()//.onUpdateNow()
});



export const childrensNewsArticles = pgTable('childrens_news_articles', {
	id: serial('id').primaryKey(),
	title: varchar('title', { length: 255 }), // Adjust length as needed
	slug: varchar('slug', { length: 255 }),
	authorId: integer('author_id'),
	description: varchar('description', { length: 255 }),
	content: text('content'),
	thumbnail: text('thumbnail'),
	date: varchar('date', { length: 255 }), // Adjust length as needed
	createdAt: timestamp('created_at').defaultNow(),
	updatedAt: timestamp('updated_at').defaultNow()
});

export const newsArticles = pgTable('news_articles', {
	id: serial('id').primaryKey(),
	title: varchar('title', { length: 255 }),
	slug: varchar('slug', { length: 255 }),
	featured_image: varchar('featured_image', { length: 255 }),
	thumbnail: varchar('thumbnail', { length: 255 }),
	authorId: integer('author_id'),
	description: varchar('description', { length: 255 }),
	content: text('content'),
	date: date('date'), // Correct type for storing dates
	createdAt: timestamp('created_at').defaultNow(),
	updatedAt: timestamp('updated_at').defaultNow()
});

export const childrensFiles = pgTable('childrens_files', {
	id: serial('id').primaryKey(),
	name: varchar('name', { length: 255 }),
	path: varchar('path', { length: 255 }),
	category: varchar('category', { length: 255 }),
	size: varchar('size', { length: 255 }),
	createdAt: timestamp('created_at').defaultNow(),
	updatedAt: timestamp('updated_at').defaultNow()
});
