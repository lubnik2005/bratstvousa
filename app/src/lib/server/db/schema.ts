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
//
// Payment model (Zeffy cash-at-check-in integration):
//   paymentMethod: ONLINE | CASH | WAIVED | OTHER | null  (method, not state)
//   paymentStatus: PENDING | DUE | PAID | REVIEW_REQUIRED | REFUNDED | CANCELED
//     (legacy rows may still hold 'unpaid'/'paid' until backfilled)
// A $0 Zeffy checkout does NOT imply free admission — cashEligible (derived from
// cash_eligibility_rules at registration time) is authoritative. See spec §2/§6.
// approvalToken is used in the approve-link emailed to the responsible leader.
export const campRegistrations = sqliteTable('camp_registrations', {
	id: integer('id').primaryKey({ autoIncrement: true }),
	eventSlug: text('event_slug').notNull(),
	firstName: text('first_name').notNull(),
	lastName: text('last_name').notNull(),
	// Free-text church label kept for display/back-compat. churchId is the real
	// FK captured at registration and used for cash eligibility (free-typed
	// "other" churches have churchId = null => never cash-eligible).
	church: text('church'),
	churchId: integer('church_id').references(() => churches.id),
	email: text('email'),
	phone: text('phone'),
	leaderId: integer('leader_id').references(() => youthLeaders.id),
	status: text('status').default('pending_payment').notNull(),
	paymentStatus: text('payment_status').default('unpaid').notNull(),
	// Whether this registrant is authorized to pay cash at check-in (a $0 Zeffy
	// checkout). Set at registration from cash_eligibility_rules; never inferred
	// from the Zeffy amount, discount code, or church name (spec §6/§22).
	cashEligible: integer('cash_eligible', { mode: 'boolean' }).default(false).notNull(),
	// Legitimately free admission (staff/scholarship/comp) — distinct from cash.
	feeWaived: integer('fee_waived', { mode: 'boolean' }).default(false).notNull(),
	paymentMethod: text('payment_method'),
	// Legacy dollar amount (kept for back-compat). New logic uses *_cents.
	amount: integer('amount'),
	// Price snapshot at registration (integer cents) so later price changes don't
	// move an existing attendee's balance (spec §26).
	eventPriceCents: integer('event_price_cents'),
	amountDueCents: integer('amount_due_cents'),
	amountPaidCents: integer('amount_paid_cents').default(0).notNull(),
	stripeSessionId: text('stripe_session_id'),
	// Human-readable registration code (e.g. "CAMP-7K3QF"), generated at
	// submission. Given to the registrant to enter in Zeffy so payments can be
	// reconciled back to a registration later.
	confirmationCode: text('confirmation_code'),
	approvalToken: text('approval_token'),
	approvedBy: text('approved_by'),
	approvedAt: text('approved_at'),
	// Zeffy payment reconciliation. zeffyPaymentId links the paid Zeffy payment
	// (idempotency); paidAt is when payment_status flipped to 'paid'/'due'.
	zeffyPaymentId: text('zeffy_payment_id'),
	zeffyTicketId: text('zeffy_ticket_id'),
	zeffyContactId: text('zeffy_contact_id'),
	zeffyCampaignId: text('zeffy_campaign_id'),
	// Discount code seen on the Zeffy payload (if provided) — reference/validation
	// signal only, never proof of eligibility.
	zeffyDiscountCode: text('zeffy_discount_code'),
	paidAt: text('paid_at'),
	// Staff member who collected cash (spec §18 audit trail).
	paidBy: text('paid_by'),
	// Check-in state — kept separate from payment state (spec §13).
	checkinStatus: text('checkin_status').default('NOT_CHECKED_IN').notNull(),
	checkedInAt: text('checked_in_at'),
	checkedInBy: text('checked_in_by'),
	createdAt: text('created_at')
		.default(sql`(datetime('now'))`)
		.notNull(),
	updatedAt: text('updated_at')
		.default(sql`(datetime('now'))`)
		.notNull()
});

export type CampRegistration = typeof campRegistrations.$inferSelect;

