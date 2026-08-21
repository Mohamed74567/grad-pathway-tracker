import { and, asc, desc, eq, inArray, like, or } from "drizzle-orm";
import { drizzle } from "drizzle-orm/mysql2";
import {
  applications,
  applicationDocuments,
  InsertUser,
  legacyApplicationRecords,
  programApplicationGuidance,
  programDeadlines,
  programs,
  recommenders,
  users,
} from "../drizzle/schema";
import { ENV } from "./_core/env";

let _db: ReturnType<typeof drizzle> | null = null;

export async function getDb() {
  if (!_db && process.env.DATABASE_URL) {
    try {
      _db = drizzle(process.env.DATABASE_URL);
    } catch (error) {
      console.warn("[Database] Failed to connect:", error);
      _db = null;
    }
  }
  return _db;
}

export async function upsertUser(user: InsertUser): Promise<void> {
  if (!user.openId) throw new Error("User openId is required for upsert");
  const db = await getDb();
  if (!db) return;

  const values: InsertUser = { openId: user.openId, lastSignedIn: new Date() };
  const updateSet: Record<string, unknown> = { lastSignedIn: new Date() };
  (["name", "email", "loginMethod"] as const).forEach(field => {
    if (user[field] !== undefined) {
      values[field] = user[field] ?? null;
      updateSet[field] = user[field] ?? null;
    }
  });
  values.role = user.role ?? (user.openId === ENV.ownerOpenId ? "admin" : "user");
  updateSet.role = values.role;
  await db.insert(users).values(values).onDuplicateKeyUpdate({ set: updateSet });
}

export async function getUserByOpenId(openId: string) {
  const db = await getDb();
  if (!db) return undefined;
  const result = await db.select().from(users).where(eq(users.openId, openId)).limit(1);
  return result[0];
}

const PERSONAL_WORKSPACE_OPEN_ID = "gradpathway-local-personal-workspace";
let personalWorkspaceUser: typeof users.$inferSelect | null = null;

/** One durable owner record for this intentionally sign-in-free personal workspace. */
export async function getPersonalWorkspaceUser() {
  if (personalWorkspaceUser) return personalWorkspaceUser;
  const db = await getDb();
  if (!db) throw new Error("Database unavailable");
  await db.insert(users).values({
    openId: PERSONAL_WORKSPACE_OPEN_ID,
    name: "Your workspace",
    loginMethod: "local-personal",
    role: "admin",
    lastSignedIn: new Date(),
  }).onDuplicateKeyUpdate({
    set: { lastSignedIn: new Date(), name: "Your workspace", loginMethod: "local-personal" },
  });
  const record = await db.select().from(users).where(eq(users.openId, PERSONAL_WORKSPACE_OPEN_ID)).limit(1);
  if (!record[0]) throw new Error("Personal workspace could not be initialized");
  personalWorkspaceUser = record[0];
  return personalWorkspaceUser;
}

export type DirectoryFilters = {
  degreeTypes?: Array<"phd" | "masters">;
  subfields?: string[];
  states?: string[];
  funding?: Array<"funded" | "available" | "not_stated" | "not_applicable">;
  tiers?: Array<"q1" | "q2" | "q3" | "not_listed">;
  search?: string;
};

export async function getDirectoryPrograms(filters: DirectoryFilters = {}) {
  const db = await getDb();
  if (!db) return [];
  const conditions = [eq(programs.isPublished, true)];
  if (filters.degreeTypes?.length) conditions.push(inArray(programs.degreeType, filters.degreeTypes));
  if (filters.subfields?.length) conditions.push(inArray(programs.subfield, filters.subfields));
  if (filters.states?.length) conditions.push(inArray(programs.state, filters.states));
  if (filters.funding?.length) conditions.push(inArray(programs.fundingStatus, filters.funding));
  if (filters.tiers?.length) conditions.push(inArray(programs.rankingTier, filters.tiers));
  if (filters.search?.trim()) {
    const query = `%${filters.search.trim()}%`;
    conditions.push(or(like(programs.universityName, query), like(programs.programName, query), like(programs.subfield, query))!);
  }
  const records = await db.select().from(programs).where(and(...conditions)).orderBy(asc(programs.universityName), asc(programs.degreeType));
  if (records.length === 0) return [];
  const [deadlines, degreeRows, waiverRows] = await Promise.all([
    db.select().from(programDeadlines).where(inArray(programDeadlines.programId, records.map(record => record.id))),
    db.select({ universityName: programs.universityName, department: programs.department, degreeType: programs.degreeType })
      .from(programs)
      .where(eq(programs.isPublished, true)),
    db.select({ programId: programApplicationGuidance.programId })
      .from(programApplicationGuidance)
      .where(and(
        inArray(programApplicationGuidance.programId, records.map(record => record.id)),
        inArray(programApplicationGuidance.guidanceType, ["fee_waiver_code", "fee_waiver_contact", "fee_waiver_session", "fee_waiver_form"]),
      )),
  ]);
  const waiverProgramIds = new Set(waiverRows.map(row => row.programId));
  const degreeOfferingsByDepartment = new Map<string, Array<"phd" | "masters">>();
  for (const item of degreeRows) {
    const key = `${item.universityName}::${item.department}`;
    degreeOfferingsByDepartment.set(key, Array.from(new Set([...(degreeOfferingsByDepartment.get(key) ?? []), item.degreeType])));
  }
  return records.map(record => ({
    ...record,
    deadlines: deadlines.filter(deadline => deadline.programId === record.id),
    degreeOfferings: degreeOfferingsByDepartment.get(`${record.universityName}::${record.department}`) ?? [record.degreeType],
    hasFeeWaiverGuidance: waiverProgramIds.has(record.id),
  }));
}

