CREATE TABLE `legacyApplicationRecords` (
	`id` int AUTO_INCREMENT NOT NULL,
	`legacyId` int NOT NULL,
	`universityName` varchar(255) NOT NULL,
	`programName` varchar(255) NOT NULL,
	`legacyWebsite` varchar(1024),
	`legacyDeadline` date,
	`notes` text,
	`sourceApplicationStatus` varchar(64) NOT NULL,
	`sourceResult` varchar(64) NOT NULL,
	`isVerifiedDirectoryFact` boolean NOT NULL DEFAULT false,
	`importedAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `legacyApplicationRecords_id` PRIMARY KEY(`id`),
	CONSTRAINT `legacy_application_record_id_idx` UNIQUE(`legacyId`)
);
