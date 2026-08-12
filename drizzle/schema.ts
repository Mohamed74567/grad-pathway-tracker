import {
  boolean,
  date,
  decimal,
  int,
  json,
  mysqlEnum,
  mysqlTable,
  text,
  timestamp,
  uniqueIndex,
  varchar,
} from "drizzle-orm/mysql-core";

export const users = mysqlTable("users", {
  id: int("id").autoincrement().primaryKey(),
  openId: varchar("openId", { length: 64 }).notNull().unique(),
  name: text("name"),
  email: varchar("email", { length: 320 }),
  loginMethod: varchar("loginMethod", { length: 64 }),
  role: mysqlEnum("role", ["user", "admin"]).default("user").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
  lastSignedIn: timestamp("lastSignedIn").defaultNow().notNull(),
});

export const degreeTypes = ["phd", "masters"] as const;
export const fundingStatuses = ["funded", "available", "not_stated", "not_applicable"] as const;
export const sourceFields = [
  "identity",
  "description",
  "deadline",
  "tuition",
  "acceptance_rate",
  "funding",
  "ranking",
  "image",
] as const;
export const applicationStatuses = ["researching", "applied", "interview", "offer", "accepted", "rejected"] as const;
export const documentTypes = ["cv", "statement", "transcript", "test_scores", "application_fee", "writing_sample", "other"] as const;
export const recommenderStatuses = ["not_requested", "requested", "received"] as const;

