import { describe, expect, it } from "vitest";
import { groupUniversityProfiles } from "./universityProfiles";

describe("groupUniversityProfiles", () => {
  it("shows one university profile while preserving each master’s and doctoral path inside it", () => {
    const profiles = groupUniversityProfiles([
      { id: 1, universityName: "Northstar University", degreeType: "phd" as const, programName: "Ph.D. in Biomedical Engineering" },
      { id: 2, universityName: "Northstar University", degreeType: "masters" as const, programName: "M.S. in Biomedical Engineering" },
      { id: 3, universityName: "Lakeside University", degreeType: "masters" as const, programName: "M.S. in Bioengineering" },
    ], new Set([1, 3]));

    expect(profiles).toHaveLength(2);
    expect(profiles.find(profile => profile.universityName === "Northstar University")?.programs).toHaveLength(2);
    expect(profiles.find(profile => profile.universityName === "Northstar University")?.programs.map(program => program.degreeType)).toEqual(["phd", "masters"]);
  });

  it("does not display a university card when none of its degree paths match the active filters", () => {
    const profiles = groupUniversityProfiles([
      { id: 1, universityName: "Northstar University", degreeType: "phd" as const, programName: "Ph.D. in Biomedical Engineering" },
      { id: 2, universityName: "Southridge University", degreeType: "masters" as const, programName: "M.S. in Bioengineering" },
    ], new Set([2]));

    expect(profiles.map(profile => profile.universityName)).toEqual(["Southridge University"]);
  });
});
