CREATE TABLE `one_checkpoints` (
	`user_id` text NOT NULL,
	`checkpoint` text NOT NULL,
	`detail` text DEFAULT '' NOT NULL,
	`created_at` integer NOT NULL,
	PRIMARY KEY(`user_id`, `checkpoint`)
);
--> statement-breakpoint
CREATE TABLE `one_profiles` (
	`user_id` text PRIMARY KEY NOT NULL,
	`display_name` text NOT NULL,
	`team` text DEFAULT '' NOT NULL,
	`created_at` integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE `one_runs` (
	`id` text PRIMARY KEY NOT NULL,
	`user_id` text NOT NULL,
	`game_id` text NOT NULL,
	`level` integer NOT NULL,
	`seed` integer NOT NULL,
	`created_at` integer NOT NULL,
	`finished_at` integer,
	`passed` integer DEFAULT 0 NOT NULL,
	`summary` text DEFAULT '' NOT NULL,
	`proof` text DEFAULT '' NOT NULL
);
--> statement-breakpoint
CREATE INDEX `one_runs_user_game_level` ON `one_runs` (`user_id`,`game_id`,`level`);--> statement-breakpoint
CREATE INDEX `one_runs_user_created` ON `one_runs` (`user_id`,`created_at`);