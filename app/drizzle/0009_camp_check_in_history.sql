CREATE TABLE `camp_check_ins` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`registration_id` integer NOT NULL,
	`zeffy_ticket_id` text,
	`zeffy_payment_id` text,
	`checked_in_at` text NOT NULL,
	`checked_in_by` text NOT NULL,
	`source` text NOT NULL,
	`is_repeat` integer DEFAULT false NOT NULL,
	`note` text,
	`request_id` text NOT NULL UNIQUE,
	`created_at` text DEFAULT (datetime('now')) NOT NULL
);
--> statement-breakpoint
CREATE INDEX `camp_check_ins_registration_checked_in_at_idx` ON `camp_check_ins` (`registration_id`, `checked_in_at` DESC);
--> statement-breakpoint
INSERT INTO `camp_check_ins` (
	`registration_id`, `zeffy_ticket_id`, `zeffy_payment_id`, `checked_in_at`,
	`checked_in_by`, `source`, `is_repeat`, `note`, `request_id`
)
SELECT
	`id`, `zeffy_ticket_id`, `zeffy_payment_id`, COALESCE(`checked_in_at`, `updated_at`),
	COALESCE(`checked_in_by`, 'unknown'), 'legacy:backfill', false, NULL, 'legacy-' || `id`
FROM `camp_registrations`
WHERE `checkin_status` = 'CHECKED_IN';