export async function getDirectoryFacets() {
  const records = await getDirectoryPrograms();
  return {
    subfields: Array.from(new Set(records.map(record => record.subfield))).sort(),
    states: Array.from(new Set(records.map(record => record.state))).sort(),
  };
}

export async function getProgramBySlug(slug: string) {
  const db = await getDb();
  if (!db) return undefined;
  // Direct links are generated only from the published directory. Resolve by
  // exact slug without re-applying a driver-sensitive boolean predicate here;
  // MySQL/TiDB may expose boolean columns as 0/1 strings in different layers.
  const programRows = await db.select().from(programs).where(eq(programs.slug, slug)).limit(1);
  const program = programRows[0];
  if (!program) return undefined;
  const [deadlines, degreeOptions, applicationGuidance] = await Promise.all([
    db.select().from(programDeadlines).where(eq(programDeadlines.programId, program.id)).orderBy(asc(programDeadlines.deadlineDate)),
    db.select({ id: programs.id, slug: programs.slug, programName: programs.programName, degreeType: programs.degreeType, officialUrl: programs.officialUrl, applicationUrl: programs.applicationUrl })
      .from(programs)
      .where(and(eq(programs.universityName, program.universityName), eq(programs.department, program.department), eq(programs.isPublished, true)))
      .orderBy(asc(programs.degreeType), asc(programs.programName)),
    db.select().from(programApplicationGuidance).where(eq(programApplicationGuidance.programId, program.id)).orderBy(asc(programApplicationGuidance.guidanceType)),
  ]);
  return { ...program, deadlines, degreeOptions, applicationGuidance };
}

export async function getApplicationsForUser(userId: number) {
  const db = await getDb();
  if (!db) return [];
  const rows = await db
    .select({ application: applications, program: programs })
    .from(applications)
    .innerJoin(programs, eq(applications.programId, programs.id))
    .where(eq(applications.userId, userId))
    .orderBy(desc(applications.updatedAt));
  if (!rows.length) return [];
  const applicationIds = rows.map(row => row.application.id);
  const programIds = Array.from(new Set(rows.map(row => row.program.id)));
  const [allDocuments, allLetters, allDeadlines] = await Promise.all([
    db.select().from(applicationDocuments).where(inArray(applicationDocuments.applicationId, applicationIds)).orderBy(asc(applicationDocuments.id)),
    db.select().from(recommenders).where(inArray(recommenders.applicationId, applicationIds)).orderBy(asc(recommenders.slot)),
    db.select().from(programDeadlines).where(inArray(programDeadlines.programId, programIds)).orderBy(asc(programDeadlines.deadlineDate)),
  ]);
  const documentsByApplication = new Map<number, typeof allDocuments>();
  const lettersByApplication = new Map<number, typeof allLetters>();
  const deadlinesByProgram = new Map<number, typeof allDeadlines>();
  for (const document of allDocuments) documentsByApplication.set(document.applicationId, [...(documentsByApplication.get(document.applicationId) ?? []), document]);
  for (const letter of allLetters) lettersByApplication.set(letter.applicationId, [...(lettersByApplication.get(letter.applicationId) ?? []), letter]);
  for (const deadline of allDeadlines) deadlinesByProgram.set(deadline.programId, [...(deadlinesByProgram.get(deadline.programId) ?? []), deadline]);
  return rows.map(row => ({
    ...row,
    documents: documentsByApplication.get(row.application.id) ?? [],
    recommenders: lettersByApplication.get(row.application.id) ?? [],
    deadlines: deadlinesByProgram.get(row.program.id) ?? [],
  }));
}

