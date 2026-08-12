ALTER TABLE `applications` ADD `priority` enum('reach','match','safety','undecided') DEFAULT 'undecided' NOT NULL;--> statement-breakpoint
ALTER TABLE `applications` ADD `targetResult` enum('pending','interview','offer','accepted','rejected','waitlisted') DEFAULT 'pending' NOT NULL;--> statement-breakpoint
ALTER TABLE `applications` ADD `nextAction` varchar(255);--> statement-breakpoint
ALTER TABLE `programs` ADD `acceptanceRateSourceLabel` varchar(255);--> statement-breakpoint
ALTER TABLE `programs` ADD `acceptanceRateSourceUrl` varchar(1024);--> statement-breakpoint
ALTER TABLE `programs` ADD `rankingSourceLabel` varchar(255);--> statement-breakpoint
ALTER TABLE `programs` ADD `rankingSourceUrl` varchar(1024);