// Cash eligibility rules: authoritative source deciding whether a group may pay
// cash at check-in (a $0 Zeffy checkout via a shared discount code). Keyed on
// (churchId, eventSlug). amountCents is the price for that eligible group;
// discountCode is the shared Zeffy code (informational + opportunistic
// validation). One row per church per event; a shared code = multiple rows with
// the same discountCode. See spec §6/§8.
export const cashEligibilityRules = sqliteTable('cash_eligibility_rules', {
	id: integer('id').primaryKey({ autoIncrement: true }),
	// 'church' today; room for 'leader'/'event' scopes later.
	scopeType: text('scope_type').default('church').notNull(),
	churchId: integer('church_id').references(() => churches.id),
	eventSlug: text('event_slug'),
	amountCents: integer('amount_cents').notNull(),
	discountCode: text('discount_code'),
	active: integer('active', { mode: 'boolean' }).default(true).notNull(),
	createdAt: text('created_at')
		.default(sql`(datetime('now'))`)
		.notNull(),
	updatedAt: text('updated_at')
		.default(sql`(datetime('now'))`)
		.notNull()
});

export type CashEligibilityRule = typeof cashEligibilityRules.$inferSelect;

// Append-only audit trail for registration lifecycle events, especially cash
// collection (which can't be reconciled against a processor). See spec §18.
// event: 'cash_payment_collected' | 'checked_in' | 'zeffy_webhook_applied'
//        | 'unauthorized_zero_dollar' | 'payment_refunded' | ...
export const registrationEvents = sqliteTable('registration_events', {
	id: integer('id').primaryKey({ autoIncrement: true }),
	registrationId: integer('registration_id').notNull(),
	event: text('event').notNull(),
	amountCents: integer('amount_cents'),
	staffUser: text('staff_user'),
	payload: text('payload', { mode: 'json' }),
	createdAt: text('created_at')
		.default(sql`(datetime('now'))`)
		.notNull()
});

export type RegistrationEvent = typeof registrationEvents.$inferSelect;

// All Zeffy payments seen (via webhook or the hourly API reconciliation job),
// keyed by zeffyPaymentId for idempotency across both paths.
// matchStatus: matched | unmatched | refunded.
export const zeffyPayments = sqliteTable('zeffy_payments', {
	id: integer('id').primaryKey({ autoIncrement: true }),
	zeffyPaymentId: text('zeffy_payment_id').notNull().unique(),
	status: text('status'),
	amount: integer('amount'),
	currency: text('currency'),
	buyerEmail: text('buyer_email'),
	buyerFirstName: text('buyer_first_name'),
	buyerLastName: text('buyer_last_name'),
	confirmationCode: text('confirmation_code'),
	matchedRegistrationId: integer('matched_registration_id'),
	matchStatus: text('match_status').default('unmatched').notNull(),
	rawJson: text('raw_json'),
	createdAt: text('created_at')
		.default(sql`(datetime('now'))`)
		.notNull(),
	updatedAt: text('updated_at')
		.default(sql`(datetime('now'))`)
		.notNull()
});

export type ZeffyPayment = typeof zeffyPayments.$inferSelect;

// Webhook idempotency log: one row per Zeffy event id (stable across retries).
export const zeffyEvents = sqliteTable('zeffy_events', {
	id: integer('id').primaryKey({ autoIncrement: true }),
	eventId: text('event_id').notNull().unique(),
	type: text('type'),
	receivedAt: text('received_at')
		.default(sql`(datetime('now'))`)
		.notNull(),
	processed: integer('processed', { mode: 'boolean' }).default(false).notNull()
});

export type ZeffyEvent = typeof zeffyEvents.$inferSelect;

// Log of every outbound email attempt (from both the SvelteKit app and the
// Laravel admin). The Laravel hourly scheduler retries rows with status
// 'failed' (up to a max attempt count) so transient Resend failures / free-tier
// rate limits don't silently drop mail. status: sent | failed.
export const emailLog = sqliteTable('email_log', {
	id: integer('id').primaryKey({ autoIncrement: true }),
	toEmail: text('to_email').notNull(),
	subject: text('subject').notNull(),
	html: text('html').notNull(),
	status: text('status').default('failed').notNull(),
	attempts: integer('attempts').default(0).notNull(),
	lastError: text('last_error'),
	createdAt: text('created_at')
		.default(sql`(datetime('now'))`)
		.notNull(),
	updatedAt: text('updated_at')
		.default(sql`(datetime('now'))`)
		.notNull()
});

export type EmailLog = typeof emailLog.$inferSelect;
