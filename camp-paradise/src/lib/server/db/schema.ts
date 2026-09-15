import { sqliteTable, text, integer, uniqueIndex } from 'drizzle-orm/sqlite-core';
import { sql } from 'drizzle-orm';

const timestamps = {
	createdAt: text('created_at')
		.default(sql`(datetime('now'))`)
		.notNull(),
	updatedAt: text('updated_at')
		.default(sql`(datetime('now'))`)
		.notNull()
};

// A camp session/event (e.g. "Summer Camp 2026").
export const paradiseEvents = sqliteTable('paradise_events', {
	id: integer('id').primaryKey({ autoIncrement: true }),
	name: text('name').notNull(),
	status: text('status').default('draft').notNull(), // draft | published
	startOn: text('start_on'),
	endOn: text('end_on'),
	registrationStartAt: text('registration_start_at'),
	registrationEndAt: text('registration_end_at'),
	refundPercentage: integer('refund_percentage').default(0).notNull(),
	refundsAvailableUntil: text('refunds_available_until'),
	description: text('description'),
	...timestamps
});

// A physical room/building. sex: m | f | c (c = either/coed).
export const paradiseRooms = sqliteTable('paradise_rooms', {
	id: integer('id').primaryKey({ autoIncrement: true }),
	name: text('name').notNull(),
	sex: text('sex').default('c').notNull(),
	size: integer('size').default(0).notNull(),
	location: text('location'),
	type: text('type').default('cabin').notNull(), // cabin | dorm | vip
	deletedAt: text('deleted_at'),
	...timestamps
});

// Per-event price for a room (pivot). A room is offered in an event via this row.
export const paradiseEventRooms = sqliteTable('paradise_event_rooms', {
	id: integer('id').primaryKey({ autoIncrement: true }),
	eventId: integer('event_id').notNull(),
	roomId: integer('room_id').notNull(),
	price: integer('price').default(0).notNull(),
	...timestamps
});

// An individual bed within a room.
export const paradiseCots = sqliteTable('paradise_cots', {
	id: integer('id').primaryKey({ autoIncrement: true }),
	roomId: integer('room_id').notNull(),
	description: text('description'),
	...timestamps
});

// A waiver/consent form with a JSON list of questions.
export const paradiseForms = sqliteTable('paradise_forms', {
	id: integer('id').primaryKey({ autoIncrement: true }),
	name: text('name').notNull(),
	required: integer('required', { mode: 'boolean' }).default(true).notNull(),
	questions: text('questions', { mode: 'json' }),
	...timestamps
});

// A booking of a single bed for a single attendee (anonymous, identified by email).
export const paradiseReservations = sqliteTable(
	'paradise_reservations',
	{
		id: integer('id').primaryKey({ autoIncrement: true }),
		eventId: integer('event_id').notNull(),
		roomId: integer('room_id').notNull(),
		cotId: integer('cot_id').notNull(),
		firstName: text('first_name').notNull(),
		lastName: text('last_name').notNull(),
		email: text('email').notNull(),
		sex: text('sex').notNull(), // m | f
		status: text('status').default('held').notNull(), // held | confirmed | cancelled | refunded
		heldUntil: text('held_until'),
		price: integer('price').default(0).notNull(),
		confirmationCode: text('confirmation_code'),
		stripePaymentIntent: text('stripe_payment_intent'),
		paidAt: text('paid_at'),
		deletedAt: text('deleted_at'),
		...timestamps
	},
	(table) => ({
		// Safety net: at most one non-cancelled reservation per bed per event.
		uniqueBed: uniqueIndex('paradise_reservations_event_cot_active_unique')
			.on(table.eventId, table.cotId)
			.where(sql`status != 'cancelled'`)
	})
);

// An attendee's answers to a form for an event (linked by reservation or email).
export const paradiseFormAnswers = sqliteTable('paradise_form_answers', {
	id: integer('id').primaryKey({ autoIncrement: true }),
	formId: integer('form_id').notNull(),
	eventId: integer('event_id').notNull(),
	reservationId: integer('reservation_id'),
	email: text('email'),
	answers: text('answers', { mode: 'json' }),
	signedOn: text('signed_on'),
	...timestamps
});

// Outbound email audit log (mirrors bratstvousa; enables retry).
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

export type ParadiseEvent = typeof paradiseEvents.$inferSelect;
export type ParadiseRoom = typeof paradiseRooms.$inferSelect;
export type ParadiseEventRoom = typeof paradiseEventRooms.$inferSelect;
export type ParadiseCot = typeof paradiseCots.$inferSelect;
export type ParadiseForm = typeof paradiseForms.$inferSelect;
export type ParadiseReservation = typeof paradiseReservations.$inferSelect;
export type ParadiseFormAnswer = typeof paradiseFormAnswers.$inferSelect;
export type EmailLog = typeof emailLog.$inferSelect;
