CREATE TABLE `email_log` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`to_email` text NOT NULL,
	`subject` text NOT NULL,
	`html` text NOT NULL,
	`status` text DEFAULT 'failed' NOT NULL,
	`attempts` integer DEFAULT 0 NOT NULL,
	`last_error` text,
	`created_at` text DEFAULT (datetime('now')) NOT NULL,
	`updated_at` text DEFAULT (datetime('now')) NOT NULL
);
--> statement-breakpoint
CREATE TABLE `paradise_cots` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`room_id` integer NOT NULL,
	`description` text,
	`created_at` text DEFAULT (datetime('now')) NOT NULL,
	`updated_at` text DEFAULT (datetime('now')) NOT NULL
);
--> statement-breakpoint
CREATE TABLE `paradise_event_rooms` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`event_id` integer NOT NULL,
	`room_id` integer NOT NULL,
	`price` integer DEFAULT 0 NOT NULL,
	`created_at` text DEFAULT (datetime('now')) NOT NULL,
	`updated_at` text DEFAULT (datetime('now')) NOT NULL
);
--> statement-breakpoint
CREATE TABLE `paradise_events` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`name` text NOT NULL,
	`status` text DEFAULT 'draft' NOT NULL,
	`start_on` text,
	`end_on` text,
	`registration_start_at` text,
	`registration_end_at` text,
	`refund_percentage` integer DEFAULT 0 NOT NULL,
	`refunds_available_until` text,
	`description` text,
	`created_at` text DEFAULT (datetime('now')) NOT NULL,
	`updated_at` text DEFAULT (datetime('now')) NOT NULL
);
--> statement-breakpoint
CREATE TABLE `paradise_form_answers` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`form_id` integer NOT NULL,
	`event_id` integer NOT NULL,
	`reservation_id` integer,
	`email` text,
	`answers` text,
	`signed_on` text,
	`created_at` text DEFAULT (datetime('now')) NOT NULL,
	`updated_at` text DEFAULT (datetime('now')) NOT NULL
);
--> statement-breakpoint
CREATE TABLE `paradise_forms` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`name` text NOT NULL,
	`required` integer DEFAULT true NOT NULL,
	`questions` text,
	`created_at` text DEFAULT (datetime('now')) NOT NULL,
	`updated_at` text DEFAULT (datetime('now')) NOT NULL
);
--> statement-breakpoint
CREATE TABLE `paradise_reservations` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`event_id` integer NOT NULL,
	`room_id` integer NOT NULL,
	`cot_id` integer NOT NULL,
	`first_name` text NOT NULL,
	`last_name` text NOT NULL,
	`email` text NOT NULL,
	`sex` text NOT NULL,
	`status` text DEFAULT 'held' NOT NULL,
	`held_until` text,
	`price` integer DEFAULT 0 NOT NULL,
	`confirmation_code` text,
	`stripe_payment_intent` text,
	`paid_at` text,
	`deleted_at` text,
	`created_at` text DEFAULT (datetime('now')) NOT NULL,
	`updated_at` text DEFAULT (datetime('now')) NOT NULL
);
--> statement-breakpoint
CREATE TABLE `paradise_rooms` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`name` text NOT NULL,
	`sex` text DEFAULT 'c' NOT NULL,
	`size` integer DEFAULT 0 NOT NULL,
	`location` text,
	`type` text DEFAULT 'cabin' NOT NULL,
	`deleted_at` text,
	`created_at` text DEFAULT (datetime('now')) NOT NULL,
	`updated_at` text DEFAULT (datetime('now')) NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `paradise_reservations_event_cot_active_unique` ON `paradise_reservations` (`event_id`,`cot_id`) WHERE status != 'cancelled';