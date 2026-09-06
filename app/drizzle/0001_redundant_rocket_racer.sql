CREATE TABLE `camp_registrations` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`event_slug` text NOT NULL,
	`first_name` text NOT NULL,
	`last_name` text NOT NULL,
	`church` text,
	`email` text,
	`phone` text,
	`leader_id` integer,
	`status` text DEFAULT 'pending_payment' NOT NULL,
	`payment_status` text DEFAULT 'unpaid' NOT NULL,
	`amount` integer,
	`stripe_session_id` text,
	`approval_token` text,
	`approved_by` text,
	`approved_at` text,
	`created_at` text DEFAULT (datetime('now')) NOT NULL,
	`updated_at` text DEFAULT (datetime('now')) NOT NULL,
	FOREIGN KEY (`leader_id`) REFERENCES `youth_leaders`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `youth_leaders` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`name` text NOT NULL,
	`email` text,
	`region` text,
	`church_id` integer,
	`active` integer DEFAULT true NOT NULL,
	`created_at` text DEFAULT (datetime('now')) NOT NULL,
	`updated_at` text DEFAULT (datetime('now')) NOT NULL
);
