CREATE TABLE `bible_education_events` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`title` text NOT NULL,
	`slug` text,
	`author_id` integer,
	`description` text,
	`content` text,
	`use_editorjs` text,
	`editorjs` text,
	`region` text NOT NULL,
	`thumbnail` text,
	`featured_image` text,
	`start_at` text,
	`end_at` text,
	`created_at` text DEFAULT (datetime('now')) NOT NULL,
	`updated_at` text DEFAULT (datetime('now')) NOT NULL,
	`category` text
);
--> statement-breakpoint
CREATE TABLE `bible_education_news_articles` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`title` text,
	`slug` text,
	`author_id` integer,
	`description` text,
	`content` text,
	`thumbnail` text,
	`featured_image` text,
	`date` text,
	`use_editorjs` text,
	`editorjs` text,
	`created_at` text DEFAULT (datetime('now')),
	`updated_at` text DEFAULT (datetime('now'))
);
--> statement-breakpoint
CREATE TABLE `childrens_events` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`title` text NOT NULL,
	`slug` text,
	`author_id` integer,
	`description` text,
	`content` text,
	`use_editorjs` text,
	`editorjs` text,
	`region` text NOT NULL,
	`thumbnail` text,
	`featured_image` text,
	`start_at` text,
	`end_at` text,
	`created_at` text DEFAULT (datetime('now')) NOT NULL,
	`updated_at` text DEFAULT (datetime('now')) NOT NULL
);
--> statement-breakpoint
CREATE TABLE `childrens_files` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`name` text,
	`path` text,
	`category` text,
	`size` text,
	`created_at` text DEFAULT (datetime('now')),
	`updated_at` text DEFAULT (datetime('now'))
);
--> statement-breakpoint
CREATE TABLE `childrens_news_articles` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`title` text,
	`slug` text,
	`author_id` integer,
	`description` text,
	`content` text,
	`thumbnail` text,
	`featured_image` text,
	`date` text,
	`use_editorjs` text,
	`editorjs` text,
	`created_at` text DEFAULT (datetime('now')),
	`updated_at` text DEFAULT (datetime('now'))
);
--> statement-breakpoint
CREATE TABLE `churches` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`state` text,
	`city` text,
	`name_line_1` text,
	`name_line_2` text,
	`region` text,
	`address_line_1` text,
	`address_line_2` text,
	`contact_first_name` text,
	`contact_last_name` text,
	`phone` text,
	`youtube` text,
	`website` text,
	`flickr` text,
	`created_at` text DEFAULT (datetime('now')),
	`updated_at` text DEFAULT (datetime('now')),
	`longitude` text,
	`latitude` text
);
--> statement-breakpoint
CREATE TABLE `family_events` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`title` text NOT NULL,
	`slug` text,
	`author_id` integer,
	`description` text,
	`content` text,
	`use_editorjs` text,
	`editorjs` text,
	`region` text NOT NULL,
	`thumbnail` text,
	`featured_image` text,
	`start_at` text,
	`end_at` text,
	`created_at` text DEFAULT (datetime('now')) NOT NULL,
	`updated_at` text DEFAULT (datetime('now')) NOT NULL
);
--> statement-breakpoint
CREATE TABLE `family_news_articles` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`title` text,
	`slug` text,
	`author_id` integer,
	`description` text,
	`content` text,
	`thumbnail` text,
	`featured_image` text,
	`date` text,
	`use_editorjs` text,
	`editorjs` text,
	`created_at` text DEFAULT (datetime('now')),
	`updated_at` text DEFAULT (datetime('now'))
);
--> statement-breakpoint
CREATE TABLE `form_submissions` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`form_name` text,
	`email` text,
	`phone` text,
	`first_name` text,
	`last_name` text,
	`middle_name` text,
	`date_of_birth` text,
	`church_id` integer,
	`content` text,
	`created_at` text DEFAULT (datetime('now')) NOT NULL,
	`updated_at` text DEFAULT (datetime('now')) NOT NULL
);
--> statement-breakpoint
CREATE TABLE `general_events` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`title` text NOT NULL,
	`slug` text,
	`author_id` integer,
	`description` text,
	`content` text,
	`use_editorjs` text,
	`editorjs` text,
	`region` text NOT NULL,
	`thumbnail` text,
	`featured_image` text,
	`start_at` text,
	`end_at` text,
	`created_at` text DEFAULT (datetime('now')) NOT NULL,
	`updated_at` text DEFAULT (datetime('now')) NOT NULL,
	`comment` text
);
--> statement-breakpoint
CREATE TABLE `gospel_events` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`title` text NOT NULL,
	`slug` text,
	`author_id` integer,
	`description` text,
	`content` text,
	`use_editorjs` text,
	`editorjs` text,
	`region` text NOT NULL,
	`thumbnail` text,
	`featured_image` text,
	`start_at` text,
	`end_at` text,
	`created_at` text DEFAULT (datetime('now')) NOT NULL,
	`updated_at` text DEFAULT (datetime('now')) NOT NULL
);
--> statement-breakpoint
CREATE TABLE `media` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`model_type` text NOT NULL,
	`model_id` integer NOT NULL,
	`uuid` text NOT NULL,
	`collection_name` text NOT NULL,
	`name` text NOT NULL,
	`file_name` text NOT NULL,
	`mime_type` text NOT NULL,
	`disk` text NOT NULL,
	`conversions_disk` text NOT NULL,
	`size` integer NOT NULL,
	`manipulations` text NOT NULL,
	`custom_properties` text NOT NULL,
	`generated_conversions` text NOT NULL,
	`responsive_images` text NOT NULL,
	`order_column` integer,
	`created_at` text DEFAULT (datetime('now')) NOT NULL,
	`updated_at` text DEFAULT (datetime('now')) NOT NULL
);
--> statement-breakpoint
CREATE TABLE `music_events` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`title` text NOT NULL,
	`slug` text,
	`author_id` integer,
	`description` text,
	`content` text,
	`use_editorjs` text,
	`editorjs` text,
	`region` text NOT NULL,
	`thumbnail` text,
	`featured_image` text,
	`start_at` text,
	`end_at` text,
	`created_at` text DEFAULT (datetime('now')) NOT NULL,
	`updated_at` text DEFAULT (datetime('now')) NOT NULL
);
--> statement-breakpoint
CREATE TABLE `music_news_articles` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`title` text,
	`slug` text,
	`author_id` integer,
	`description` text,
	`content` text,
	`thumbnail` text,
	`featured_image` text,
	`date` text,
	`use_editorjs` text,
	`editorjs` text,
	`created_at` text DEFAULT (datetime('now')),
	`updated_at` text DEFAULT (datetime('now'))
);
--> statement-breakpoint
CREATE TABLE `news_articles` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`title` text,
	`slug` text,
	`author_id` integer,
	`description` text,
	`content` text,
	`thumbnail` text,
	`featured_image` text,
	`date` text,
	`use_editorjs` text,
	`editorjs` text,
	`created_at` text DEFAULT (datetime('now')),
	`updated_at` text DEFAULT (datetime('now'))
);
--> statement-breakpoint
CREATE TABLE `session` (
	`id` text PRIMARY KEY NOT NULL,
	`user_id` text NOT NULL,
	`expires_at` integer NOT NULL,
	FOREIGN KEY (`user_id`) REFERENCES `user`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `settings` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`group` text,
	`name` text,
	`payload` text,
	`locked` integer
);
--> statement-breakpoint
CREATE TABLE `user` (
	`id` text PRIMARY KEY NOT NULL,
	`age` integer,
	`username` text NOT NULL,
	`password_hash` text NOT NULL
);
--> statement-breakpoint
CREATE TABLE `youth_events` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`title` text NOT NULL,
	`slug` text,
	`author_id` integer,
	`description` text,
	`content` text,
	`use_editorjs` text,
	`editorjs` text,
	`region` text NOT NULL,
	`thumbnail` text,
	`featured_image` text,
	`start_at` text,
	`end_at` text,
	`created_at` text DEFAULT (datetime('now')) NOT NULL,
	`updated_at` text DEFAULT (datetime('now')) NOT NULL
);
--> statement-breakpoint
CREATE TABLE `youth_news_articles` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`title` text,
	`slug` text,
	`author_id` integer,
	`description` text,
	`content` text,
	`thumbnail` text,
	`featured_image` text,
	`date` text,
	`use_editorjs` text,
	`editorjs` text,
	`created_at` text DEFAULT (datetime('now')),
	`updated_at` text DEFAULT (datetime('now'))
);
--> statement-breakpoint
CREATE UNIQUE INDEX `user_username_unique` ON `user` (`username`);