export const programs = mysqlTable("programs", {
  id: int("id").autoincrement().primaryKey(),
  slug: varchar("slug", { length: 180 }).notNull().unique(),
  universityName: varchar("universityName", { length: 255 }).notNull(),
  universityUrl: varchar("universityUrl", { length: 1024 }),
  programName: varchar("programName", { length: 255 }).notNull(),
  department: varchar("department", { length: 255 }).notNull(),
  degreeType: mysqlEnum("degreeType", degreeTypes).notNull(),
  subfield: varchar("subfield", { length: 128 }).notNull(),
  city: varchar("city", { length: 128 }).notNull(),
  state: varchar("state", { length: 64 }).notNull(),
  description: text("description"),
  curriculumHighlights: json("curriculumHighlights").$type<string[]>(),
  facultyResearchAreas: json("facultyResearchAreas").$type<string[]>(),
  applicationRequirements: json("applicationRequirements").$type<string[]>(),
  officialUrl: varchar("officialUrl", { length: 1024 }).notNull(),
  applicationUrl: varchar("applicationUrl", { length: 1024 }),
  campusImageUrl: varchar("campusImageUrl", { length: 1024 }),
  campusImageAlt: varchar("campusImageAlt", { length: 255 }),
  campusImageCredit: varchar("campusImageCredit", { length: 255 }),
  tuitionDisplay: varchar("tuitionDisplay", { length: 255 }),
  tuitionBasis: varchar("tuitionBasis", { length: 128 }),
  tuitionAcademicYear: varchar("tuitionAcademicYear", { length: 32 }),
  acceptanceRate: decimal("acceptanceRate", { precision: 5, scale: 2 }),
  fundingStatus: mysqlEnum("fundingStatus", fundingStatuses).default("not_stated").notNull(),
  qsTheProvider: varchar("qsTheProvider", { length: 16 }),
  qsTheEdition: varchar("qsTheEdition", { length: 32 }),
  qsTheRank: varchar("qsTheRank", { length: 64 }),
  rankingTier: mysqlEnum("rankingTier", ["q1", "q2", "q3", "not_listed"]),
  verifiedAt: timestamp("verifiedAt"),
  isPublished: boolean("isPublished").default(false).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export const programSources = mysqlTable(
  "programSources",
  {
    id: int("id").autoincrement().primaryKey(),
    programId: int("programId").notNull(),
    field: mysqlEnum("field", sourceFields).notNull(),
    sourceUrl: varchar("sourceUrl", { length: 1024 }).notNull(),
    sourceTitle: varchar("sourceTitle", { length: 255 }).notNull(),
    verificationPasses: int("verificationPasses").default(1).notNull(),
    checkedAt: timestamp("checkedAt").defaultNow().notNull(),
    notes: text("notes"),
  },
  table => [uniqueIndex("program_source_field_url_idx").on(table.programId, table.field, table.sourceUrl)],
);

export const programDeadlines = mysqlTable("programDeadlines", {
  id: int("id").autoincrement().primaryKey(),
  programId: int("programId").notNull(),
  academicCycle: varchar("academicCycle", { length: 32 }).notNull(),
  applicantType: mysqlEnum("applicantType", ["domestic", "international", "all"]).default("all").notNull(),
  deadlineType: mysqlEnum("deadlineType", ["priority", "final", "rolling"]).default("final").notNull(),
  deadlineDate: date("deadlineDate"),
  deadlineLabel: varchar("deadlineLabel", { length: 255 }),
  sourceUrl: varchar("sourceUrl", { length: 1024 }).notNull(),
  verifiedAt: timestamp("verifiedAt").defaultNow().notNull(),
});

export const applications = mysqlTable(
  "applications",
  {
    id: int("id").autoincrement().primaryKey(),
    userId: int("userId").notNull(),
    programId: int("programId").notNull(),
    status: mysqlEnum("status", applicationStatuses).default("researching").notNull(),
  notes: text("notes"),
  primaryContactName: varchar("primaryContactName", { length: 255 }),
  primaryContactEmail: varchar("primaryContactEmail", { length: 320 }),
  reminderAt: date("reminderAt"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
    updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
  },
  table => [uniqueIndex("application_user_program_idx").on(table.userId, table.programId)],
);

/** Private, non-directory records imported from the user's uploaded legacy tracker. */
export const legacyApplicationRecords = mysqlTable(
  "legacyApplicationRecords",
  {
    id: int("id").autoincrement().primaryKey(),
    legacyId: int("legacyId").notNull(),
    universityName: varchar("universityName", { length: 255 }).notNull(),
    programName: varchar("programName", { length: 255 }).notNull(),
    legacyWebsite: varchar("legacyWebsite", { length: 1024 }),
    legacyDeadline: date("legacyDeadline"),
    notes: text("notes"),
    sourceApplicationStatus: varchar("sourceApplicationStatus", { length: 64 }).notNull(),
    sourceResult: varchar("sourceResult", { length: 64 }).notNull(),
    isVerifiedDirectoryFact: boolean("isVerifiedDirectoryFact").default(false).notNull(),
    importedAt: timestamp("importedAt").defaultNow().notNull(),
    updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
  },
  table => [uniqueIndex("legacy_application_record_id_idx").on(table.legacyId)],
);

export const applicationDocuments = mysqlTable(
  "applicationDocuments",
  {
    id: int("id").autoincrement().primaryKey(),
    applicationId: int("applicationId").notNull(),
    documentType: mysqlEnum("documentType", documentTypes).notNull(),
    label: varchar("label", { length: 120 }).notNull(),
    isComplete: boolean("isComplete").default(false).notNull(),
    dueDate: date("dueDate"),
    updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
  },
  table => [uniqueIndex("document_application_type_label_idx").on(table.applicationId, table.documentType, table.label)],
);

export const recommenders = mysqlTable("recommenders", {
  id: int("id").autoincrement().primaryKey(),
  applicationId: int("applicationId").notNull(),
  slot: int("slot").notNull(),
  name: varchar("name", { length: 255 }),
  email: varchar("email", { length: 320 }),
  status: mysqlEnum("status", recommenderStatuses).default("not_requested").notNull(),
  dueDate: date("dueDate"),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type User = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;
export type Program = typeof programs.$inferSelect;
export type Application = typeof applications.$inferSelect;
export type LegacyApplicationRecord = typeof legacyApplicationRecords.$inferSelect;
