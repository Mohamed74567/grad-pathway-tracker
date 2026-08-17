CREATE TABLE `programApplicationGuidance` (
	`id` int AUTO_INCREMENT NOT NULL,
	`programId` int NOT NULL,
	`guidanceType` enum('fee_waiver_code','fee_waiver_session','fee_waiver_form','cross_degree_consideration') NOT NULL,
	`title` varchar(255) NOT NULL,
	`details` text,
	`destinationUrl` varchar(1024),
	`sourceUrl` varchar(1024) NOT NULL,
	`sourceTitle` varchar(255) NOT NULL,
	`verificationPasses` int NOT NULL DEFAULT 1,
	`checkedAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `programApplicationGuidance_id` PRIMARY KEY(`id`),
	CONSTRAINT `program_guidance_type_url_idx` UNIQUE(`programId`,`guidanceType`,`sourceUrl`)
);
