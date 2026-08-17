import { describe, expect, it } from "vitest";
import { appRouter } from "./routers";
import type { TrpcContext } from "./_core/context";

function createUnauthenticatedContext(): TrpcContext {
  return {
    user: null,
    req: { protocol: "https", headers: {} } as TrpcContext["req"],
    res: {} as TrpcContext["res"],
  };
}

describe("tracker.directory", () => {
  it("allows an unauthenticated visitor to request a verified program detail", async () => {
    const caller = appRouter.createCaller(createUnauthenticatedContext());

    await expect(caller.tracker.directory.bySlug({ slug: "nonexistent-public-record" })).resolves.toBeUndefined();
  });

  it("returns source-backed fee-waiver guidance with the public program detail when it exists", async () => {
    const caller = appRouter.createCaller(createUnauthenticatedContext());

    const program = await caller.tracker.directory.bySlug({ slug: "ohio-university-biomedical-engineering-ms" });

    expect(program?.applicationGuidance).toEqual(expect.arrayContaining([
      expect.objectContaining({
        guidanceType: "fee_waiver_contact",
        sourceUrl: "https://www.ohio.edu/engineering/chemical/graduate/biomedical-engineering",
        verificationPasses: 3,
      }),
    ]));
  });

  it("returns an explicit official cross-degree consideration notice only for the applicable degree path", async () => {
    const caller = appRouter.createCaller(createUnauthenticatedContext());

    const program = await caller.tracker.directory.bySlug({ slug: "university-florida-biomedical-engineering-phd" });

    expect(program?.applicationGuidance).toEqual(expect.arrayContaining([
      expect.objectContaining({
        guidanceType: "cross_degree_consideration",
        sourceUrl: "https://bme.ufl.edu/admissions/graduate-admissions/",
        verificationPasses: 3,
      }),
    ]));
  });

  it("returns the current UConn Duolingo policy and fee-waiver contact guidance", async () => {
    const caller = appRouter.createCaller(createUnauthenticatedContext());

    const program = await caller.tracker.directory.bySlug({ slug: "university-connecticut-biomedical-engineering-phd" });

    expect(program?.duolingoPolicy).toContain("Duolingo English Test 110");
    expect(program?.applicationGuidance).toEqual(expect.arrayContaining([
      expect.objectContaining({
        guidanceType: "fee_waiver_contact",
        sourceUrl: "https://grad.uconn.edu/admissions/fee-waiver-policy/",
        verificationPasses: 3,
      }),
    ]));
  });

  it("returns the separately verified UH Mānoa MBBE doctorate with its own master’s sibling option", async () => {
    const caller = appRouter.createCaller(createUnauthenticatedContext());

    const program = await caller.tracker.directory.bySlug({ slug: "university-hawaii-manoa-molecular-biosciences-bioengineering-phd" });

    expect(program?.programName).toBe("Ph.D. in Molecular Biosciences and Bioengineering");
    expect(program?.degreeOptions).toEqual(expect.arrayContaining([
      expect.objectContaining({
        degreeType: "masters",
        slug: "university-of-hawaii-manoa-molecular-biosciences-bioengineering-ms",
      }),
    ]));
  });

  it("returns the separately verified SIU Biomedical Engineering doctorate with its master’s sibling option", async () => {
    const caller = appRouter.createCaller(createUnauthenticatedContext());

    const program = await caller.tracker.directory.bySlug({ slug: "southern-illinois-university-carbondale-biomedical-engineering-phd" });

    expect(program?.duolingoPolicy).toContain("Duolingo English Test 115");
    expect(program?.degreeOptions).toEqual(expect.arrayContaining([
      expect.objectContaining({
        degreeType: "masters",
        slug: "southern-illinois-university-carbondale-biomedical-engineering-ms",
      }),
    ]));
  });

  it("returns George Mason’s time-bounded official Bioengineering Ph.D. fee-waiver form", async () => {
    const caller = appRouter.createCaller(createUnauthenticatedContext());

    const program = await caller.tracker.directory.bySlug({ slug: "george-mason-bioengineering-phd" });

    expect(program?.applicationGuidance).toEqual(expect.arrayContaining([
      expect.objectContaining({
        guidanceType: "fee_waiver_form",
        destinationUrl: "https://masongrad.my.salesforce-sites.com/form/?formid=217762",
        details: expect.stringContaining("November 15, 2026"),
        verificationPasses: 3,
      }),
    ]));
  });

  it("returns Rose-Hulman’s separately verified Biomedical Engineering M.S. with source-safe testing treatment", async () => {
    const caller = appRouter.createCaller(createUnauthenticatedContext());

    const program = await caller.tracker.directory.bySlug({ slug: "rose-hulman-biomedical-engineering-ms" });

    expect(program?.applicationFeeDisplay).toBe("US$75");
    expect(program?.duolingoPolicy).toBeNull();
    expect(program?.englishTestPolicy).toContain("TOEFL iBT total 94");
    expect(program?.campusImageCredit).toContain("Rose-Hulman");
  });

  it("returns UNM’s current graduate English and Duolingo policy for Biomedical Engineering", async () => {
    const caller = appRouter.createCaller(createUnauthenticatedContext());

    const program = await caller.tracker.directory.bySlug({ slug: "university-new-mexico-biomedical-engineering-phd" });

    expect(program?.duolingoPolicy).toContain("105 minimum");
    expect(program?.englishTestPolicy).toContain("TOEFL iBT 79");
    expect(program?.englishTestPolicy).toContain("revised scale");
  });

  it("returns UNR’s qualified Ph.D. fee-support contact without generalizing it to the master’s path", async () => {
    const caller = appRouter.createCaller(createUnauthenticatedContext());

    const doctorate = await caller.tracker.directory.bySlug({ slug: "university-nevada-reno-biomedical-engineering-phd" });
    const masters = await caller.tracker.directory.bySlug({ slug: "university-nevada-reno-biomedical-engineering-ms" });

    expect(doctorate?.applicationFeeDisplay).toBe("US$60 domestic / US$95 international");
    expect(doctorate?.grePolicy).toContain("Official sources conflict");
    expect(doctorate?.applicationGuidance).toEqual(expect.arrayContaining([
      expect.objectContaining({
        guidanceType: "fee_waiver_contact",
        destinationUrl: "mailto:bparvin@unr.edu",
        details: expect.stringContaining("GRE quantitative 165"),
      }),
    ]));
    expect(masters?.applicationGuidance).toEqual([]);
  });

  it("returns Duke’s cycle-sensitive Graduate School fee-waiver steps for both BME degree paths", async () => {
    const caller = appRouter.createCaller(createUnauthenticatedContext());

    const doctorate = await caller.tracker.directory.bySlug({ slug: "duke-biomedical-engineering-phd" });
    const masters = await caller.tracker.directory.bySlug({ slug: "duke-biomedical-engineering-ms" });

    for (const program of [doctorate, masters]) {
      expect(program?.applicationGuidance).toEqual(expect.arrayContaining([
        expect.objectContaining({
          guidanceType: "fee_waiver_form",
          destinationUrl: "https://gradschool.duke.edu/admissions/application-instructions/application-fee/",
          details: expect.stringContaining("not issuing waivers for the current cycle"),
        }),
      ]));
    }
  });

  it("returns UCF’s base fee for both BME degrees but CECS waiver guidance only for the Ph.D.", async () => {
    const caller = appRouter.createCaller(createUnauthenticatedContext());

    const doctorate = await caller.tracker.directory.bySlug({ slug: "university-central-florida-biomedical-engineering-phd" });
    const masters = await caller.tracker.directory.bySlug({ slug: "university-central-florida-biomedical-engineering-ms" });

    expect(doctorate?.applicationFeeDisplay).toBe("US$30 non-refundable");
    expect(masters?.applicationFeeDisplay).toBe("US$30 non-refundable");
    expect(doctorate?.applicationGuidance).toEqual(expect.arrayContaining([
      expect.objectContaining({
        guidanceType: "fee_waiver_contact",
        details: expect.stringContaining("Ph.D.-only"),
      }),
    ]));
    expect(masters?.applicationGuidance).toEqual([]);
  });

  it("returns Case Western’s source-qualified hardship inquiry for both BME degree paths", async () => {
    const caller = appRouter.createCaller(createUnauthenticatedContext());

    const doctorate = await caller.tracker.directory.bySlug({ slug: "case-western-biomedical-engineering-phd" });
    const masters = await caller.tracker.directory.bySlug({ slug: "case-western-biomedical-engineering-ms" });

    for (const program of [doctorate, masters]) {
      expect(program?.applicationFeeDisplay).toBe("US$50 non-refundable");
      expect(program?.applicationGuidance).toEqual(expect.arrayContaining([
        expect.objectContaining({
          guidanceType: "fee_waiver_contact",
          destinationUrl: "mailto:bmestudentaffairs@case.edu",
          details: expect.stringContaining("not guaranteed"),
        }),
      ]));
    }
  });

  it("preserves multiple distinct Michigan State fee-waiver forms while keeping the BTAA path doctoral-only", async () => {
    const caller = appRouter.createCaller(createUnauthenticatedContext());

    const doctorate = await caller.tracker.directory.bySlug({ slug: "michigan-state-biomedical-engineering-phd" });
    const masters = await caller.tracker.directory.bySlug({ slug: "michigan-state-biomedical-engineering-ms" });

    expect(doctorate?.applicationFeeDisplay).toBeNull();
    expect(doctorate?.applicationGuidance).toEqual(expect.arrayContaining([
      expect.objectContaining({ destinationUrl: "https://btaa.org/students/freeapp/introduction" }),
      expect.objectContaining({ destinationUrl: "https://docs.google.com/forms/d/e/1FAIpQLSfdow943ldTIaORuDlL4bSUqNY8lX_zBukaQ1MBPGktUGfkAQ/viewform" }),
      expect.objectContaining({ destinationUrl: "https://docs.google.com/forms/d/e/1FAIpQLSeiT7dvtqfGaIGMbecfOirT9fg0r9ORLjHJ0obl94uQuexjvg/viewform" }),
    ]));
    expect(doctorate?.applicationGuidance).toHaveLength(3);
    expect(masters?.applicationGuidance).toHaveLength(2);
    expect(masters?.applicationGuidance).not.toEqual(expect.arrayContaining([
      expect.objectContaining({ destinationUrl: "https://btaa.org/students/freeapp/introduction" }),
    ]));
  });

  it("allows direct access to the single-owner personal application workspace", async () => {
    const caller = appRouter.createCaller(createUnauthenticatedContext());

    await expect(caller.tracker.applications.list()).resolves.toEqual(expect.any(Array));
  });
});
