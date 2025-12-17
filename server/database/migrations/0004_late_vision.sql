PRAGMA foreign_keys=OFF;--> statement-breakpoint
CREATE TABLE `__new_note` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`userId` integer,
	`title` text NOT NULL,
	`content` text,
	`completed` integer DEFAULT false NOT NULL,
	`deadline` integer,
	`created_at` integer DEFAULT '"2025-10-16T08:02:13.736Z"' NOT NULL,
	`updated_at` integer DEFAULT '"2025-10-16T08:02:13.736Z"' NOT NULL
);
--> statement-breakpoint
INSERT INTO `__new_note`("id", "userId", "title", "content", "completed", "deadline", "created_at", "updated_at") SELECT "id", "userId", "title", "content", "completed", "deadline", "created_at", "updated_at" FROM `note`;--> statement-breakpoint
DROP TABLE `note`;--> statement-breakpoint
ALTER TABLE `__new_note` RENAME TO `note`;--> statement-breakpoint
PRAGMA foreign_keys=ON;--> statement-breakpoint
CREATE TABLE `__new_sites` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`title` text NOT NULL,
	`url` text NOT NULL,
	`favicon` text NOT NULL,
	`status` text NOT NULL,
	`desc` text,
	`sort` integer,
	`created_at` integer DEFAULT '"2025-10-16T08:02:13.736Z"' NOT NULL,
	`updated_at` integer DEFAULT '"2025-10-16T08:02:13.736Z"' NOT NULL
);
--> statement-breakpoint
INSERT INTO `__new_sites`("id", "title", "url", "favicon", "status", "desc", "sort", "created_at", "updated_at") SELECT "id", "title", "url", "favicon", "status", "desc", "sort", "created_at", "updated_at" FROM `sites`;--> statement-breakpoint
DROP TABLE `sites`;--> statement-breakpoint
ALTER TABLE `__new_sites` RENAME TO `sites`;--> statement-breakpoint
CREATE TABLE `__new_users` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`username` text NOT NULL,
	`password` text NOT NULL,
	`created_at` integer DEFAULT '"2025-10-16T08:02:13.737Z"' NOT NULL
);
--> statement-breakpoint
INSERT INTO `__new_users`("id", "username", "password", "created_at") SELECT "id", "username", "password", "created_at" FROM `users`;--> statement-breakpoint
DROP TABLE `users`;--> statement-breakpoint
ALTER TABLE `__new_users` RENAME TO `users`;--> statement-breakpoint
CREATE UNIQUE INDEX `users_username_unique` ON `users` (`username`);