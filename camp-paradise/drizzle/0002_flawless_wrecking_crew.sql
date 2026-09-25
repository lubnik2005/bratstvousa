CREATE TABLE `paradise_tickets` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`event_id` integer NOT NULL,
	`email` text NOT NULL,
	`attendee_id` integer,
	`zeffy_payment_id` text NOT NULL,
	`zeffy_item_id` text NOT NULL,
	`rate_title` text,
	`amount_cents` integer DEFAULT 0 NOT NULL,
	`status` text DEFAULT 'available' NOT NULL,
	`reservation_id` integer,
	`used_at` text,
	`created_at` text DEFAULT (datetime('now')) NOT NULL,
	`updated_at` text DEFAULT (datetime('now')) NOT NULL
);
--> statement-breakpoint
CREATE TABLE `paradise_zeffy_events` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`event_id` text NOT NULL,
	`type` text NOT NULL,
	`processed` integer DEFAULT false NOT NULL,
	`created_at` text DEFAULT (datetime('now')) NOT NULL
);
--> statement-breakpoint
CREATE TABLE `paradise_zeffy_payments` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`zeffy_payment_id` text NOT NULL,
	`status` text NOT NULL,
	`amount` integer DEFAULT 0 NOT NULL,
	`currency` text DEFAULT 'usd' NOT NULL,
	`buyer_email` text,
	`buyer_first_name` text,
	`buyer_last_name` text,
	`campaign_id` text,
	`contact_id` text,
	`event_id` integer,
	`match_status` text DEFAULT 'unmatched' NOT NULL,
	`tickets_granted` integer DEFAULT 0 NOT NULL,
	`raw_json` text,
	`created_at` text DEFAULT (datetime('now')) NOT NULL,
	`updated_at` text DEFAULT (datetime('now')) NOT NULL
);
--> statement-breakpoint
ALTER TABLE `paradise_events` ADD `zeffy_campaign_id` text;--> statement-breakpoint
ALTER TABLE `paradise_events` ADD `zeffy_ticketing_url` text;--> statement-breakpoint
ALTER TABLE `paradise_reservations` ADD `ticket_id` integer;--> statement-breakpoint
CREATE UNIQUE INDEX `paradise_tickets_zeffy_item_id_unique` ON `paradise_tickets` (`zeffy_item_id`);--> statement-breakpoint
CREATE UNIQUE INDEX `paradise_zeffy_events_event_id_unique` ON `paradise_zeffy_events` (`event_id`);--> statement-breakpoint
CREATE UNIQUE INDEX `paradise_zeffy_payments_zeffy_payment_id_unique` ON `paradise_zeffy_payments` (`zeffy_payment_id`);