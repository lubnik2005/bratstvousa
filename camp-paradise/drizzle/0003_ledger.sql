DROP TABLE IF EXISTS `paradise_tickets`;
--> statement-breakpoint
CREATE TABLE `paradise_ledger` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`email` text NOT NULL,
	`attendee_id` integer,
	`event_id` integer,
	`kind` text NOT NULL,
	`amount_cents` integer NOT NULL,
	`zeffy_payment_id` text,
	`reservation_id` integer,
	`note` text,
	`created_at` text DEFAULT (datetime('now')) NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `paradise_ledger_zeffy_kind_unique` ON `paradise_ledger` (`zeffy_payment_id`,`kind`);
--> statement-breakpoint
ALTER TABLE `paradise_zeffy_payments` RENAME COLUMN `tickets_granted` TO `credited_cents`;
--> statement-breakpoint
ALTER TABLE `paradise_reservations` DROP COLUMN `ticket_id`;
