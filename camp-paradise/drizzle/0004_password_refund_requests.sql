ALTER TABLE `paradise_attendees` ADD `password_hash` text;
--> statement-breakpoint
CREATE TABLE `paradise_refund_requests` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`attendee_id` integer,
	`email` text NOT NULL,
	`amount_cents` integer,
	`balance_cents` integer DEFAULT 0 NOT NULL,
	`note` text,
	`status` text DEFAULT 'open' NOT NULL,
	`created_at` text DEFAULT (datetime('now')) NOT NULL,
	`updated_at` text DEFAULT (datetime('now')) NOT NULL
);
