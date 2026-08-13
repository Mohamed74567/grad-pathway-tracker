import { describe, expect, it } from "vitest";
import { PERSONAL_BACKUP_KIND, PERSONAL_BACKUP_SCHEMA_VERSION, validatePersonalBackup } from "./personalBackup";

const validBackup = {
  schemaVersion: PERSONAL_BACKUP_SCHEMA_VERSION,
  kind: PERSONAL_BACKUP_KIND,
  applications: [{ programId: 42, application: { status: "researching" }, documents: [], recommenders: [] }],
};

describe("validatePersonalBackup", () => {
  it("accepts a versioned personal-progress backup", () => {
    expect(validatePersonalBackup(validBackup).applications).toHaveLength(1);
  });

  it("rejects an unsupported backup shape or incomplete application", () => {
    expect(() => validatePersonalBackup({ ...validBackup, schemaVersion: 2 })).toThrow("not a supported");
    expect(() => validatePersonalBackup({ ...validBackup, applications: [{ programId: "42", application: {}, documents: [], recommenders: [] }] })).toThrow("incomplete application");
  });
});
