CREATE TABLE `applicationDocuments` (
	`id` int AUTO_INCREMENT NOT NULL,
	`applicationId` int NOT NULL,
	`documentType` enum('cv','statement','transcript','test_scores','application_fee','writing_sample','other') NOT NULL,
	`label` varchar(120) NOT NULL,
	`isComplete` boolean NOT NULL DEFAULT false,
	`dueDate` date,
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `applicationDocuments_id` PRIMARY KEY(`id`),
	CONSTRAINT `document_application_type_label_idx` UNIQUE(`applicationId`,`documentType`,`label`)
);
--> statement-breakpoint
CREATE TABLE `applications` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`programId` int NOT NULL,
	`status` enum('researching','applied','interview','offer','accepted','rejected') NOT NULL DEFAULT 'researching',
	`notes` text,
	`primaryContactName` varchar(255),
	`primaryContactEmail` varchar(320),
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `applications_id` PRIMARY KEY(`id`),
	CONSTRAINT `application_user_program_idx` UNIQUE(`userId`,`programId`)
);
--> statement-breakpoint
CREATE TABLE `programDeadlines` (
	`id` int AUTO_INCREMENT NOT NULL,
	`programId` int NOT NULL,
	`academicCycle` varchar(32) NOT NULL,
	`applicantType` enum('domestic','international','all') NOT NULL DEFAULT 'all',
	`deadlineType` enum('priority','final','rolling') NOT NULL DEFAULT 'final',
	`deadlineDate` date,
	`deadlineLabel` varchar(255),
	`sourceUrl` varchar(1024) NOT NULL,
	`verifiedAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `programDeadlines_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `programSources` (
	`id` int AUTO_INCREMENT NOT NULL,
	`programId` int NOT NULL,
	`field` enum('identity','description','deadline','tuition','acceptance_rate','funding','ranking','image') NOT NULL,
	`sourceUrl` varchar(1024) NOT NULL,
	`sourceTitle` varchar(255) NOT NULL,
	`verificationPasses` int NOT NULL DEFAULT 1,
	`checkedAt` timestamp NOT NULL DEFAULT (now()),
	`notes` text,
	CONSTRAINT `programSources_id` PRIMARY KEY(`id`),
	CONSTRAINT `program_source_field_url_idx` UNIQUE(`programId`,`field`,`sourceUrl`)
);
--> statement-breakpoint
CREATE TABLE `programs` (
	`id` int AUTO_INCREMENT NOT NULL,
	`slug` varchar(180) NOT NULL,
	`universityName` varchar(255) NOT NULL,
	`universityUrl` varchar(1024),
	`programName` varchar(255) NOT NULL,
	`department` varchar(255) NOT NULL,
	`degreeType` enum('phd','masters') NOT NULL,
	`subfield` varchar(128) NOT NULL,
	`city` varchar(128) NOT NULL,
	`state` varchar(64) NOT NULL,
	`description` text,
	`curriculumHighlights` json,
	`facultyResearchAreas` json,
	`officialUrl` varchar(1024) NOT NULL,
	`applicationUrl` varchar(1024),
	`campusImageUrl` varchar(1024),
	`campusImageAlt` varchar(255),
	`campusImageCredit` varchar(255),
	`tuitionDisplay` varchar(255),
	`tuitionBasis` varchar(128),
	`tuitionAcademicYear` varchar(32),
	`acceptanceRate` decimal(5,2),
	`fundingStatus` enum('funded','available','not_stated','not_applicable') NOT NULL DEFAULT 'not_stated',
	`qsTheProvider` varchar(16),
	`qsTheEdition` varchar(32),
	`qsTheRank` varchar(64),
	`rankingTier` enum('q1','q2','q3','not_listed'),
	`verifiedAt` timestamp,
	`isPublished` boolean NOT NULL DEFAULT false,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `programs_id` PRIMARY KEY(`id`),
	CONSTRAINT `programs_slug_unique` UNIQUE(`slug`)
);
--> statement-breakpoint
CREATE TABLE `recommenders` (
	`id` int AUTO_INCREMENT NOT NULL,
	`applicationId` int NOT NULL,
	`slot` int NOT NULL,
	`name` varchar(255),
	`email` varchar(320),
	`status` enum('not_requested','requested','received') NOT NULL DEFAULT 'not_requested',
	`dueDate` date,
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `recommenders_id` PRIMARY KEY(`id`)
);