/** These rows are intentionally separate from verified directory program records. */
export async function getLegacyApplicationRecords() {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(legacyApplicationRecords).orderBy(asc(legacyApplicationRecords.legacyId));
}

export async function addApplication(userId: number, programId: number) {
  const db = await getDb();
  if (!db) throw new Error("Database unavailable");
  await db.insert(applications).values({ userId, programId, status: "researching" }).onDuplicateKeyUpdate({ set: { updatedAt: new Date() } });
  const existing = await db.select().from(applications).where(and(eq(applications.userId, userId), eq(applications.programId, programId))).limit(1);
  const application = existing[0];
  if (!application) throw new Error("Application could not be created");
  const defaultDocuments = [
    ["cv", "CV / Résumé"], ["statement", "Statement of purpose"], ["transcript", "Transcript"],
    ["test_scores", "Test scores"], ["application_fee", "Application fee"], ["writing_sample", "Writing sample"],
  ] as const;
  for (const [documentType, label] of defaultDocuments) {
    await db.insert(applicationDocuments).values({ applicationId: application.id, documentType, label }).onDuplicateKeyUpdate({ set: { label } });
  }
  return application;
}

export async function updateApplication(userId: number, applicationId: number, data: { status?: "researching" | "applied" | "interview" | "offer" | "accepted" | "rejected"; priority?: "reach" | "match" | "safety" | "undecided"; targetResult?: "pending" | "interview" | "offer" | "accepted" | "rejected" | "waitlisted"; nextAction?: string; notes?: string; primaryContactName?: string; primaryContactEmail?: string; reminderAt?: string | null; }) {
  const db = await getDb();
  if (!db) throw new Error("Database unavailable");
  const owned = await db.select().from(applications).where(and(eq(applications.id, applicationId), eq(applications.userId, userId))).limit(1);
  if (!owned[0]) throw new Error("Application not found");
  const updateData = { ...data, reminderAt: data.reminderAt === undefined ? undefined : data.reminderAt ? new Date(`${data.reminderAt}T00:00:00`) : null, updatedAt: new Date() };
  await db.update(applications).set(updateData).where(eq(applications.id, applicationId));
}

export async function toggleApplicationDocument(userId: number, documentId: number, isComplete: boolean) {
  const db = await getDb();
  if (!db) throw new Error("Database unavailable");
  const owned = await db
    .select({ id: applicationDocuments.id })
    .from(applicationDocuments)
    .innerJoin(applications, eq(applicationDocuments.applicationId, applications.id))
    .where(and(eq(applicationDocuments.id, documentId), eq(applications.userId, userId)))
    .limit(1);
  if (!owned[0]) throw new Error("Document not found");
  await db.update(applicationDocuments).set({ isComplete, updatedAt: new Date() }).where(eq(applicationDocuments.id, documentId));
}

export async function updateRecommender(userId: number, recommenderId: number, data: { name?: string; email?: string; status?: "not_requested" | "requested" | "received"; dueDate?: string | null; }) {
  const db = await getDb();
  if (!db) throw new Error("Database unavailable");
  const owned = await db
    .select({ id: recommenders.id })
    .from(recommenders)
    .innerJoin(applications, eq(recommenders.applicationId, applications.id))
    .where(and(eq(recommenders.id, recommenderId), eq(applications.userId, userId)))
    .limit(1);
  if (!owned[0]) throw new Error("Recommender not found");
  const updateData = {
    ...data,
    dueDate: data.dueDate === undefined ? undefined : data.dueDate ? new Date(`${data.dueDate}T00:00:00`) : null,
    updatedAt: new Date(),
  };
  await db.update(recommenders).set(updateData).where(eq(recommenders.id, recommenderId));
}

export async function addRecommender(userId: number, applicationId: number) {
  const db = await getDb();
  if (!db) throw new Error("Database unavailable");
  const owned = await db.select().from(applications).where(and(eq(applications.id, applicationId), eq(applications.userId, userId))).limit(1);
  if (!owned[0]) throw new Error("Application not found");
  const existing = await db.select().from(recommenders).where(eq(recommenders.applicationId, applicationId));
  if (existing.length >= 3) throw new Error("Each application supports up to three letters of recommendation");
  await db.insert(recommenders).values({ applicationId, slot: existing.length + 1 });
}
