CREATE TABLE `zeffy_events` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`event_id` text NOT NULL,
	`type` text,
	`received_at` text DEFAULT (datetime('now')) NOT NULL,
	`processed` integer DEFAULT false NOT NULL
);
--> statement-breakpoint
CREATE TABLE `zeffy_payments` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`zeffy_payment_id` text NOT NULL,
	`status` text,
	`amount` integer,
	`currency` text,
	`buyer_email` text,
	`buyer_first_name` text,
	`buyer_last_name` text,
	`confirmation_code` text,
	`matched_registration_id` integer,
	`match_status` text DEFAULT 'unmatched' NOT NULL,
	`raw_json` text,
	`created_at` text DEFAULT (datetime('now')) NOT NULL,
	`updated_at` text DEFAULT (datetime('now')) NOT NULL
);
--> statement-breakpoint
ALTER TABLE `camp_registrations` ADD `zeffy_payment_id` text;--> statement-breakpoint
ALTER TABLE `camp_registrations` ADD `paid_at` text;--> statement-breakpoint
CREATE UNIQUE INDEX `zeffy_events_event_id_unique` ON `zeffy_events` (`event_id`);--> statement-breakpoint
CREATE UNIQUE INDEX `zeffy_payments_zeffy_payment_id_unique` ON `zeffy_payments` (`zeffy_payment_id`);