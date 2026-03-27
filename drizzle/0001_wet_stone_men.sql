CREATE TABLE `experience_photos` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`experience_id` integer NOT NULL,
	`unsplash_id` text NOT NULL,
	`url` text NOT NULL,
	`thumb_url` text NOT NULL,
	`alt_description` text,
	`photographer_name` text NOT NULL,
	`photographer_url` text NOT NULL,
	FOREIGN KEY (`experience_id`) REFERENCES `experiences`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
PRAGMA foreign_keys=OFF;--> statement-breakpoint
CREATE TABLE `__new_experiences` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`name` text NOT NULL,
	`description` text,
	`city` text,
	`country` text DEFAULT '' NOT NULL,
	`ideal_seasons` text DEFAULT '' NOT NULL,
	`ideal_partner_types` text DEFAULT '' NOT NULL,
	`estimated_days` integer,
	`do_by_age` text,
	`status` text DEFAULT 'wishlist' NOT NULL,
	`created_at` text NOT NULL
);
--> statement-breakpoint
INSERT INTO `__new_experiences`("id", "name", "description", "city", "country", "ideal_seasons", "ideal_partner_types", "estimated_days", "do_by_age", "status", "created_at") SELECT "id", "name", "description", "city", "country", "ideal_seasons", "ideal_partner_types", "estimated_days", "do_by_age", "status", "created_at" FROM `experiences`;--> statement-breakpoint
DROP TABLE `experiences`;--> statement-breakpoint
ALTER TABLE `__new_experiences` RENAME TO `experiences`;--> statement-breakpoint
PRAGMA foreign_keys=ON;