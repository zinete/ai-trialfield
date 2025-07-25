PRAGMA foreign_keys=OFF;--> statement-breakpoint
CREATE TABLE `__new_sites` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`title` text NOT NULL,
	`url` text NOT NULL,
	`favicon` text NOT NULL,
	`status` text NOT NULL,
	`desc` text,
	`sort` integer,
	`created_at` integer DEFAULT '"2025-07-09T05:54:37.108Z"' NOT NULL,
	`updated_at` integer DEFAULT '"2025-07-09T05:54:37.108Z"' NOT NULL
);
--> statement-breakpoint
INSERT INTO `__new_sites`("id", "title", "url", "favicon", "status", "desc", "sort", "created_at", "updated_at") SELECT "id", "title", "url", "favicon", "status", "desc", "sort", "created_at", "updated_at" FROM `sites`;--> statement-breakpoint
DROP TABLE `sites`;--> statement-breakpoint
ALTER TABLE `__new_sites` RENAME TO `sites`;--> statement-breakpoint
PRAGMA foreign_keys=ON;--> statement-breakpoint
CREATE TABLE `__new_tags` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`userId` integer,
	`name` text NOT NULL,
	`icon` text NOT NULL,
	`created_at` integer DEFAULT '"2025-07-09T05:54:37.108Z"' NOT NULL,
	`updated_at` integer DEFAULT '"2025-07-09T05:54:37.108Z"' NOT NULL
);
--> statement-breakpoint
INSERT INTO `__new_tags`("id", "userId", "name", "icon", "created_at", "updated_at") SELECT "id", "userId", "name", "icon", "created_at", "updated_at" FROM `tags`;--> statement-breakpoint
DROP TABLE `tags`;--> statement-breakpoint
ALTER TABLE `__new_tags` RENAME TO `tags`;--> statement-breakpoint
CREATE UNIQUE INDEX `tags_name_unique` ON `tags` (`name`);--> statement-breakpoint
CREATE TABLE `__new_todos` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`userId` integer,
	`tagId` integer,
	`title` text NOT NULL,
	`completed` integer DEFAULT false NOT NULL,
	`deadline` integer,
	`created_at` integer DEFAULT '"2025-07-09T05:54:37.107Z"' NOT NULL,
	`updated_at` integer DEFAULT '"2025-07-09T05:54:37.107Z"' NOT NULL
);
--> statement-breakpoint
INSERT INTO `__new_todos`("id", "userId", "tagId", "title", "completed", "deadline", "created_at", "updated_at") SELECT "id", "userId", "tagId", "title", "completed", "deadline", "created_at", "updated_at" FROM `todos`;--> statement-breakpoint
DROP TABLE `todos`;--> statement-breakpoint
ALTER TABLE `__new_todos` RENAME TO `todos`;--> statement-breakpoint
CREATE TABLE `__new_users` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`username` text NOT NULL,
	`password` text NOT NULL,
	`created_at` integer DEFAULT '"2025-07-09T05:54:37.108Z"' NOT NULL
);
--> statement-breakpoint
INSERT INTO `__new_users`("id", "username", "password", "created_at") SELECT "id", "username", "password", "created_at" FROM `users`;--> statement-breakpoint
DROP TABLE `users`;--> statement-breakpoint
ALTER TABLE `__new_users` RENAME TO `users`;--> statement-breakpoint
CREATE UNIQUE INDEX `users_username_unique` ON `users` (`username`);