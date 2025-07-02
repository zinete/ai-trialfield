CREATE TABLE `sites` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`title` text NOT NULL,
	`url` text NOT NULL,
	`favicon` text NOT NULL,
	`status` text NOT NULL,
	`desc` text,
	`sort` integer,
	`created_at` integer DEFAULT '"2025-07-01T02:18:49.683Z"' NOT NULL,
	`updated_at` integer DEFAULT '"2025-07-01T02:18:49.683Z"' NOT NULL
);
--> statement-breakpoint
CREATE TABLE `tags` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`userId` integer,
	`name` text NOT NULL,
	`icon` text NOT NULL,
	`created_at` integer DEFAULT '"2025-07-01T02:18:49.683Z"' NOT NULL,
	`updated_at` integer DEFAULT '"2025-07-01T02:18:49.683Z"' NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `tags_name_unique` ON `tags` (`name`);--> statement-breakpoint
CREATE TABLE `todos` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`userId` integer,
	`tags` text,
	`title` text NOT NULL,
	`completed` integer DEFAULT false NOT NULL,
	`created_at` integer DEFAULT '"2025-07-01T02:18:49.682Z"' NOT NULL,
	`updated_at` integer DEFAULT '"2025-07-01T02:18:49.682Z"' NOT NULL
);
--> statement-breakpoint
CREATE TABLE `users` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`username` text NOT NULL,
	`password` text NOT NULL,
	`created_at` integer DEFAULT '"2025-07-01T02:18:49.683Z"' NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `users_username_unique` ON `users` (`username`);