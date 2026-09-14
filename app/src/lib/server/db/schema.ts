import { sqliteTable, text, integer } from 'drizzle-orm/sqlite-core';
import { sql } from 'drizzle-orm';

export const user = sqliteTable('user', {
	id: text('id').primaryKey(),
	age: integer('age'),
	username: text('username').notNull().unique(),
	passwordHash: text('password_hash').notNull()
});

export const session = sqliteTable('session', {
	id: text('id').primaryKey(),
	userId: text('user_id')
		.notNull()
		.references(() => user.id),
	expiresAt: integer('expires_at', { mode: 'timestamp' }).notNull()
});

export type Session = typeof session.$inferSelect;
export type User = typeof user.$inferSelect;

const Event = {
	id: integer('id').primaryKey({ autoIncrement: true }),
	title: text('title').notNull(),
	slug: text('slug'),
	authorId: integer('author_id'),
	description: text('description'),
	content: text('content'),
	use_editorjs: text('use_editorjs', { mode: 'json' }),
	editorjs: text('editorjs', { mode: 'json' }),
	region: text('region').notNull(),
	thumbnail: text('thumbnail'),
	featuredImage: text('featured_image'),
	startAt: text('start_at'),
	endAt: text('end_at'),
	createdAt: text('created_at')
		.default(sql`(datetime('now'))`)
		.notNull(),
	updatedAt: text('updated_at')
		.default(sql`(datetime('now'))`)
		.notNull()
};

export const Article = {
	id: integer('id').primaryKey({ autoIncrement: true }),
	title: text('title'),
	slug: text('slug'),
	authorId: integer('author_id'),
	description: text('description'),
	content: text('content'),
	thumbnail: text('thumbnail'),
	featuredImage: text('featured_image'),
	date: text('date'),
	use_editorjs: text('use_editorjs', { mode: 'json' }),
	editorjs: text('editorjs', { mode: 'json' }),
	createdAt: text('created_at').default(sql`(datetime('now'))`),
	updatedAt: text('updated_at').default(sql`(datetime('now'))`)
};

export const formSubmissions = sqliteTable('form_submissions', {
	id: integer('id').primaryKey({ autoIncrement: true }),
	formName: text('form_name'),
	email: text('email'),
	phone: text('phone'),
	firstName: text('first_name'),
	lastName: text('last_name'),
	middleName: text('middle_name'),
	dateOfBirth: text('date_of_birth'),
	churchId: integer('church_id'),
	content: text('content', { mode: 'json' }),
	createdAt: text('created_at')
		.default(sql`(datetime('now'))`)
		.notNull(),
	updatedAt: text('updated_at')
		.default(sql`(datetime('now'))`)
		.notNull()
});

export type FormSubmission = typeof formSubmissions.$inferSelect;

export const settings = sqliteTable('settings', {
	id: integer('id').primaryKey({ autoIncrement: true }),
	group: text('group'),
	name: text('name'),
	payload: text('payload'),
	locked: integer('locked', { mode: 'boolean' }),
	// Nullable timestamps: the Laravel Nova admin (spatie/laravel-settings)
	// reads/writes this same table and expects created_at/updated_at columns.
	// Kept nullable so ALTER TABLE ADD COLUMN succeeds on existing D1 rows.
	createdAt: text('created_at'),
	updatedAt: text('updated_at')
});

export const medias = sqliteTable('media', {
	id: integer('id').primaryKey({ autoIncrement: true }),
	modelType: text('model_type').notNull(),
	modelId: integer('model_id').notNull(),
	uuid: text('uuid').notNull(),
	collectionName: text('collection_name').notNull(),
	name: text('name').notNull(),
	fileName: text('file_name').notNull(),
	mimeType: text('mime_type').notNull(),
	disk: text('disk').notNull(),
	conversionsDisk: text('conversions_disk').notNull(),
	size: integer('size').notNull(),
	manipulations: text('manipulations', { mode: 'json' }).notNull(),
	customProperties: text('custom_properties', { mode: 'json' }).notNull(),
	generatedConversions: text('generated_conversions', { mode: 'json' }).notNull(),
	responsiveImages: text('responsive_images', { mode: 'json' }).notNull(),
	orderColumn: integer('order_column'),
	createdAt: text('created_at')
		.default(sql`(datetime('now'))`)
		.notNull(),
	updatedAt: text('updated_at')
		.default(sql`(datetime('now'))`)
		.notNull()
});

