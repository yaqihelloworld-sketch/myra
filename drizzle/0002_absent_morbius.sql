ALTER TABLE `experiences` ADD `user_id` text DEFAULT '' NOT NULL;--> statement-breakpoint
ALTER TABLE `experiences` ADD `best_months` text;--> statement-breakpoint
ALTER TABLE `experiences` ADD `estimated_budget` text;--> statement-breakpoint
ALTER TABLE `trips` ADD `user_id` text DEFAULT '' NOT NULL;