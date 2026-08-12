import { describe, expect, it } from "vitest";
import { matchesDirectorySupplementalFilters } from "../shared/directoryFilters";
import { APP_STATUSES, calculateCompletionRate, canCreateRecommender, getDeadlineUrgency, isValidApplicationStatus } from "./trackerLogic";

describe("application tracker rules", () => {
  it("accepts only the required pipeline labels", () => {
    APP_STATUSES.forEach(status => expect(isValidApplicationStatus(status)).toBe(true));
    expect(isValidApplicationStatus("waitlisted")).toBe(false);
    expect(isValidApplicationStatus("submitted")).toBe(false);
  });

  it("uses the requested red, yellow, and green urgency thresholds", () => {
    const now = new Date("2026-08-12T00:00:00");
    expect(getDeadlineUrgency("2026-08-15", now)).toBe("red");
    expect(getDeadlineUrgency("2026-09-20", now)).toBe("yellow");
    expect(getDeadlineUrgency("2026-10-20", now)).toBe("green");
    expect(getDeadlineUrgency("2026-08-01", now)).toBe("past");
    expect(getDeadlineUrgency(null, now)).toBe("unknown");
  });

  it("calculates document completion without treating empty checklists as complete", () => {
    expect(calculateCompletionRate([])).toBe(0);
    expect(calculateCompletionRate([{ isComplete: true }, { isComplete: false }, { isComplete: true }])).toBe(67);
  });

  it("limits each application to three recommendation letters", () => {
    expect(canCreateRecommender(0)).toBe(true);
    expect(canCreateRecommender(2)).toBe(true);
    expect(canCreateRecommender(3)).toBe(false);
  });

  it("filters programs by official acceptance data and current-cycle deadline windows", () => {
    const now = new Date("2026-08-12T00:00:00");
    const selectiveSoon = { acceptanceRate: "8.5", deadlines: [{ deadlineDate: "2026-08-25" }] };
    const broaderLater = { acceptanceRate: "35", deadlines: [{ deadlineDate: "2026-10-30" }] };
    const unpublishedRate = { acceptanceRate: null, deadlines: [{ deadlineDate: "2026-08-25" }] };
    expect(matchesDirectorySupplementalFilters(selectiveSoon, { acceptanceRange: "under10", deadlineWindowDays: 30 }, now)).toBe(true);
    expect(matchesDirectorySupplementalFilters(selectiveSoon, { acceptanceRange: "10to30" }, now)).toBe(false);
    expect(matchesDirectorySupplementalFilters(broaderLater, { acceptanceRange: "30plus", deadlineWindowDays: 30 }, now)).toBe(false);
    expect(matchesDirectorySupplementalFilters(unpublishedRate, { acceptanceRange: "under10" }, now)).toBe(false);
  });
});
