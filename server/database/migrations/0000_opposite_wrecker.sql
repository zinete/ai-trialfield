CREATE TABLE `todos` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`title` text NOT NULL,
	`completed` integer DEFAULT false NOT NULL,
	`created_at` integer DEFAULT '"2025-06-11T01:13:05.844Z"' NOT NULL,
	`updated_at` integer DEFAULT '"2025-06-11T01:13:05.844Z"' NOT NULL
);
