import { describe, expect, it } from "vitest";
import { matchesDirectorySupplementalFilters } from "./directoryFilters";

const base = {
  acceptanceRate: null,
  deadlines: [],
};

describe("source-aware directory admission filters", () => {
  it("matches GRE-not-required only when an admission-policy source supports the populated policy", () => {
    expect(matchesDirectorySupplementalFilters({ ...base, grePolicy: "GRE not required", admissionFactsSourceUrl: "https://example.edu/admissions" }, { acceptanceRange: "all", grePolicy: "not_required" })).toBe(true);
    expect(matchesDirectorySupplementalFilters({ ...base, grePolicy: "GRE not required", admissionFactsSourceUrl: null }, { acceptanceRange: "all", grePolicy: "not_required" })).toBe(false);
    expect(matchesDirectorySupplementalFilters({ ...base, grePolicy: null, admissionFactsSourceUrl: "https://example.edu/admissions" }, { acceptanceRange: "all", grePolicy: "not_required" })).toBe(false);
  });

  it("never treats a missing Duolingo policy as an acceptance", () => {
    expect(matchesDirectorySupplementalFilters({ ...base, duolingoPolicy: "Accepted; check score threshold", admissionFactsSourceUrl: "https://example.edu/admissions" }, { acceptanceRange: "all", duolingo: "accepted" })).toBe(true);
    expect(matchesDirectorySupplementalFilters({ ...base, duolingoPolicy: null, admissionFactsSourceUrl: "https://example.edu/admissions" }, { acceptanceRange: "all", duolingo: "accepted" })).toBe(false);
    expect(matchesDirectorySupplementalFilters({ ...base, duolingoPolicy: "Accepted", admissionFactsSourceUrl: null }, { acceptanceRange: "all", duolingo: "accepted" })).toBe(false);
    expect(matchesDirectorySupplementalFilters({ ...base, duolingoPolicy: "Not accepted", admissionFactsSourceUrl: "https://example.edu/admissions" }, { acceptanceRange: "all", duolingo: "accepted" })).toBe(false);
  });
});
