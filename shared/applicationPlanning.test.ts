import { describe, expect, it } from "vitest";
import { admissionSnapshotPresence, initialCalendarMonth, orderNextActions } from "./applicationPlanning";

describe("redesigned application planning rules", () => {
  it("orders nonempty next actions by the earliest valid program deadline", () => {
    const ordered = orderNextActions([
      { nextAction: "Revise SOP", deadlines: [{ deadlineDate: "2027-01-20" }] },
      { nextAction: "Request a letter", deadlines: [{ deadlineDate: "2026-12-15" }] },
      { nextAction: "", deadlines: [{ deadlineDate: "2026-11-20" }] },
      { nextAction: "Check portal", deadlines: [{ deadlineDate: null }] },
    ]);
    expect(ordered.map(item => item.nextAction)).toEqual(["Request a letter", "Revise SOP", "Check portal"]);
  });

  it("seeds the personal calendar to the first loaded dated deadline rather than the current month", () => {
    expect(initialCalendarMonth("2026-12-15", new Date("2026-08-12"))).toEqual(new Date("2026-12-01"));
    expect(initialCalendarMonth(null, new Date("2026-08-12"))).toEqual(new Date("2026-08-01"));
  });

  it("marks absent admission facts as absent rather than treating them as a policy value", () => {
    expect(admissionSnapshotPresence({ deadline: "December 15", grePolicy: null, duolingoPolicy: null, acceptanceRate: null })).toMatchObject({ deadline: true, gre: false, duolingo: false, acceptanceRate: false });
    expect(admissionSnapshotPresence({ applicationFeeDisplay: "US$95", grePolicy: "Optional", duolingoPolicy: "Not accepted", acceptanceRate: "12.5" })).toMatchObject({ applicationFee: true, gre: true, duolingo: true, acceptanceRate: true });
  });
});
