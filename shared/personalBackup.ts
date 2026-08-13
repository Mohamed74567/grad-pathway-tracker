export const PERSONAL_BACKUP_KIND = "gradpathway-personal-progress";
export const PERSONAL_BACKUP_SCHEMA_VERSION = 1;

export type BackupApplication = {
  programId: number;
  application: Record<string, unknown>;
  documents: Array<{ documentType: string; label: string; isComplete: boolean }>;
  recommenders: Array<{ name?: string | null; email?: string | null; status: "not_requested" | "requested" | "received" }>;
};

export type PersonalBackup = {
  schemaVersion: number;
  kind: string;
  applications: BackupApplication[];
};

export function validatePersonalBackup(value: unknown): PersonalBackup {
  const backup = value as PersonalBackup | null;
  if (!backup || backup.schemaVersion !== PERSONAL_BACKUP_SCHEMA_VERSION || backup.kind !== PERSONAL_BACKUP_KIND || !Array.isArray(backup.applications)) {
    throw new Error("This is not a supported GradPathway backup file.");
  }
  for (const candidate of backup.applications) {
    if (!Number.isInteger(candidate?.programId) || !candidate.application || !Array.isArray(candidate.documents) || !Array.isArray(candidate.recommenders)) {
      throw new Error("The backup contains an incomplete application record.");
    }
  }
  return backup;
}