export const youthEvents = sqliteTable('youth_events', Event);
export const childrensEvents = sqliteTable('childrens_events', Event);
export const bibleEducationEvents = sqliteTable('bible_education_events', {
	...Event,
	category: text('category')
});
export const gospelEvents = sqliteTable('gospel_events', Event);
export const musicEvents = sqliteTable('music_events', Event);
export const familyEvents = sqliteTable('family_events', Event);
export const generalEvents = sqliteTable('general_events', {
	...Event,
	comment: text('comment')
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

export const youthNewsArticles = sqliteTable('youth_news_articles', Article);
export const childrensNewsArticles = sqliteTable('childrens_news_articles', Article);
export const familyNewsArticles = sqliteTable('family_news_articles', Article);
export const bibleEducationNewsArticles = sqliteTable('bible_education_news_articles', Article);
export const musicNewsArticles = sqliteTable('music_news_articles', Article);
export const newsArticles = sqliteTable('news_articles', Article);

export const newsArticleSchemas = [
	newsArticles,
	youthNewsArticles,
	familyNewsArticles,
	bibleEducationNewsArticles,
	musicNewsArticles,
	childrensNewsArticles
];

export const childrensFiles = sqliteTable('childrens_files', {
	id: integer('id').primaryKey({ autoIncrement: true }),
	name: text('name'),
	path: text('path'),
	category: text('category'),
	size: text('size'),
	createdAt: text('created_at').default(sql`(datetime('now'))`),
	updatedAt: text('updated_at').default(sql`(datetime('now'))`)
});

export const churches = sqliteTable('churches', {
	id: integer('id').primaryKey({ autoIncrement: true }),
	state: text('state'),
	city: text('city'),
	name_line_1: text('name_line_1'),
	name_line_2: text('name_line_2'),
	region: text('region'),
	address_line_1: text('address_line_1'),
	address_line_2: text('address_line_2'),
	contact_first_name: text('contact_first_name'),
	contact_last_name: text('contact_last_name'),
	phone: text('phone'),
	youtube: text('youtube'),
	website: text('website'),
	flickr: text('flickr'),
	createdAt: text('created_at').default(sql`(datetime('now'))`),
	updatedAt: text('updated_at').default(sql`(datetime('now'))`),
	longitude: text('longitude'),
	latitude: text('latitude')
});

// Youth camp registration system.
// Youth leaders who approve camp registrations. Populated from a list the
// admin provides; each leader gets a scoped Nova account to approve their own.
export const youthLeaders = sqliteTable('youth_leaders', {
	id: integer('id').primaryKey({ autoIncrement: true }),
	name: text('name').notNull(),
	email: text('email'),
	// Contact phone. Server-side only — never exposed to the public.
	phone: text('phone'),
	// City / location label (e.g. "Vancouver: Hazel Dell"). Name + city may be
	// shown publicly; phone + email must stay server-side.
	city: text('city'),
	region: text('region'),
	churchId: integer('church_id'),
	active: integer('active', { mode: 'boolean' }).default(true).notNull(),
	createdAt: text('created_at')
		.default(sql`(datetime('now'))`)
		.notNull(),
	updatedAt: text('updated_at')
		.default(sql`(datetime('now'))`)
		.notNull()
});

export type YouthLeader = typeof youthLeaders.$inferSelect;

// Camp registrations. status flow:
//   pending_payment -> awaiting_approval -> approved | rejected
// paymentStatus: unpaid | paid (from Stripe). approvalToken used in the
// approve-link emailed to the responsible leader.
export const campRegistrations = sqliteTable('camp_registrations', {
	id: integer('id').primaryKey({ autoIncrement: true }),
	eventSlug: text('event_slug').notNull(),
	firstName: text('first_name').notNull(),
	lastName: text('last_name').notNull(),
	church: text('church'),
	email: text('email'),
	phone: text('phone'),
	leaderId: integer('leader_id').references(() => youthLeaders.id),
	status: text('status').default('pending_payment').notNull(),
	paymentStatus: text('payment_status').default('unpaid').notNull(),
	amount: integer('amount'),
	stripeSessionId: text('stripe_session_id'),
	// Human-readable registration code (e.g. "CAMP-7K3QF"), generated at
	// submission. Given to the registrant to enter in Zeffy so payments can be
	// reconciled back to a registration later.
	confirmationCode: text('confirmation_code'),
	approvalToken: text('approval_token'),
	approvedBy: text('approved_by'),
	approvedAt: text('approved_at'),
	createdAt: text('created_at')
		.default(sql`(datetime('now'))`)
		.notNull(),
	updatedAt: text('updated_at')
		.default(sql`(datetime('now'))`)
		.notNull()
});

export type CampRegistration = typeof campRegistrations.$inferSelect;
