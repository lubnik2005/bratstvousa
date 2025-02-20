import {
	pgTable,
	serial,
	text,
	integer,
	timestamp,
	varchar,
	date,
	json,
	jsonb
} from 'drizzle-orm/pg-core';

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
	featuredImage: varchar('featured_image'),
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
	featuredImage: varchar('featured_image', { length: 255 }),
	date: date('date'), // Adjust length as needed
	createdAt: timestamp('created_at').defaultNow(),
	updatedAt: timestamp('updated_at').defaultNow()
};

export const formSubmissions = pgTable('form_submissions', {
	id: serial('id').primaryKey(),
	formName: varchar('form_name', { length: 255 }),
	email: varchar('email', { length: 255 }),
	phone: varchar('phone', { length: 255 }),
	firstName: varchar('first_name', { length: 255 }),
	lastName: varchar('last_name', { length: 255 }),
	middleName: varchar('middle_name', { length: 255 }),
	dateOfBirth: date('date_of_birth'),
	churchId: integer('church_id'),
	content: jsonb('content'),
	createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
	updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow().notNull()
});


export type FormSubmission = typeof formSubmissions.$inferSelect;


export const medias = pgTable('media', {
	id: serial('id').primaryKey(),
	modelType: varchar('model_type', { length: 255 }).notNull(),
	modelId: integer('model_id').notNull(),
	uuid: varchar('uuid', { length: 255 }).notNull(),
	collectionName: varchar('collection_name', { length: 255 }).notNull(),
	name: varchar('name', { length: 255 }).notNull(),
	fileName: varchar('file_name', { length: 255 }).notNull(),
	mimeType: varchar('mime_type', { length: 255 }).notNull(),
	disk: varchar('disk', { length: 255 }).notNull(),
	conversionsDisk: varchar('conversions_disk', { length: 255 }).notNull(),
	size: integer('size').notNull(),
	manipulations: json('manipulations').notNull(),
	customProperties: json('custom_properties').notNull(),
	generatedConversions: json('generated_conversions').notNull(),
	responsiveImages: json('responsive_images').notNull(),
	orderColumn: integer('order_column'),
	createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
	updatedAt: timestamp('updated_at', { withTimezone: true }).notNull().defaultNow()
});

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
export const eventSchemas = [
	youthEvents,
	childrensEvents,
	bibleEducationEvents,
	generalEvents,
	gospelEvents,
	musicEvents,
	familyEvents
];
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
	updatedAt: timestamp('updated_at').defaultNow(),
	longitude: varchar('longitude'),
	latitude: varchar('latitude')
});
