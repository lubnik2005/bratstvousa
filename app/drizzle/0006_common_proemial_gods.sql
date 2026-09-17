CREATE TABLE `cash_eligibility_rules` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`scope_type` text DEFAULT 'church' NOT NULL,
	`church_id` integer,
	`event_slug` text,
	`amount_cents` integer NOT NULL,
	`discount_code` text,
	`active` integer DEFAULT true NOT NULL,
	`created_at` text DEFAULT (datetime('now')) NOT NULL,
	`updated_at` text DEFAULT (datetime('now')) NOT NULL,
	FOREIGN KEY (`church_id`) REFERENCES `churches`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `registration_events` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`registration_id` integer NOT NULL,
	`event` text NOT NULL,
	`amount_cents` integer,
	`staff_user` text,
	`payload` text,
	`created_at` text DEFAULT (datetime('now')) NOT NULL
);
--> statement-breakpoint
ALTER TABLE `camp_registrations` ADD `church_id` integer REFERENCES churches(id);--> statement-breakpoint
ALTER TABLE `camp_registrations` ADD `cash_eligible` integer DEFAULT false NOT NULL;--> statement-breakpoint
ALTER TABLE `camp_registrations` ADD `fee_waived` integer DEFAULT false NOT NULL;--> statement-breakpoint
ALTER TABLE `camp_registrations` ADD `payment_method` text;--> statement-breakpoint
ALTER TABLE `camp_registrations` ADD `event_price_cents` integer;--> statement-breakpoint
ALTER TABLE `camp_registrations` ADD `amount_due_cents` integer;--> statement-breakpoint
ALTER TABLE `camp_registrations` ADD `amount_paid_cents` integer DEFAULT 0 NOT NULL;--> statement-breakpoint
ALTER TABLE `camp_registrations` ADD `zeffy_ticket_id` text;--> statement-breakpoint
ALTER TABLE `camp_registrations` ADD `zeffy_contact_id` text;--> statement-breakpoint
ALTER TABLE `camp_registrations` ADD `zeffy_campaign_id` text;--> statement-breakpoint
ALTER TABLE `camp_registrations` ADD `zeffy_discount_code` text;--> statement-breakpoint
ALTER TABLE `camp_registrations` ADD `paid_by` text;--> statement-breakpoint
ALTER TABLE `camp_registrations` ADD `checkin_status` text DEFAULT 'NOT_CHECKED_IN' NOT NULL;--> statement-breakpoint
ALTER TABLE `camp_registrations` ADD `checked_in_at` text;--> statement-breakpoint
ALTER TABLE `camp_registrations` ADD `checked_in_by` text;--> statement-breakpoint
/*
 Backfill legacy camp_registrations rows into the new payment model.
 Legacy state: payment_status in ('unpaid','paid'), amount in dollars.
   - event_price_cents / amount_*_cents derived from the legacy dollar amount.
   - payment_status mapped: 'paid' -> PAID, 'unpaid' -> PENDING.
   - paid rows are treated as ONLINE (all pre-existing payments were via Zeffy).
 Only touches rows that still hold the legacy lowercase statuses so re-runs and
 new-model rows are left untouched.
*/
UPDATE `camp_registrations`
SET `event_price_cents` = COALESCE(`event_price_cents`, `amount` * 100)
WHERE `event_price_cents` IS NULL AND `amount` IS NOT NULL;--> statement-breakpoint
UPDATE `camp_registrations`
SET
	`payment_status` = 'PAID',
	`payment_method` = COALESCE(`payment_method`, 'ONLINE'),
	`amount_paid_cents` = COALESCE(`event_price_cents`, `amount` * 100, 0),
	`amount_due_cents` = 0
WHERE `payment_status` = 'paid';--> statement-breakpoint
UPDATE `camp_registrations`
SET
	`payment_status` = 'PENDING',
	`amount_due_cents` = COALESCE(`amount_due_cents`, `event_price_cents`, `amount` * 100)
WHERE `payment_status` = 'unpaid';