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
  }, 15_000);

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

  it("labels fee-waiver help in the directory only for degree paths with verified official waiver guidance", async () => {
    const caller = appRouter.createCaller(createUnauthenticatedContext());
    const programs = await caller.tracker.directory.list({});

    expect(programs.find(program => program.slug === "stanford-bioengineering-ms")?.hasFeeWaiverGuidance).toBe(true);
    expect(programs.find(program => program.slug === "arizona-state-biomedical-engineering-phd")?.hasFeeWaiverGuidance).toBe(false);
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

  it("returns UConn's current Duolingo policy and the narrow internal BME M.S.-to-Ph.D. fee-waiver exception", async () => {
    const caller = appRouter.createCaller(createUnauthenticatedContext());

    const program = await caller.tracker.directory.bySlug({ slug: "university-connecticut-biomedical-engineering-phd" });
    const masters = await caller.tracker.directory.bySlug({ slug: "university-connecticut-biomedical-engineering-ms" });

    expect(program?.duolingoPolicy).toContain("Duolingo English Test 110");
    expect(program?.applicationGuidance).toEqual(expect.arrayContaining([
      expect.objectContaining({
        guidanceType: "fee_waiver_form",
        destinationUrl: "https://grad.uconn.edu/admissions/application-fee-waivers/",
        details: expect.stringContaining("after completing a UConn BME M.S."),
        verificationPasses: 3,
      }),
    ]));
    expect(masters?.applicationGuidance).not.toEqual(expect.arrayContaining([
      expect.objectContaining({
        destinationUrl: "https://grad.uconn.edu/admissions/application-fee-waivers/",
        title: "UConn BME internal M.S.-to-Ph.D. application-fee exception",
      }),
    ]));
  });

  it("returns Dartmouth Engineering's qualified fee-waiver route for Biomedical Engineering doctoral and M.Eng. paths", async () => {
    const caller = appRouter.createCaller(createUnauthenticatedContext());

    const doctorate = await caller.tracker.directory.bySlug({ slug: "dartmouth-biomedical-engineering-phd" });
    const masters = await caller.tracker.directory.bySlug({ slug: "dartmouth-biomedical-engineering-meng" });

    for (const program of [doctorate, masters]) {
      expect(program?.applicationGuidance).toEqual(expect.arrayContaining([
        expect.objectContaining({
          guidanceType: "fee_waiver_form",
          destinationUrl: "https://graduate.dartmouth.edu/admissions/applying-dartmouth/fee-waiver-criteria",
          details: expect.stringContaining("GRE fee-reduction voucher"),
          verificationPasses: 3,
        }),
      ]));
    }
  });

  it("returns Stony Brook's qualified Graduate School fee-waiver route for Biomedical Engineering doctoral and master’s paths", async () => {
    const caller = appRouter.createCaller(createUnauthenticatedContext());

    const doctorate = await caller.tracker.directory.bySlug({ slug: "stony-brook-biomedical-engineering-phd" });
    const masters = await caller.tracker.directory.bySlug({ slug: "stony-brook-biomedical-engineering-ms" });

    for (const program of [doctorate, masters]) {
      expect(program?.applicationGuidance).toEqual(expect.arrayContaining([
        expect.objectContaining({
          guidanceType: "fee_waiver_form",
          destinationUrl: "https://www.stonybrook.edu/grad/admissions/apply-graduate-programs.html",
          details: expect.stringContaining("DD Form 214"),
          verificationPasses: 3,
        }),
      ]));
    }
  });

  it("returns Northeastern's current College of Engineering fee waiver for Bioengineering M.S. only", async () => {
    const caller = appRouter.createCaller(createUnauthenticatedContext());

    const doctorate = await caller.tracker.directory.bySlug({ slug: "northeastern-bioengineering-phd" });
    const masters = await caller.tracker.directory.bySlug({ slug: "northeastern-bioengineering-ms" });

    expect(masters?.applicationFeeDisplay).toBe("Waived for new MS applicants for Fall 2026 and Spring 2027");
    expect(masters?.applicationGuidance).toEqual(expect.arrayContaining([
      expect.objectContaining({
        guidanceType: "fee_waiver_form",
        destinationUrl: "https://coe.northeastern.edu/academics-experiential-learning/graduate-school-of-engineering/graduate-admissions/",
        details: expect.stringContaining("Fall 2026 and Spring 2027"),
        verificationPasses: 3,
      }),
    ]));
    expect(doctorate?.applicationGuidance).not.toEqual(expect.arrayContaining([
      expect.objectContaining({
        title: "Northeastern Engineering master’s application-fee waiver",
      }),
    ]));
  });

  it("returns UC Riverside's qualified domestic Bioengineering fee-waiver request with current allocation limits", async () => {
    const caller = appRouter.createCaller(createUnauthenticatedContext());

    const doctorate = await caller.tracker.directory.bySlug({ slug: "uc-riverside-bioengineering-phd" });
    const masters = await caller.tracker.directory.bySlug({ slug: "uc-riverside-bioengineering-ms" });

    for (const program of [doctorate, masters]) {
      expect(program?.applicationGuidance).toEqual(expect.arrayContaining([
        expect.objectContaining({
          guidanceType: "fee_waiver_form",
          destinationUrl: "https://graduate.ucr.edu/fee-waivers",
          details: expect.stringContaining("financial-hardship fee waivers have been allocated for the 2026–27 cycle"),
          verificationPasses: 3,
        }),
      ]));
      expect(program?.applicationGuidance).toEqual(expect.arrayContaining([
        expect.objectContaining({
          details: expect.stringContaining("International applicants are not eligible"),
        }),
      ]));
    }
  });

  it("returns Clemson Bioengineering doctoral and master’s paths with no application fee", async () => {
    const caller = appRouter.createCaller(createUnauthenticatedContext());

    const doctorate = await caller.tracker.directory.bySlug({ slug: "clemson-bioengineering-phd" });
    const meng = await caller.tracker.directory.bySlug({ slug: "clemson-biomedical-engineering-meng" });
    const masters = await caller.tracker.directory.bySlug({ slug: "clemson-bioengineering-ms" });

    for (const program of [doctorate, meng, masters]) {
      expect(program?.applicationFeeDisplay).toBe("No application fee");
      expect(program?.applicationGuidance).toEqual([]);
    }
  });

  it("returns VCU Engineering's Biomedical Engineering fee-waiver request for the M.S. only", async () => {
    const caller = appRouter.createCaller(createUnauthenticatedContext());

    const doctorate = await caller.tracker.directory.bySlug({ slug: "virginia-commonwealth-university-biomedical-engineering-phd" });
    const masters = await caller.tracker.directory.bySlug({ slug: "virginia-commonwealth-university-biomedical-engineering-ms" });

    expect(masters?.applicationGuidance).toEqual(expect.arrayContaining([
      expect.objectContaining({
        guidanceType: "fee_waiver_form",
        destinationUrl: "https://forms.gle/D3HkHrNaVvgH6cVM6",
        details: expect.stringContaining("within five business days"),
        verificationPasses: 3,
      }),
    ]));
    expect(doctorate?.applicationGuidance).not.toEqual(expect.arrayContaining([
      expect.objectContaining({
        title: "VCU Engineering Biomedical Engineering M.S. fee-waiver request",
      }),
    ]));
  });

  it("returns George Mason Bioengineering's Fall 2027 doctoral fee-waiver form route", async () => {
    const caller = appRouter.createCaller(createUnauthenticatedContext());

    const doctorate = await caller.tracker.directory.bySlug({ slug: "george-mason-bioengineering-phd" });

    expect(doctorate?.applicationGuidance).toEqual(expect.arrayContaining([
      expect.objectContaining({
        guidanceType: "fee_waiver_form",
        destinationUrl: "https://masongrad.my.salesforce-sites.com/form/?formid=217762",
        details: expect.stringContaining("November 15, 2026"),
        verificationPasses: 3,
      }),
    ]));
    // The directory currently has no George Mason Bioengineering M.S. profile;
    // do not imply that the department's Fall 2027 doctoral form applies to one.
    expect(doctorate?.degreeOptions).not.toEqual(expect.arrayContaining([
      expect.objectContaining({ degreeType: "masters" }),
    ]));
  });

  it("returns the separately verified UH Mānoa MBBE doctorate with its own master’s sibling option", async () => {
    const caller = appRouter.createCaller(createUnauthenticatedContext());

    const program = await caller.tracker.directory.bySlug({ slug: "university-hawaii-manoa-molecular-biosciences-bioengineering-phd" });

    expect(program?.programName).toBe("Ph.D. in Molecular Biosciences and Bioengineering");
    expect(program?.duolingoPolicy).toContain("DET 90");
    expect(program?.duolingoPolicy).toContain("GTA standard is DET 135");
    expect(program?.degreeOptions).toEqual(expect.arrayContaining([
      expect.objectContaining({
        degreeType: "masters",
        slug: "university-of-hawaii-manoa-molecular-biosciences-bioengineering-ms",
      }),
    ]));
    const masters = await caller.tracker.directory.bySlug({ slug: "university-of-hawaii-manoa-molecular-biosciences-bioengineering-ms" });
    expect(masters?.duolingoPolicy).toBe("UH Mānoa Graduate Division: DET 90; programs may vary. Scores valid two years; GTA standard is DET 135 with Listening 135/Speaking 145.");
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

  it("returns Louisiana Tech’s verified Biomedical Engineering Ph.D. and Biomedical-track M.S.E. family", async () => {
    const caller = appRouter.createCaller(createUnauthenticatedContext());

    const doctorate = await caller.tracker.directory.bySlug({ slug: "louisiana-tech-biomedical-engineering-phd" });
    const masters = await caller.tracker.directory.bySlug({ slug: "louisiana-tech-engineering-mse-biomedical-track" });

    for (const program of [doctorate, masters]) {
      expect(program?.applicationFeeDisplay).toBe("US$40 non-refundable");
      expect(program?.applicationUrl).toBe("https://experience.latech.edu/apply");
      expect(program?.fundingStatus).toBe("available");
      expect(program?.grePolicy).toBeNull();
      expect(program?.duolingoPolicy).toContain("Duolingo English Test 105");
      expect(program?.duolingoPolicy).toContain("less than two years old");
      expect(program?.campusImageCredit).toContain("Louisiana Tech University");
    }

    expect(doctorate?.degreeOptions).toEqual(expect.arrayContaining([
      expect.objectContaining({ slug: "louisiana-tech-engineering-mse-biomedical-track", degreeType: "masters" }),
    ]));
  });

  it("returns Texas Tech’s distinct Bioengineering M.S. with source-safe blank fee and funding treatment", async () => {
    const caller = appRouter.createCaller(createUnauthenticatedContext());

    const program = await caller.tracker.directory.bySlug({ slug: "texas-tech-bioengineering-ms" });

    expect(program?.applicationFeeDisplay).toBeNull();
    expect(program?.grePolicy).toBeNull();
    expect(program?.fundingStatus).toBe("not_stated");
    expect(program?.duolingoPolicy).toContain("Duolingo English Test 100");
    expect(program?.deadlines).toEqual(expect.arrayContaining([
      expect.objectContaining({ applicantType: "domestic", deadlineLabel: expect.stringContaining("Fall Jun. 1") }),
      expect.objectContaining({ applicantType: "international", deadlineLabel: expect.stringContaining("Jan. 15") }),
    ]));
    expect(program?.applicationGuidance).toEqual(expect.arrayContaining([
      expect.objectContaining({
        guidanceType: "fee_waiver_form",
        details: expect.stringContaining("not a general fee waiver"),
      }),
    ]));
  });

  it("returns Stanford Bioengineering M.S. and Ph.D. with the current central no-DET policy", async () => {
    const caller = appRouter.createCaller(createUnauthenticatedContext());

    const masters = await caller.tracker.directory.bySlug({ slug: "stanford-bioengineering-ms" });
    const doctorate = await caller.tracker.directory.bySlug({ slug: "stanford-bioengineering-phd" });

    for (const program of [masters, doctorate]) {
      expect(program?.duolingoPolicy).toContain("not listed as an accepted");
      expect(program?.englishTestPolicy).toContain("TOEFL iBT or IELTS Academic");
      expect(program?.englishTestPolicy).toContain("programs may set higher minimums");
    }
  });

  it("returns Purdue’s Professional BME M.S. with the program-adopted current OGSPS DET policy", async () => {
    const caller = appRouter.createCaller(createUnauthenticatedContext());

    const program = await caller.tracker.directory.bySlug({ slug: "purdue-biomedical-engineering-professional-ms" });

    expect(program?.duolingoPolicy).toContain("Duolingo English Test 115 overall");
    expect(program?.duolingoPolicy).toContain("115 in each integrated subscore");
    expect(program?.duolingoPolicy).toContain("less than two years old");
  });

  it("applies Purdue BME’s current OGSPS DET wording to thesis M.S. and Ph.D. paths", async () => {
    const caller = appRouter.createCaller(createUnauthenticatedContext());
    const thesisMasters = await caller.tracker.directory.bySlug({ slug: "purdue-biomedical-engineering-ms-thesis" });
    const doctorate = await caller.tracker.directory.bySlug({ slug: "purdue-biomedical-engineering-phd" });

    for (const program of [thesisMasters, doctorate]) {
      expect(program?.duolingoPolicy).toContain("Duolingo English Test 115 overall");
      expect(program?.duolingoPolicy).toContain("115 in each integrated subscore");
      expect(program?.duolingoPolicy).toContain("less than two years old");
      expect(program?.duolingoPolicy).toContain("Programs may set higher requirements");
    }
  });

  it("returns the University of North Texas Biomedical Engineering M.S. with thesis-path-only qualified funding", async () => {
    const caller = appRouter.createCaller(createUnauthenticatedContext());

    const program = await caller.tracker.directory.bySlug({ slug: "university-north-texas-biomedical-engineering-ms" });

    expect(program?.applicationFeeDisplay).toBe("US$75 non-refundable");
    expect(program?.duolingoPolicy).toContain("Duolingo English Test 100");
    expect(program?.grePolicy).toContain("Required unless eligible");
    expect(program?.fundingStatus).toBe("available");
    expect(program?.deadlines).toEqual(expect.arrayContaining([
      expect.objectContaining({ applicantType: "domestic", deadlineLabel: expect.stringContaining("Fall Aug. 15") }),
      expect.objectContaining({ applicantType: "international", deadlineLabel: "Fall Aug. 15; Spring Dec. 1" }),
    ]));
  });

  it("returns the joint University of Memphis–UTHSC Biomedical Engineering M.S. with its own source-safe admission facts", async () => {
    const caller = appRouter.createCaller(createUnauthenticatedContext());

    const program = await caller.tracker.directory.bySlug({ slug: "memphis-uthsc-biomedical-engineering-ms" });

    expect(program?.applicationFeeDisplay).toBeNull();
    expect(program?.duolingoPolicy).toContain("no current numeric M.S. minimum");
    expect(program?.fundingStatus).toBe("available");
    expect(program?.deadlines).toEqual(expect.arrayContaining([
      expect.objectContaining({ deadlineLabel: "Fall: May 15" }),
    ]));
    expect(program?.degreeOptions).toEqual(expect.arrayContaining([
      expect.objectContaining({ slug: "memphis-uthsc-biomedical-engineering-phd", degreeType: "phd" }),
      expect.objectContaining({ slug: "memphis-uthsc-biomedical-engineering-ms", degreeType: "masters" }),
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

  it("returns Johns Hopkins BME Ph.D. with Whiting School’s source-bounded DET policy", async () => {
    const caller = appRouter.createCaller(createUnauthenticatedContext());

    const program = await caller.tracker.directory.bySlug({ slug: "johns-hopkins-biomedical-engineering-phd" });

    expect(program?.duolingoPolicy).toContain("DET 135");
    expect(program?.duolingoPolicy).toContain("unless the degree program states otherwise");
    expect(program?.englishTestPolicy).toContain("DET");
  });

  it("returns Cleveland State Biomedical Engineering M.S. with the current central DET minimum", async () => {
    const caller = appRouter.createCaller(createUnauthenticatedContext());

    const program = await caller.tracker.directory.bySlug({ slug: "cleveland-state-biomedical-engineering-ms" });

    expect(program?.duolingoPolicy).toContain("Duolingo English Test 110");
    expect(program?.duolingoPolicy).toContain("at least 95 in each section");
    expect(program?.duolingoPolicy).toContain("program-specific requirements may apply");
  });

  it("returns the University of Alabama’s separately verified Biomedical Engineering M.S. with bounded fee exemptions", async () => {
    const caller = appRouter.createCaller(createUnauthenticatedContext());

    const program = await caller.tracker.directory.bySlug({ slug: "university-alabama-biomedical-engineering-ms" });

    expect(program?.applicationFeeDisplay).toBe("US$65 U.S. citizen/permanent resident; US$80 international");
    expect(program?.duolingoPolicy).toContain("Duolingo English Test 120");
    expect(program?.fundingStatus).toBe("not_stated");
    expect(program?.deadlines).toEqual([]);
    expect(program?.applicationGuidance).toEqual(expect.arrayContaining([
      expect.objectContaining({
        guidanceType: "fee_waiver_contact",
        destinationUrl: "mailto:gradschool@ua.edu",
        details: expect.stringContaining("This is not a general fee waiver"),
      }),
    ]));
  });

  it("returns Florida Atlantic’s source-safe Biomedical Engineering M.S. with annual deadlines and qualified assistantship availability", async () => {
    const caller = appRouter.createCaller(createUnauthenticatedContext());

    const program = await caller.tracker.directory.bySlug({ slug: "florida-atlantic-biomedical-engineering-ms" });

    expect(program?.applicationFeeDisplay).toBeNull();
    expect(program?.grePolicy).toBe("Not required.");
    expect(program?.duolingoPolicy).toContain("Duolingo 110");
    expect(program?.fundingStatus).toBe("available");
    expect(program?.deadlines).toEqual(expect.arrayContaining([
      expect.objectContaining({ deadlineLabel: "Fall: July 1" }),
      expect.objectContaining({ deadlineLabel: "Spring: November 1" }),
      expect.objectContaining({ deadlineLabel: "Summer: April 1" }),
    ]));
  });

  it("returns University of New Haven Biomedical Engineering M.S. with its master’s-specific funding and current-student/alumni fee waiver boundary", async () => {
    const caller = appRouter.createCaller(createUnauthenticatedContext());

    const program = await caller.tracker.directory.bySlug({ slug: "university-new-haven-biomedical-engineering-ms" });

    expect(program?.applicationFeeDisplay).toBe("US$50 non-refundable");
    expect(program?.grePolicy).toBe("Not required.");
    expect(program?.duolingoPolicy).toContain("105 minimum");
    expect(program?.fundingStatus).toBe("available");
    expect(program?.applicationGuidance).toEqual(expect.arrayContaining([
      expect.objectContaining({
        guidanceType: "fee_waiver_contact",
        destinationUrl: "mailto:graduate@newhaven.edu",
        details: expect.stringContaining("does not establish a general fee waiver"),
      }),
    ]));
    expect(program?.deadlines).toEqual(expect.arrayContaining([
      expect.objectContaining({ applicantType: "domestic", deadlineLabel: expect.stringContaining("March 1") }),
      expect.objectContaining({ applicantType: "international", deadlineLabel: "Fall: May 1 priority" }),
    ]));
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
          details: expect.stringContaining("first-come-first-served"),
          verificationPasses: 3,
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

    expect(doctorate?.applicationFeeDisplay).toBe("US$75");
    expect(doctorate?.applicationGuidance).toEqual(expect.arrayContaining([
      expect.objectContaining({ destinationUrl: "https://btaa.org/students/freeapp/introduction" }),
      expect.objectContaining({ destinationUrl: "https://docs.google.com/forms/d/e/1FAIpQLSfdow943ldTIaORuDlL4bSUqNY8lX_zBukaQ1MBPGktUGfkAQ/viewform" }),
      expect.objectContaining({ destinationUrl: "https://docs.google.com/forms/d/e/1FAIpQLSeiT7dvtqfGaIGMbecfOirT9fg0r9ORLjHJ0obl94uQuexjvg/viewform" }),
    ]));
    expect(doctorate?.applicationGuidance).toHaveLength(3);
    expect(masters?.applicationFeeDisplay).toBe("US$75");
    expect(masters?.applicationGuidance).toHaveLength(2);
    expect(masters?.applicationGuidance).not.toEqual(expect.arrayContaining([
      expect.objectContaining({ destinationUrl: "https://btaa.org/students/freeapp/introduction" }),
    ]));
  });

  it("returns Ohio State’s confirmed BME fees and conditional central waiver path for both degrees", async () => {
    const caller = appRouter.createCaller(createUnauthenticatedContext());

    const doctorate = await caller.tracker.directory.bySlug({ slug: "ohio-state-biomedical-engineering-phd" });
    const masters = await caller.tracker.directory.bySlug({ slug: "ohio-state-biomedical-engineering-ms" });

    for (const program of [doctorate, masters]) {
      expect(program?.applicationFeeDisplay).toBe("US$60 domestic / US$70 international");
      expect(program?.applicationGuidance).toEqual(expect.arrayContaining([
        expect.objectContaining({
          guidanceType: "fee_waiver_form",
          destinationUrl: "https://gpadmissions.osu.edu/grad/apply-online.html",
          details: expect.stringContaining("does not issue fee waivers directly"),
        }),
      ]));
    }
  });

  it("returns Northwestern’s US$95 fee for both degrees and the cycle-sensitive TGS status only for Ph.D.", async () => {
    const caller = appRouter.createCaller(createUnauthenticatedContext());

    const doctorate = await caller.tracker.directory.bySlug({ slug: "northwestern-biomedical-engineering-phd" });
    const masters = await caller.tracker.directory.bySlug({ slug: "northwestern-biomedical-engineering-ms" });

    expect(doctorate?.applicationFeeDisplay).toBe("US$95 non-refundable");
    expect(masters?.applicationFeeDisplay).toBe("US$95 non-refundable");
    expect(doctorate?.applicationGuidance).toEqual(expect.arrayContaining([
      expect.objectContaining({
        guidanceType: "fee_waiver_form",
        details: expect.stringContaining("maximum waiver allocation"),
      }),
    ]));
    expect(masters?.applicationGuidance).toEqual([]);
  });

  it("returns University of Kansas Bioengineering fees and a conditional central waiver request for both degrees", async () => {
    const caller = appRouter.createCaller(createUnauthenticatedContext());

    const doctorate = await caller.tracker.directory.bySlug({ slug: "university-kansas-bioengineering-phd" });
    const masters = await caller.tracker.directory.bySlug({ slug: "university-kansas-bioengineering-ms" });

    for (const program of [doctorate, masters]) {
      expect(program?.applicationFeeDisplay).toBe("US$65 domestic / US$100 international");
      expect(program?.duolingoPolicy).toBe("Not accepted by current KU Graduate Admissions for English proficiency.");
      expect(program?.applicationGuidance).toEqual(expect.arrayContaining([
        expect.objectContaining({
          guidanceType: "fee_waiver_form",
          destinationUrl: "https://gograd.ku.edu/register/appfee_waiver",
          details: expect.stringContaining("only some programs review"),
        }),
      ]));
    }
  });

  it("returns Temple Bioengineering’s fee and the restricted domestic Graduate School waiver contact", async () => {
    const caller = appRouter.createCaller(createUnauthenticatedContext());

    const doctorate = await caller.tracker.directory.bySlug({ slug: "temple-university-bioengineering-phd" });
    const masters = await caller.tracker.directory.bySlug({ slug: "temple-university-bioengineering-ms" });

    for (const program of [doctorate, masters]) {
      expect(program?.applicationFeeDisplay).toBe("US$60 non-refundable");
      expect(program?.applicationGuidance).toEqual(expect.arrayContaining([
        expect.objectContaining({
          guidanceType: "fee_waiver_contact",
          destinationUrl: "mailto:colleen.baillie@temple.edu",
          details: expect.stringContaining("program-director documentation"),
        }),
      ]));
    }
  });

  it("returns Purdue Professional BME fees plus distinct hardship and showcase waiver paths", async () => {
    const caller = appRouter.createCaller(createUnauthenticatedContext());

    const program = await caller.tracker.directory.bySlug({ slug: "purdue-biomedical-engineering-professional-ms" });

    expect(program?.applicationFeeDisplay).toBe("US$60 domestic / US$75 international");
    expect(program?.applicationGuidance).toEqual(expect.arrayContaining([
      expect.objectContaining({
        guidanceType: "fee_waiver_contact",
        destinationUrl: "mailto:gradinfo@purdue.edu",
        details: expect.stringContaining("economic hardship"),
      }),
      expect.objectContaining({
        guidanceType: "fee_waiver_session",
        destinationUrl: "https://engineering.purdue.edu/Engr/Academics/Graduate/graduate-showcase/Fee-Waiver",
        details: expect.stringContaining("October 12, 2026"),
      }),
    ]));
    expect(program?.applicationGuidance).toHaveLength(2);
  });

  it("returns University of Maine BME’s US$65 fee and listed Graduate School waiver categories", async () => {
    const caller = appRouter.createCaller(createUnauthenticatedContext());

    const program = await caller.tracker.directory.bySlug({ slug: "university-of-maine-biomedical-engineering-ms" });

    expect(program?.applicationFeeDisplay).toBe("US$65");
    expect(program?.applicationGuidance).toEqual(expect.arrayContaining([
      expect.objectContaining({
        guidanceType: "fee_waiver_contact",
        destinationUrl: "mailto:graduate@maine.edu",
        details: expect.stringContaining("IRT Scholars"),
        details: expect.stringContaining("University of Maine System alumni"),
      }),
    ]));
  });

  it("returns OHSU BME’s verified US$70 fee and conditional Graduate Studies waiver request", async () => {
    const caller = appRouter.createCaller(createUnauthenticatedContext());

    const program = await caller.tracker.directory.bySlug({ slug: "ohsu-biomedical-engineering-phd" });

    expect(program?.applicationFeeDisplay).toBe("US$70 processing fee per program");
    expect(program?.applicationGuidance).toEqual(expect.arrayContaining([
      expect.objectContaining({
        guidanceType: "fee_waiver_contact",
        destinationUrl: "mailto:somgrad@ohsu.edu",
        details: expect.stringContaining("5 business days"),
        details: expect.stringContaining("not guaranteed"),
      }),
    ]));
  });

  it("keeps Brown BME’s verified US$75 fee and needs-based waiver on the doctoral path only", async () => {
    const caller = appRouter.createCaller(createUnauthenticatedContext());

    const doctoral = await caller.tracker.directory.bySlug({ slug: "brown-biomedical-engineering-phd" });
    const scm = await caller.tracker.directory.bySlug({ slug: "brown-biomedical-engineering-scm" });
    const meng = await caller.tracker.directory.bySlug({ slug: "brown-biomedical-engineering-meng" });

    expect(doctoral?.applicationFeeDisplay).toBe("US$75");
    expect(doctoral?.applicationGuidance).toEqual(expect.arrayContaining([
      expect.objectContaining({
        guidanceType: "fee_waiver_form",
        destinationUrl: "https://apply.graduateschool.brown.edu/apply/",
        details: expect.stringContaining("documented financial need"),
        details: expect.stringContaining("Additional Information"),
      }),
    ]));
    expect(scm?.applicationFeeDisplay).toBeNull();
    expect(meng?.applicationFeeDisplay).toBeNull();
    expect(meng?.duolingoPolicy).toBe("Duolingo is not listed on Brown Graduate School’s current TOEFL-or-IELTS proficiency policy.");
    expect(scm?.applicationGuidance).not.toEqual(expect.arrayContaining([
      expect.objectContaining({ guidanceType: "fee_waiver_form" }),
    ]));
    expect(meng?.applicationGuidance).not.toEqual(expect.arrayContaining([
      expect.objectContaining({ guidanceType: "fee_waiver_form" }),
    ]));
  });

  it("uses the UTHSC-hosted joint-program pathway’s official no-application-fee treatment for Memphis–UTHSC BME Ph.D.", async () => {
    const caller = appRouter.createCaller(createUnauthenticatedContext());

    const program = await caller.tracker.directory.bySlug({ slug: "memphis-uthsc-biomedical-engineering-phd" });

    expect(program?.applicationFeeDisplay).toBe("No application fee");
    expect(program?.applicationUrl).toBe("https://uthsc.liaisoncas.com/applicant-ux/#/login");
    expect(program?.admissionFactsSourceUrl).toBe("https://www.uthsc.edu/graduate-health-sciences/programs/");
  });

  it("applies Utah’s central graduate fee and documented McNair waiver to BME and Neural Engineering degree paths", async () => {
    const caller = appRouter.createCaller(createUnauthenticatedContext());

    const biomedicalDoctorate = await caller.tracker.directory.bySlug({ slug: "university-utah-biomedical-engineering-phd" });
    const neuralMasters = await caller.tracker.directory.bySlug({ slug: "university-utah-neural-engineering-ms" });

    expect(biomedicalDoctorate?.applicationFeeDisplay).toBe("US$0 domestic Ph.D. / US$65 international Ph.D.");
    expect(biomedicalDoctorate?.applicationGuidance).toEqual(expect.arrayContaining([
      expect.objectContaining({
        guidanceType: "fee_waiver_code",
        destinationUrl: "https://www.bme.utah.edu/prospective-graduate-students/",
        details: expect.stringContaining("CE2021BIMEPHD"),
        verificationPasses: 3,
      }),
    ]));
    expect(neuralMasters?.applicationFeeDisplay).toBe("US$55 domestic / US$65 international");

    for (const program of [biomedicalDoctorate, neuralMasters]) {
      expect(program?.applicationGuidance).toEqual(expect.arrayContaining([
        expect.objectContaining({
          guidanceType: "fee_waiver_form",
          destinationUrl: "https://admissions.utah.edu/apply/graduate-students/",
          details: expect.stringContaining("McNair Scholars"),
        }),
      ]));
    }
  });

  it("returns RIT’s US$65 doctoral fee and eligibility-limited graduate waiver guidance", async () => {
    const caller = appRouter.createCaller(createUnauthenticatedContext());

    const program = await caller.tracker.directory.bySlug({ slug: "rit-biomedical-chemical-engineering-phd" });

    expect(program?.applicationFeeDisplay).toBe("US$65 non-refundable");
    expect(program?.applicationGuidance).toEqual(expect.arrayContaining([
      expect.objectContaining({
        guidanceType: "fee_waiver_contact",
        destinationUrl: "mailto:gradinfo@rit.edu",
        details: expect.stringContaining("veterans or active-duty service members"),
        details: expect.stringContaining("no general waiver is promised"),
      }),
    ]));
  });

  it("returns North Carolina A&T’s verified Bioengineering M.S. admission snapshot", async () => {
    const caller = appRouter.createCaller(createUnauthenticatedContext());

    const program = await caller.tracker.directory.bySlug({ slug: "north-carolina-at-bioengineering-ms" });

    expect(program?.applicationFeeDisplay).toBe("US$60");
    expect(program?.applicationUrl).toBe("https://aggieadmissions.ncat.edu/graduateadmissions");
    expect(program?.englishTestPolicy).toContain("TOEFL iBT 80");
    expect(program?.duolingoPolicy).toContain("Duolingo English Test 115");
    expect(program?.fundingStatus).toBe("available");
    expect(program?.grePolicy).toBeNull();
    expect(program?.campusImageCredit).toContain("North Carolina A&T State University");
  });

  it("returns University of Akron’s distinct Biomedical Engineering M.S.E. and M.B.E. paths", async () => {
    const caller = appRouter.createCaller(createUnauthenticatedContext());

    const mse = await caller.tracker.directory.bySlug({ slug: "university-akron-biomedical-engineering-mse" });
    const mbe = await caller.tracker.directory.bySlug({ slug: "university-akron-biomedical-engineering-mbe" });

    for (const program of [mse, mbe]) {
      expect(program?.applicationFeeDisplay).toBe("No application fee");
      expect(program?.applicationUrl).toBe("https://www.uakron.edu/admissions/apply.dot");
      expect(program?.fundingStatus).toBe("available");
      expect(program?.grePolicy).toBeNull();
      expect(program?.campusImageCredit).toContain("The University of Akron");
    }

    expect(mse?.englishTestPolicy).toContain("TOEFL iBT 96");
    expect(mbe?.englishTestPolicy).toContain("TOEFL iBT 79");
    expect(mse?.duolingoPolicy).toContain("Duolingo 115");
    expect(mse?.duolingoPolicy).toContain("higher TOEFL rule but no separate DET cutoff");
    expect(mbe?.duolingoPolicy).toBe("UA central baseline: Duolingo 115; departments may set higher standards.");
    expect(mse?.degreeOptions).toEqual(expect.arrayContaining([
      expect.objectContaining({ slug: "university-akron-biomedical-engineering-mbe", degreeType: "masters" }),
    ]));
  });

  it("returns University of Toledo’s fee, priority-date, and qualified-funding treatment for both degree paths", async () => {
    const caller = appRouter.createCaller(createUnauthenticatedContext());

    const ms = await caller.tracker.directory.bySlug({ slug: "university-toledo-bioengineering-ms" });
    const phd = await caller.tracker.directory.bySlug({ slug: "university-toledo-biomedical-engineering-phd" });

    for (const program of [ms, phd]) {
      expect(program?.applicationFeeDisplay).toBe("US$45 domestic / US$75 international non-refundable");
      expect(program?.applicationUrl).toBe("https://www.utoledo.edu/graduate/apply/");
      expect(program?.fundingStatus).toBe("available");
      expect(program?.grePolicy).toBeNull();
      expect(program?.englishTestPolicy).toBeNull();
      expect(program?.duolingoPolicy).toBe("Official sources conflict: Graduate School lists DET 110; College of Engineering lists Duolingo 105 for engineering admission.");
      expect(program?.campusImageCredit).toContain("The University of Toledo");
      expect(program?.deadlines[0]?.deadlineLabel).toContain("Fall Jan. 15");
    }

    expect(phd?.degreeOptions).toEqual(expect.arrayContaining([
      expect.objectContaining({ slug: "university-toledo-bioengineering-ms", degreeType: "masters" }),
    ]));
  });

  it("returns University of Delaware’s active BME Ph.D. with restricted fee-waiver guidance", async () => {
    const caller = appRouter.createCaller(createUnauthenticatedContext());

    const program = await caller.tracker.directory.bySlug({ slug: "university-of-delaware-biomedical-engineering-phd" });

    expect(program?.applicationFeeDisplay).toBe("US$75");
    expect(program?.applicationUrl).toBe("https://grad.udel.edu/apply/");
    expect(program?.fundingStatus).toBe("available");
    expect(program?.grePolicy).toBeNull();
    expect(program?.duolingoPolicy).toBe("University of Delaware does not accept Duolingo for graduate English proficiency.");
    expect(program?.deadlines[0]?.deadlineLabel).toContain("December 15");
    expect(program?.applicationGuidance).toEqual(expect.arrayContaining([
      expect.objectContaining({
        guidanceType: "fee_waiver_form",
        destinationUrl: "https://www.udel.edu/academics/colleges/grad/prospective-students/grad-admissions/",
        details: expect.stringContaining("No general waiver is promised"),
      }),
    ]));
    expect(program?.campusImageCredit).toContain("University of Delaware");
  });

  it("returns the refreshed joint NDSU–UND BME fee and limited Graduate School waiver route", async () => {
    const caller = appRouter.createCaller(createUnauthenticatedContext());

    const ms = await caller.tracker.directory.bySlug({ slug: "und-ndsu-biomedical-engineering-ms" });
    const phd = await caller.tracker.directory.bySlug({ slug: "und-ndsu-biomedical-engineering-phd" });

    for (const program of [ms, phd]) {
      expect(program?.applicationFeeDisplay).toBe("US$35 non-refundable");
      expect(program?.applicationUrl).toContain("ndsugrad.my.site.com");
      expect(program?.englishTestPolicy).toContain("TOEFL iBT 71");
      expect(program?.duolingoPolicy).toContain("105");
      expect(program?.grePolicy).toBeNull();
      expect(program?.campusImageCredit).toContain("North Dakota State University");
      expect(program?.applicationGuidance).toEqual(expect.arrayContaining([
        expect.objectContaining({
          guidanceType: "fee_waiver_contact",
          destinationUrl: "mailto:ndsu.grad.school@ndsu.edu",
          details: expect.stringContaining("No general waiver is promised"),
        }),
      ]));
    }
  });

  it("returns University of Oklahoma’s current central fee and no-central-waiver treatment for both BME degrees", async () => {
    const caller = appRouter.createCaller(createUnauthenticatedContext());

    const ms = await caller.tracker.directory.bySlug({ slug: "university-oklahoma-biomedical-engineering-ms" });
    const phd = await caller.tracker.directory.bySlug({ slug: "university-oklahoma-biomedical-engineering-phd" });

    for (const program of [ms, phd]) {
      expect(program?.applicationFeeDisplay).toContain("US$50 U.S. citizen/permanent resident; US$100 international");
      expect(program?.admissionFactsSourceUrl).toBe("https://www.ou.edu/gradcollege/apply.html");
      expect(program?.applicationGuidance).toEqual([]);
      expect(program?.grePolicy).toContain("Not required");
      expect(program?.campusImageCredit).toContain("University of Oklahoma");
    }
  });

  it("returns University of Mississippi’s verified Biomedical Engineering M.S. snapshot", async () => {
    const caller = appRouter.createCaller(createUnauthenticatedContext());

    const program = await caller.tracker.directory.bySlug({ slug: "ole-miss-engineering-science-biomedical-ms" });

    expect(program?.applicationFeeDisplay).toBe("US$60 non-refundable");
    expect(program?.applicationUrl).toBe("https://gradapply.olemiss.edu/apply/");
    expect(program?.grePolicy).toContain("Not required");
    expect(program?.englishTestPolicy).toContain("no Biomedical Engineering-specific minimum confirmed");
    expect(program?.deadlines[0]?.deadlineLabel).toContain("Fall April 1");
    expect(program?.fundingStatus).toBe("available");
    expect(program?.campusImageCredit).toContain("University of Mississippi Biomedical Engineering");
    expect(program?.applicationGuidance).toEqual(expect.arrayContaining([
      expect.objectContaining({
        guidanceType: "fee_waiver_form",
        destinationUrl: "https://gradschool.olemiss.edu/academics-and-admissions/faq/",
        details: expect.stringContaining("only Ronald McNair Scholars"),
      }),
    ]));
  });

  it("returns University of Vermont’s case-by-case fee-waiver process for both BME degrees", async () => {
    const caller = appRouter.createCaller(createUnauthenticatedContext());

    const ms = await caller.tracker.directory.bySlug({ slug: "university-vermont-biomedical-engineering-ms" });
    const phd = await caller.tracker.directory.bySlug({ slug: "university-vermont-biomedical-engineering-phd" });

    for (const program of [ms, phd]) {
      expect(program?.applicationFeeDisplay).toBe("US$65");
      expect(program?.grePolicy).toContain("No GRE required");
      expect(program?.deadlines[0]?.deadlineLabel).toContain("January 1");
      expect(program?.applicationGuidance).toEqual(expect.arrayContaining([
        expect.objectContaining({
          guidanceType: "fee_waiver_form",
          destinationUrl: "https://www.uvm.edu/graduate/how-apply",
          details: expect.stringContaining("Approval is not guaranteed"),
        }),
      ]));
    }

    expect(phd?.degreeOptions).toEqual(expect.arrayContaining([
      expect.objectContaining({ slug: "university-vermont-biomedical-engineering-ms", degreeType: "masters" }),
    ]));
  });

  it("returns UMass Dartmouth’s verified BMEBT M.S. and Ph.D. family with the qualified Graduate School Duolingo policy", async () => {
    const caller = appRouter.createCaller(createUnauthenticatedContext());

    const ms = await caller.tracker.directory.bySlug({ slug: "umass-dartmouth-biomedical-engineering-biotechnology-ms" });
    const phd = await caller.tracker.directory.bySlug({ slug: "umass-dartmouth-biomedical-engineering-biotechnology-phd" });

    for (const program of [ms, phd]) {
      expect(program?.applicationFeeDisplay).toBe("US$60 non-refundable");
      expect(program?.applicationUrl).toContain("apply.umassd.edu");
      expect(program?.grePolicy).toContain("waived");
      expect(program?.englishTestPolicy).toContain("TOEFL iBT 72");
      expect(program?.duolingoPolicy).toBe("UMass Dartmouth Graduate School: most programs accept Duolingo 95; confirm BMEBT program-specific requirements.");
      expect(program?.fundingStatus).toBe("available");
      expect(program?.applicationGuidance).toEqual([]);
      expect(program?.campusImageCredit).toContain("University of Massachusetts Dartmouth Biomedical Engineering and Biotechnology");
    }

    expect(phd?.degreeOptions).toEqual(expect.arrayContaining([
      expect.objectContaining({ slug: "umass-dartmouth-biomedical-engineering-biotechnology-ms", degreeType: "masters" }),
    ]));
  });

  it("shows Cal Poly BME M.S. with the CSU graduate application fee without an ineligible waiver claim", async () => {
    const caller = appRouter.createCaller(createUnauthenticatedContext());
    const program = await caller.tracker.directory.bySlug({ slug: "cal-poly-biomedical-engineering-ms" });

    expect(program?.applicationFeeDisplay).toBe("US$70 non-refundable per CSU campus");
    expect(program?.applicationUrl).toContain("calstate.edu");
    expect(program?.grePolicy).toBe("Not required");
    expect(program?.applicationGuidance).toEqual([]);
    expect(program?.admissionFactsSourceUrl).toContain("calstate.edu/apply/california-residency-for-tuition-purposes/Pages/graduate-students");
  });

  it("returns Penn State’s distinct one-year non-thesis BME M.S. with no inferred assistantship", async () => {
    const caller = appRouter.createCaller(createUnauthenticatedContext());
    const program = await caller.tracker.directory.bySlug({ slug: "penn-state-biomedical-engineering-one-year-nonthesis-ms" });

    expect(program?.applicationFeeDisplay).toContain("US$65 U.S. applicants");
    expect(program?.fundingStatus).toBe("not_applicable");
    expect(program?.grePolicy).toBeNull();
    expect(program?.applicationGuidance).toEqual(expect.arrayContaining([
      expect.objectContaining({ guidanceType: "fee_waiver_contact", destinationUrl: "mailto:gradfeewaivers@engr.psu.edu" }),
    ]));
    expect(program?.degreeOptions).toEqual(expect.arrayContaining([
      expect.objectContaining({ slug: "penn-state-biomedical-engineering-thesis-ms", degreeType: "masters" }),
      expect.objectContaining({ slug: "penn-state-biomedical-engineering-phd", degreeType: "phd" }),
    ]));
  });

  it("returns Missouri’s verified Neural Engineering-focused Electrical Engineering M.S.", async () => {
    const caller = appRouter.createCaller(createUnauthenticatedContext());
    const program = await caller.tracker.directory.bySlug({ slug: "university-missouri-electrical-engineering-neural-engineering-ms" });

    expect(program?.applicationFeeDisplay).toContain("US$75 U.S. citizens/permanent residents");
    expect(program?.fundingStatus).toBe("available");
    expect(program?.grePolicy).toBeNull();
    expect(program?.duolingoPolicy).toBe("Mizzou Graduate School: Duolingo 115; score valid two years. Programs may require higher scores.");
    expect(program?.campusImageCredit).toBe("Mizzou Engineering");
    expect(program?.applicationGuidance).toEqual(expect.arrayContaining([
      expect.objectContaining({
        guidanceType: "fee_waiver_form",
        destinationUrl: "https://gradschool.missouri.edu/admissions/apply/application-fees/",
        details: expect.stringContaining("Missouri-resident"),
      }),
    ]));
  });

  it("returns the joint UT Health San Antonio–UTSA Biomedical Engineering M.S. with the Ph.D. switcher", async () => {
    const caller = appRouter.createCaller(createUnauthenticatedContext());
    const program = await caller.tracker.directory.bySlug({ slug: "ut-health-san-antonio-biomedical-engineering-ms" });

    expect(program?.applicationFeeDisplay).toBe("US$50 domestic / US$90 international per application (non-refundable)");
    expect(program?.grePolicy).toBe("Not required");
    expect(program?.englishTestPolicy).toContain("TOEFL 79");
    expect(program?.duolingoPolicy).toBe("UT Health San Antonio GSBS: Duolingo 115; score must be less than two years old at application.");
    expect(program?.fundingStatus).toBe("available");
    expect(program?.deadlines[0]?.deadlineLabel).toContain("Fall deadline June 1");
    expect(program?.campusImageCredit).toBe("UT Health San Antonio Biomedical Engineering");
    expect(program?.degreeOptions).toEqual(expect.arrayContaining([
      expect.objectContaining({ slug: "ut-san-antonio-biomedical-engineering-phd", degreeType: "phd" }),
    ]));
  });

  it("returns Stanford’s distinct Bioengineering M.S. with source-bounded funding and waiver guidance", async () => {
    const caller = appRouter.createCaller(createUnauthenticatedContext());
    const program = await caller.tracker.directory.bySlug({ slug: "stanford-bioengineering-ms" });

    expect(program?.applicationFeeDisplay).toBe("US$125 per graduate-program application (non-refundable)");
    expect(program?.grePolicy).toBe("Not required");
    expect(program?.fundingStatus).toBe("available");
    expect(program?.deadlines).toEqual([]);
    expect(program?.campusImageCredit).toBe("Stanford School of Engineering");
    expect(program?.applicationGuidance).toEqual(expect.arrayContaining([
      expect.objectContaining({
        guidanceType: "fee_waiver_form",
        destinationUrl: "https://gradadmissions.stanford.edu/fee-waiver-request-form",
        details: expect.stringContaining("not guaranteed"),
      }),
    ]));
    expect(program?.degreeOptions).toEqual(expect.arrayContaining([
      expect.objectContaining({ slug: "stanford-bioengineering-phd", degreeType: "phd" }),
    ]));
  });

  it("returns ASU’s distinct IMPACT medical-technology M.S. with source-bounded funding", async () => {
    const caller = appRouter.createCaller(createUnauthenticatedContext());
    const program = await caller.tracker.directory.bySlug({ slug: "arizona-state-impact-medical-patient-care-technologies-ms" });

    expect(program?.applicationFeeDisplay).toContain("US$70 IMPACT program application");
    expect(program?.fundingStatus).toBe("not_applicable");
    expect(program?.grePolicy).toBeNull();
    expect(program?.duolingoPolicy).toContain("Duolingo English Test 105");
    expect(program?.deadlines[0]?.deadlineLabel).toContain("December 15");
    expect(program?.campusImageCredit).toContain("Arizona State University");
    expect(program?.degreeOptions).toEqual(expect.arrayContaining([
      expect.objectContaining({ slug: "arizona-state-biomedical-engineering-ms", degreeType: "masters" }),
      expect.objectContaining({ slug: "arizona-state-biomedical-engineering-phd", degreeType: "phd" }),
    ]));
  });

  it("returns Georgia Tech degree paths with qualified Institute-level fee-waiver guidance", async () => {
    const caller = appRouter.createCaller(createUnauthenticatedContext());
    const paths = await Promise.all([
      caller.tracker.directory.bySlug({ slug: "georgia-tech-bioengineering-phd" }),
      caller.tracker.directory.bySlug({ slug: "georgia-tech-bioengineering-ms" }),
      caller.tracker.directory.bySlug({ slug: "georgia-tech-master-biomedical-innovation-development" }),
    ]);

    for (const program of paths) {
      expect(program?.applicationGuidance).toEqual(expect.arrayContaining([
        expect.objectContaining({
          guidanceType: "fee_waiver_form",
          destinationUrl: "https://grad.gatech.edu/admissions/application-fee-waivers",
          details: expect.stringContaining("home school"),
          verificationPasses: 3,
        }),
      ]));
    }

    const directory = await caller.tracker.directory.list({});
    expect(directory.find(program => program.slug === "georgia-tech-bioengineering-phd")?.hasFeeWaiverGuidance).toBe(true);
  });

  it("returns University of Washington Bioengineering degree paths with the qualified Graduate School fee-waiver route", async () => {
    const caller = appRouter.createCaller(createUnauthenticatedContext());
    const paths = await Promise.all([
      caller.tracker.directory.bySlug({ slug: "university-washington-bioengineering-phd" }),
      caller.tracker.directory.bySlug({ slug: "university-washington-master-applied-bioengineering" }),
      caller.tracker.directory.bySlug({ slug: "university-washington-master-pharmaceutical-bioengineering" }),
    ]);

    for (const program of paths) {
      expect(program?.applicationGuidance).toEqual(expect.arrayContaining([
        expect.objectContaining({
          guidanceType: "fee_waiver_form",
          destinationUrl: "https://grad.uw.edu/prospective-students/how-to-apply/application-fee-waivers/",
          details: expect.stringContaining("seven days"),
          verificationPasses: 3,
        }),
      ]));
    }
  });

  it("returns UC San Diego Bioengineering degree paths with the department-endorsed Graduate Division fee-waiver route", async () => {
    const caller = appRouter.createCaller(createUnauthenticatedContext());
    const paths = await Promise.all([
      caller.tracker.directory.bySlug({ slug: "uc-san-diego-bioengineering-phd" }),
      caller.tracker.directory.bySlug({ slug: "uc-san-diego-bioengineering-ms" }),
      caller.tracker.directory.bySlug({ slug: "uc-san-diego-bioengineering-meng" }),
      caller.tracker.directory.bySlug({ slug: "uc-san-diego-bioengineering-meng-medical-device" }),
    ]);

    for (const program of paths) {
      expect(program?.applicationGuidance).toEqual(expect.arrayContaining([
        expect.objectContaining({
          guidanceType: "fee_waiver_form",
          destinationUrl: "https://grad.ucsd.edu/admissions/requirements/application-fee-and-fee-waiver/",
          details: expect.stringContaining("only available waiver routes"),
          verificationPasses: 3,
        }),
      ]));
    }
  });

  it("returns University of New Hampshire degree paths with qualified Graduate School waiver eligibility", async () => {
    const caller = appRouter.createCaller(createUnauthenticatedContext());
    const [phd, ms, meng, ece] = await Promise.all([
      caller.tracker.directory.bySlug({ slug: "unh-bioengineering-phd" }),
      caller.tracker.directory.bySlug({ slug: "unh-bioengineering-ms" }),
      caller.tracker.directory.bySlug({ slug: "unh-bioengineering-meng" }),
      caller.tracker.directory.bySlug({ slug: "unh-ece-biomedical-engineering-ms" }),
    ]);

    for (const program of [phd, ms, meng, ece]) {
      expect(program?.applicationGuidance).toEqual(expect.arrayContaining([
        expect.objectContaining({
          guidanceType: "fee_waiver_form",
          destinationUrl: "https://gradschool.unh.edu/admissions/apply",
          details: expect.stringContaining("McNair Scholars"),
          verificationPasses: 3,
        }),
      ]));
    }

    for (const program of [ms, meng, ece]) {
      expect(program?.applicationGuidance).toEqual(expect.arrayContaining([
        expect.objectContaining({
          guidanceType: "fee_waiver_form",
          destinationUrl: "https://gradschool.unh.edu/academics/accelerated-masters-program",
          details: expect.stringContaining("3.2 GPA"),
          verificationPasses: 3,
        }),
      ]));
    }

    expect(phd?.applicationGuidance).not.toEqual(expect.arrayContaining([
      expect.objectContaining({
        destinationUrl: "https://gradschool.unh.edu/academics/accelerated-masters-program",
      }),
    ]));
  });

  it("returns UW–Madison Biomedical Engineering degree paths with the qualified Graduate School fee-grant route", async () => {
    const caller = appRouter.createCaller(createUnauthenticatedContext());
    const paths = await Promise.all([
      caller.tracker.directory.bySlug({ slug: "uw-madison-biomedical-engineering-phd" }),
      caller.tracker.directory.bySlug({ slug: "uw-madison-biomedical-engineering-research-ms" }),
      caller.tracker.directory.bySlug({ slug: "uw-madison-biomedical-innovation-design-entrepreneurship-ms" }),
      caller.tracker.directory.bySlug({ slug: "uw-madison-biomedical-engineering-accelerated-ms" }),
    ]);

    for (const program of paths) {
      expect(program?.applicationGuidance).toEqual(expect.arrayContaining([
        expect.objectContaining({
          guidanceType: "fee_waiver_form",
          destinationUrl: "https://grad.wisc.edu/apply/fee-grant/",
          details: expect.stringContaining("five business days"),
          verificationPasses: 3,
        }),
      ]));
    }
  });

  it("returns Boston University Biomedical Engineering degree paths with the qualified Engineering fee-waiver request", async () => {
    const caller = appRouter.createCaller(createUnauthenticatedContext());
    const paths = await Promise.all([
      caller.tracker.directory.bySlug({ slug: "boston-university-biomedical-engineering-phd" }),
      caller.tracker.directory.bySlug({ slug: "boston-university-biomedical-engineering-ms" }),
      caller.tracker.directory.bySlug({ slug: "boston-university-biomedical-engineering-meng" }),
    ]);

    for (const program of paths) {
      expect(program?.applicationGuidance).toEqual(expect.arrayContaining([
        expect.objectContaining({
          guidanceType: "fee_waiver_form",
          destinationUrl: "https://www.bu.edu/eng/admissions/graduate/graduate-admissions/application-deadlines-requirements/application-fee-waiver-request/",
          details: expect.stringContaining("McNair Scholars"),
          verificationPasses: 3,
        }),
      ]));
    }
  });

  it("returns Colorado State Bioengineering degree paths with the qualified Graduate School fee-waiver route", async () => {
    const caller = appRouter.createCaller(createUnauthenticatedContext());
    const paths = await Promise.all([
      caller.tracker.directory.bySlug({ slug: "colorado-state-bioengineering-phd" }),
      caller.tracker.directory.bySlug({ slug: "colorado-state-bioengineering-ms" }),
      caller.tracker.directory.bySlug({ slug: "colorado-state-master-engineering-biomedical-specialization" }),
    ]);

    for (const program of paths) {
      expect(program?.applicationGuidance).toEqual(expect.arrayContaining([
        expect.objectContaining({
          guidanceType: "fee_waiver_form",
          destinationUrl: "https://graduateschool.colostate.edu/skip-the-application-fee/",
          details: expect.stringContaining("Financial hardship alone is not eligible"),
          verificationPasses: 3,
        }),
      ]));
    }
  });

  it("returns University of Iowa Biomedical Engineering degree paths with the qualified Graduate Admissions fee-waiver route", async () => {
    const caller = appRouter.createCaller(createUnauthenticatedContext());
    const paths = await Promise.all([
      caller.tracker.directory.bySlug({ slug: "university-iowa-biomedical-engineering-phd" }),
      caller.tracker.directory.bySlug({ slug: "university-iowa-biomedical-engineering-ms" }),
    ]);

    for (const program of paths) {
      expect(program?.applicationGuidance).toEqual(expect.arrayContaining([
        expect.objectContaining({
          guidanceType: "fee_waiver_form",
          destinationUrl: "https://grad.admissions.uiowa.edu/graduate-fee-waiver",
          details: expect.stringContaining("FAFSA alone is insufficient"),
          verificationPasses: 3,
        }),
      ]));
    }
  });

  it("returns University of Minnesota Biomedical Engineering M.S. and Ph.D. with their limited department-only fee-waiver request", async () => {
    const caller = appRouter.createCaller(createUnauthenticatedContext());
    const [phd, ms, medicalDevice] = await Promise.all([
      caller.tracker.directory.bySlug({ slug: "university-minnesota-biomedical-engineering-phd" }),
      caller.tracker.directory.bySlug({ slug: "university-minnesota-biomedical-engineering-ms" }),
      caller.tracker.directory.bySlug({ slug: "university-minnesota-medical-device-innovation-ms" }),
    ]);

    for (const program of [phd, ms]) {
      expect(program?.applicationGuidance).toEqual(expect.arrayContaining([
        expect.objectContaining({
          guidanceType: "fee_waiver_form",
          destinationUrl: "https://forms.gle/4WwKYYUTDzMEP7pi7",
          details: expect.stringContaining("limited number"),
          verificationPasses: 3,
        }),
      ]));
    }

    expect(medicalDevice?.applicationGuidance).not.toEqual(expect.arrayContaining([
      expect.objectContaining({ destinationUrl: "https://forms.gle/4WwKYYUTDzMEP7pi7" }),
    ]));
  });

  it("returns University of Pittsburgh Bioengineering degree paths with the qualified Swanson fee-waiver request", async () => {
    const caller = appRouter.createCaller(createUnauthenticatedContext());
    const paths = await Promise.all([
      caller.tracker.directory.bySlug({ slug: "university-pittsburgh-bioengineering-phd" }),
      caller.tracker.directory.bySlug({ slug: "university-pittsburgh-bioengineering-research-ms" }),
      caller.tracker.directory.bySlug({ slug: "university-pittsburgh-bioengineering-neural-engineering-ms" }),
    ]);

    for (const program of paths) {
      expect(program?.applicationGuidance).toEqual(expect.arrayContaining([
        expect.objectContaining({
          guidanceType: "fee_waiver_form",
          destinationUrl: "https://www.engineering.pitt.edu/academics/graduateadmissions/graduate-applications/",
          details: expect.stringContaining("case by case"),
          verificationPasses: 3,
        }),
      ]));
    }
  });

  it("returns Rice Bioengineering’s direct doctoral fee waiver without extending it to the Master of Bioengineering", async () => {
    const caller = appRouter.createCaller(createUnauthenticatedContext());
    const [phd, masters] = await Promise.all([
      caller.tracker.directory.bySlug({ slug: "rice-bioengineering-phd" }),
      caller.tracker.directory.bySlug({ slug: "rice-master-bioengineering" }),
    ]);

    expect(phd?.applicationGuidance).toEqual(expect.arrayContaining([
      expect.objectContaining({
        guidanceType: "fee_waiver_form",
        destinationUrl: "https://bioengineering.rice.edu/academics",
        details: expect.stringContaining("waived for Ph.D. applicants"),
        verificationPasses: 3,
      }),
    ]));
    expect(masters?.applicationGuidance).not.toEqual(expect.arrayContaining([
      expect.objectContaining({ destinationUrl: "https://bioengineering.rice.edu/academics" }),
    ]));
  });

  it("returns University of Maryland Bioengineering degree paths with the qualified Graduate School fee-waiver route", async () => {
    const caller = appRouter.createCaller(createUnauthenticatedContext());
    const paths = await Promise.all([
      caller.tracker.directory.bySlug({ slug: "university-maryland-bioengineering-phd" }),
      caller.tracker.directory.bySlug({ slug: "university-maryland-bioengineering-ms" }),
    ]);

    for (const program of paths) {
      expect(program?.applicationGuidance).toEqual(expect.arrayContaining([
        expect.objectContaining({
          guidanceType: "fee_waiver_form",
          destinationUrl: "https://gradschool.umd.edu/feewaiverinformation",
          details: expect.stringContaining("10–15 business days"),
          verificationPasses: 3,
        }),
      ]));
    }
  });

  it("returns UT Austin Biomedical Engineering Ph.D. with the qualified Graduate School fee-waiver route", async () => {
    const caller = appRouter.createCaller(createUnauthenticatedContext());
    const program = await caller.tracker.directory.bySlug({ slug: "ut-austin-biomedical-engineering-phd" });

    expect(program?.applicationGuidance).toEqual(expect.arrayContaining([
      expect.objectContaining({
        guidanceType: "fee_waiver_form",
        destinationUrl: "https://gradschool.utexas.edu/admissions/apply",
        details: expect.stringContaining("U.S. citizens or permanent residents"),
        verificationPasses: 3,
      }),
    ]));
  });

  it("returns University of Michigan Biomedical Engineering degree paths with the qualified Rackham fee-waiver route", async () => {
    const caller = appRouter.createCaller(createUnauthenticatedContext());
    const paths = await Promise.all([
      caller.tracker.directory.bySlug({ slug: "university-michigan-biomedical-engineering-phd" }),
      caller.tracker.directory.bySlug({ slug: "university-michigan-biomedical-engineering-ms" }),
    ]);

    for (const program of paths) {
      expect(program?.applicationGuidance).toEqual(expect.arrayContaining([
        expect.objectContaining({
          guidanceType: "fee_waiver_form",
          destinationUrl: "https://rackham.umich.edu/admissions/applying/application-fee-and-payment/",
          details: expect.stringContaining("Student Aid Index below $1,500"),
          verificationPasses: 3,
        }),
      ]));
    }
  });

  it("returns Penn Bioengineering degree paths with Penn Engineering’s eligibility-limited automatic fee waiver", async () => {
    const caller = appRouter.createCaller(createUnauthenticatedContext());
    const paths = await Promise.all([
      caller.tracker.directory.bySlug({ slug: "university-pennsylvania-bioengineering-phd" }),
      caller.tracker.directory.bySlug({ slug: "university-pennsylvania-bioengineering-mse" }),
    ]);

    for (const program of paths) {
      expect(program?.applicationGuidance).toEqual(expect.arrayContaining([
        expect.objectContaining({
          guidanceType: "fee_waiver_form",
          destinationUrl: "https://gradadm.engineering.upenn.edu/how-to-apply/",
          details: expect.stringContaining("proven low-income background"),
          verificationPasses: 3,
        }),
      ]));
    }
  });

  it("returns Yale Biomedical Engineering degree paths with the qualified Graduate School fee-waiver request", async () => {
    const caller = appRouter.createCaller(createUnauthenticatedContext());
    const paths = await Promise.all([
      caller.tracker.directory.bySlug({ slug: "yale-biomedical-engineering-phd" }),
      caller.tracker.directory.bySlug({ slug: "yale-biomedical-engineering-ms" }),
    ]);

    for (const program of paths) {
      expect(program?.applicationGuidance).toEqual(expect.arrayContaining([
        expect.objectContaining({
          guidanceType: "fee_waiver_form",
          destinationUrl: "https://gsas.yale.edu/admissions/phdmasters-application-process/application-fees-fee-waivers",
          details: expect.stringContaining("any citizenship"),
          verificationPasses: 3,
        }),
      ]));
    }
  });

  it("returns Duke Biomedical Engineering degree paths with the qualified Graduate School fee-waiver request", async () => {
    const caller = appRouter.createCaller(createUnauthenticatedContext());
    const paths = await Promise.all([
      caller.tracker.directory.bySlug({ slug: "duke-biomedical-engineering-phd" }),
      caller.tracker.directory.bySlug({ slug: "duke-biomedical-engineering-ms" }),
    ]);

    for (const program of paths) {
      expect(program?.applicationGuidance).toEqual(expect.arrayContaining([
        expect.objectContaining({
          guidanceType: "fee_waiver_form",
          destinationUrl: "https://gradschool.duke.edu/admissions/application-instructions/application-fee/",
          details: expect.stringContaining("first-come-first-served"),
          verificationPasses: 3,
        }),
      ]));
    }
  });

  it("returns Stanford Bioengineering degree paths with the qualified School of Engineering fee-waiver request", async () => {
    const caller = appRouter.createCaller(createUnauthenticatedContext());
    const paths = await Promise.all([
      caller.tracker.directory.bySlug({ slug: "stanford-bioengineering-phd" }),
      caller.tracker.directory.bySlug({ slug: "stanford-bioengineering-ms" }),
    ]);

    for (const program of paths) {
      expect(program?.applicationGuidance).toEqual(expect.arrayContaining([
        expect.objectContaining({
          guidanceType: "fee_waiver_form",
          destinationUrl: "https://gradadmissions.stanford.edu/apply/application-fee/school-based-waivers",
          details: expect.stringContaining("10 business days"),
          verificationPasses: 3,
        }),
      ]));
    }
  });

  it("keeps Cornell Biomedical Engineering fee-waiver guidance distinct for the doctoral and professional-master's paths", async () => {
    const caller = appRouter.createCaller(createUnauthenticatedContext());
    const doctorate = await caller.tracker.directory.bySlug({ slug: "cornell-biomedical-engineering-phd" });
    const masters = await caller.tracker.directory.bySlug({ slug: "cornell-biomedical-engineering-meng" });

    expect(doctorate?.applicationGuidance).toEqual(expect.arrayContaining([
      expect.objectContaining({
        guidanceType: "fee_waiver_form",
        destinationUrl: "https://gradschool.cornell.edu/application-fee-waiver-instructions/",
        details: expect.stringContaining("fully funded doctoral or research-master’s programs"),
        verificationPasses: 3,
      }),
    ]));
    expect(masters?.applicationGuidance).toEqual(expect.arrayContaining([
      expect.objectContaining({
        guidanceType: "fee_waiver_contact",
        destinationUrl: "https://www.duffield.cornell.edu/bme/meng/meng-faqs/",
        details: expect.stringContaining("extreme financial hardship"),
        verificationPasses: 3,
      }),
    ]));
    expect(masters?.applicationGuidance).not.toEqual(expect.arrayContaining([
      expect.objectContaining({
        destinationUrl: "https://gradschool.cornell.edu/application-fee-waiver-instructions/",
      }),
    ]));
  });

  it("returns UCLA Bioengineering and Translational Medicine degree paths with the qualified Graduate Division fee-waiver route", async () => {
    const caller = appRouter.createCaller(createUnauthenticatedContext());
    const paths = await Promise.all([
      caller.tracker.directory.bySlug({ slug: "ucla-bioengineering-phd" }),
      caller.tracker.directory.bySlug({ slug: "ucla-bioengineering-ms" }),
      caller.tracker.directory.bySlug({ slug: "ucla-meng-translational-medicine" }),
    ]);

    for (const program of paths) {
      expect(program?.applicationGuidance).toEqual(expect.arrayContaining([
        expect.objectContaining({
          guidanceType: "fee_waiver_form",
          destinationUrl: "https://grad.ucla.edu/admissions/research-requirements/",
          details: expect.stringContaining("documented financial need"),
          verificationPasses: 3,
        }),
      ]));
    }
  });

  it("returns UC Berkeley Bioengineering and Translational Medicine degree paths with the qualified Graduate Division fee-waiver route", async () => {
    const caller = appRouter.createCaller(createUnauthenticatedContext());
    const paths = await Promise.all([
      caller.tracker.directory.bySlug({ slug: "uc-berkeley-ucsf-joint-bioengineering-phd" }),
      caller.tracker.directory.bySlug({ slug: "uc-berkeley-bioengineering-meng" }),
      caller.tracker.directory.bySlug({ slug: "uc-berkeley-ucsf-master-translational-medicine" }),
    ]);

    for (const program of paths) {
      expect(program?.applicationGuidance).toEqual(expect.arrayContaining([
        expect.objectContaining({
          guidanceType: "fee_waiver_form",
          destinationUrl: "https://grad.berkeley.edu/admissions/application-process/fee-waiver/",
          details: expect.stringContaining("Student Aid Index"),
          verificationPasses: 3,
        }),
      ]));
    }
  });

  it("keeps Illinois Bioengineering's doctoral departmental waiver distinct from the shared central eligibility route", async () => {
    const caller = appRouter.createCaller(createUnauthenticatedContext());
    const doctorate = await caller.tracker.directory.bySlug({ slug: "uiuc-bioengineering-phd" });
    const masters = await caller.tracker.directory.bySlug({ slug: "uiuc-bioengineering-ms" });

    for (const program of [doctorate, masters]) {
      expect(program?.applicationGuidance).toEqual(expect.arrayContaining([
        expect.objectContaining({
          guidanceType: "fee_waiver_form",
          destinationUrl: "https://grad.illinois.edu/admissions/application-instructions/completing-your-graduate-application",
          details: expect.stringContaining("qualifying domestic applicants"),
          verificationPasses: 3,
        }),
      ]));
    }
    expect(doctorate?.applicationGuidance).toEqual(expect.arrayContaining([
      expect.objectContaining({
        destinationUrl: "https://bioengineering.illinois.edu/admissions/graduate/phd",
        details: expect.stringContaining("November 15"),
        verificationPasses: 3,
      }),
    ]));
    expect(masters?.applicationGuidance).not.toEqual(expect.arrayContaining([
      expect.objectContaining({
        destinationUrl: "https://bioengineering.illinois.edu/admissions/graduate/phd",
      }),
    ]));
  });

  it("returns Ohio State Biomedical Engineering degree paths with the qualified central fee-waiver route", async () => {
    const caller = appRouter.createCaller(createUnauthenticatedContext());
    const paths = await Promise.all([
      caller.tracker.directory.bySlug({ slug: "ohio-state-biomedical-engineering-phd" }),
      caller.tracker.directory.bySlug({ slug: "ohio-state-biomedical-engineering-ms" }),
    ]);

    for (const program of paths) {
      expect(program?.applicationGuidance).toEqual(expect.arrayContaining([
        expect.objectContaining({
          guidanceType: "fee_waiver_form",
          destinationUrl: "https://gpadmissions.osu.edu/resources/fee-waivers.html",
          details: expect.stringContaining("one waiver is permitted per academic year"),
          verificationPasses: 3,
        }),
      ]));
    }
  });

  it("returns Columbia Biomedical Engineering degree paths with the qualified Engineering fee-waiver request", async () => {
    const caller = appRouter.createCaller(createUnauthenticatedContext());
    const paths = await Promise.all([
      caller.tracker.directory.bySlug({ slug: "columbia-biomedical-engineering-phd" }),
      caller.tracker.directory.bySlug({ slug: "columbia-biomedical-engineering-ms" }),
    ]);

    for (const program of paths) {
      expect(program?.applicationGuidance).toEqual(expect.arrayContaining([
        expect.objectContaining({
          guidanceType: "fee_waiver_form",
          destinationUrl: "https://apply.engineering.columbia.edu/register/feewaiverform",
          details: expect.stringContaining("U.S. military personnel or veterans"),
          verificationPasses: 3,
        }),
      ]));
    }
  });

  it("returns USC Biomedical Engineering and Medical Device Engineering degree paths with the qualified Graduate Admission fee-waiver request", async () => {
    const caller = appRouter.createCaller(createUnauthenticatedContext());
    const paths = await Promise.all([
      caller.tracker.directory.bySlug({ slug: "university-southern-california-biomedical-engineering-phd" }),
      caller.tracker.directory.bySlug({ slug: "university-southern-california-biomedical-engineering-ms" }),
      caller.tracker.directory.bySlug({ slug: "usc-medical-device-diagnostic-engineering-ms" }),
    ]);

    for (const program of paths) {
      expect(program?.applicationGuidance).toEqual(expect.arrayContaining([
        expect.objectContaining({
          guidanceType: "fee_waiver_form",
          destinationUrl: "https://gradadm.usc.edu/tools-resources/fee-waivers/",
          details: expect.stringContaining("3–4 business days"),
          verificationPasses: 3,
        }),
      ]));
    }
  });

  it("keeps UAB Neuroengineering's limited doctoral fee-waiver route separate from its Biomedical Engineering paths", async () => {
    const caller = appRouter.createCaller(createUnauthenticatedContext());
    const neuroengineering = await caller.tracker.directory.bySlug({ slug: "university-alabama-birmingham-neuroengineering-phd" });
    const biomedicalPaths = await Promise.all([
      caller.tracker.directory.bySlug({ slug: "university-alabama-birmingham-biomedical-engineering-phd" }),
      caller.tracker.directory.bySlug({ slug: "university-alabama-birmingham-biomedical-engineering-ms" }),
    ]);

    expect(neuroengineering?.applicationGuidance).toEqual(expect.arrayContaining([
      expect.objectContaining({
        guidanceType: "fee_waiver_contact",
        destinationUrl: "https://www.uab.edu/engineering/home/neuroengineering",
        details: expect.stringContaining("first-come, first-served"),
        verificationPasses: 3,
      }),
    ]));
    for (const program of biomedicalPaths) {
      expect(program?.applicationGuidance).not.toEqual(expect.arrayContaining([
        expect.objectContaining({
          destinationUrl: "https://www.uab.edu/engineering/home/neuroengineering",
        }),
      ]));
    }
  });

  it("returns UVA Biomedical Engineering degree paths with the current Engineering-wide no-fee policy", async () => {
    const caller = appRouter.createCaller(createUnauthenticatedContext());
    const paths = await Promise.all([
      caller.tracker.directory.bySlug({ slug: "university-virginia-biomedical-engineering-phd" }),
      caller.tracker.directory.bySlug({ slug: "university-virginia-biomedical-engineering-ms" }),
      caller.tracker.directory.bySlug({ slug: "university-virginia-biomedical-engineering-me" }),
    ]);

    for (const program of paths) {
      expect(program?.applicationGuidance).toEqual(expect.arrayContaining([
        expect.objectContaining({
          guidanceType: "fee_waiver_form",
          destinationUrl: "https://engineering.virginia.edu/graduate-study/future-grad-students/graduate-admission/graduate-admissions-frequently-asked-questions",
          details: expect.stringContaining("2027 admission cycle"),
          verificationPasses: 3,
        }),
      ]));
    }
  });

  it("returns Virginia Tech–Wake Forest Biomedical Engineering degree paths with the central and limited program fee-waiver routes", async () => {
    const caller = appRouter.createCaller(createUnauthenticatedContext());
    const paths = await Promise.all([
      caller.tracker.directory.bySlug({ slug: "virginia-tech-wake-forest-biomedical-engineering-phd" }),
      caller.tracker.directory.bySlug({ slug: "virginia-tech-wake-forest-biomedical-engineering-ms-thesis" }),
    ]);

    for (const program of paths) {
      expect(program?.applicationGuidance).toEqual(expect.arrayContaining([
        expect.objectContaining({
          guidanceType: "fee_waiver_form",
          destinationUrl: "https://graduateschool.vt.edu/admissions/tuition-and-costs/Application_Fees.html",
          details: expect.stringContaining("financial need alone does not qualify"),
          verificationPasses: 3,
        }),
        expect.objectContaining({
          guidanceType: "fee_waiver_contact",
          destinationUrl: "https://bme.vt.edu/graduate/biomedical/admissions/fee-waivers.html",
          details: expect.stringContaining("limited number"),
          verificationPasses: 3,
        }),
      ]));
    }
  });

  it("returns Rutgers Biomedical Engineering degree paths with the qualified central Graduate Admissions fee-waiver route", async () => {
    const caller = appRouter.createCaller(createUnauthenticatedContext());
    const paths = await Promise.all([
      caller.tracker.directory.bySlug({ slug: "rutgers-biomedical-engineering-phd" }),
      caller.tracker.directory.bySlug({ slug: "rutgers-biomedical-engineering-thesis-ms" }),
    ]);

    for (const program of paths) {
      expect(program?.applicationGuidance).toEqual(expect.arrayContaining([
        expect.objectContaining({
          guidanceType: "fee_waiver_form",
          destinationUrl: "https://gradstudy.rutgers.edu/apply/application-guidelines",
          details: expect.stringContaining("Project 1000"),
          verificationPasses: 3,
        }),
      ]));
    }
  });

  it("returns UC Irvine Biomedical Engineering degree paths with the qualified Graduate Division fee-waiver route", async () => {
    const caller = appRouter.createCaller(createUnauthenticatedContext());
    const paths = await Promise.all([
      caller.tracker.directory.bySlug({ slug: "uc-irvine-biomedical-engineering-phd" }),
      caller.tracker.directory.bySlug({ slug: "uc-irvine-biomedical-engineering-ms" }),
    ]);

    for (const program of paths) {
      expect(program?.applicationGuidance).toEqual(expect.arrayContaining([
        expect.objectContaining({
          guidanceType: "fee_waiver_form",
          destinationUrl: "https://grad.uci.edu/admissions/application-fee-fee-waivers/",
          details: expect.stringContaining("DACA/AB540"),
          verificationPasses: 3,
        }),
      ]));
    }
  });

  it("returns Notre Dame Bioengineering's qualified Graduate School fee-waiver route", async () => {
    const caller = appRouter.createCaller(createUnauthenticatedContext());
    const program = await caller.tracker.directory.bySlug({ slug: "notre-dame-bioengineering-phd" });

    expect(program?.applicationGuidance).toEqual(expect.arrayContaining([
      expect.objectContaining({
        guidanceType: "fee_waiver_form",
        destinationUrl: "https://graduateschool.nd.edu/admissions/application-requirements/application-fee-and-waiver/",
        details: expect.stringContaining("within 48 hours"),
        verificationPasses: 3,
      }),
    ]));
  });

  it("returns WPI Biomedical Engineering degree paths with the qualified Graduate School fee-waiver contact", async () => {
    const caller = appRouter.createCaller(createUnauthenticatedContext());
    const paths = await Promise.all([
      caller.tracker.directory.bySlug({ slug: "wpi-biomedical-engineering-phd" }),
      caller.tracker.directory.bySlug({ slug: "wpi-biomedical-engineering-ms" }),
      caller.tracker.directory.bySlug({ slug: "wpi-biomedical-engineering-meng" }),
    ]);

    for (const program of paths) {
      expect(program?.applicationGuidance).toEqual(expect.arrayContaining([
        expect.objectContaining({
          guidanceType: "fee_waiver_contact",
          destinationUrl: "mailto:grad@wpi.edu",
          details: expect.stringContaining("does not state eligibility categories"),
          verificationPasses: 3,
        }),
      ]));
    }
  });

  it("returns Binghamton Biomedical Engineering degree paths with the qualified Graduate Admissions fee-waiver route", async () => {
    const caller = appRouter.createCaller(createUnauthenticatedContext());
    const paths = await Promise.all([
      caller.tracker.directory.bySlug({ slug: "binghamton-biomedical-engineering-phd" }),
      caller.tracker.directory.bySlug({ slug: "binghamton-biomedical-engineering-ms" }),
    ]);

    for (const program of paths) {
      expect(program?.applicationGuidance).toEqual(expect.arrayContaining([
        expect.objectContaining({
          guidanceType: "fee_waiver_form",
          destinationUrl: "https://www.binghamton.edu/admissions/graduate/apply/application-fee-waivers.html",
          details: expect.stringContaining("2–3 business days"),
          verificationPasses: 3,
        }),
      ]));
    }
  });

  it("returns Stevens Biomedical Engineering degree paths with the Graduate Admissions event-attendee fee-waiver route", async () => {
    const caller = appRouter.createCaller(createUnauthenticatedContext());
    const paths = await Promise.all([
      caller.tracker.directory.bySlug({ slug: "stevens-biomedical-engineering-phd" }),
      caller.tracker.directory.bySlug({ slug: "stevens-biomedical-engineering-ms" }),
    ]);

    for (const program of paths) {
      expect(program?.applicationGuidance).toEqual(expect.arrayContaining([
        expect.objectContaining({
          guidanceType: "fee_waiver_session",
          destinationUrl: "https://www.stevens.edu/admission-aid/graduate-admissions/graduate-events-and-open-houses",
          details: expect.stringContaining("all graduate-event attendees"),
          verificationPasses: 3,
        }),
      ]));
    }
  });

  it("returns GW Biomedical Engineering degree paths with the qualified Engineering fee-waiver route", async () => {
    const caller = appRouter.createCaller(createUnauthenticatedContext());
    const paths = await Promise.all([
      caller.tracker.directory.bySlug({ slug: "george-washington-biomedical-engineering-phd" }),
      caller.tracker.directory.bySlug({ slug: "george-washington-biomedical-engineering-ms" }),
    ]);

    for (const program of paths) {
      expect(program?.applicationGuidance).toEqual(expect.arrayContaining([
        expect.objectContaining({
          guidanceType: "fee_waiver_session",
          destinationUrl: "https://graduate.engineering.gwu.edu/admissions-information-sessions",
          details: expect.stringContaining("U.S. Armed Forces"),
          verificationPasses: 3,
        }),
      ]));
    }
  });

  it("returns WashU Biomedical Engineering degree paths with the qualified McKelvey fee-waiver route", async () => {
    const caller = appRouter.createCaller(createUnauthenticatedContext());
    const paths = await Promise.all([
      caller.tracker.directory.bySlug({ slug: "washington-university-biomedical-engineering-phd" }),
      caller.tracker.directory.bySlug({ slug: "washington-university-biomedical-engineering-ms" }),
    ]);
    for (const program of paths) {
      expect(program?.applicationGuidance).toEqual(expect.arrayContaining([
        expect.objectContaining({
          guidanceType: "fee_waiver_session",
          destinationUrl: "https://engineering.washu.edu/academics/graduate-admissions/recruitment-schedule.html",
          details: expect.stringContaining("Admissions Cram Session"),
          verificationPasses: 3,
        }),
      ]));
    }
  });

  it("returns Rochester Biomedical Engineering degree paths with the qualified case-by-case waiver contact", async () => {
    const caller = appRouter.createCaller(createUnauthenticatedContext());
    const paths = await Promise.all([
      caller.tracker.directory.bySlug({ slug: "university-rochester-biomedical-engineering-phd" }),
      caller.tracker.directory.bySlug({ slug: "university-rochester-biomedical-engineering-ms" }),
    ]);
    for (const program of paths) {
      expect(program?.applicationGuidance).toEqual(expect.arrayContaining([
        expect.objectContaining({
          guidanceType: "fee_waiver_contact",
          destinationUrl: "https://www.rochester.edu/college/gradstudies/support-resources/coordinators.html",
          details: expect.stringContaining("case by case"),
          verificationPasses: 3,
        }),
      ]));
    }
  });

  it("returns Kentucky Biomedical Engineering degree paths with the qualified military fee-waiver route", async () => {
    const caller = appRouter.createCaller(createUnauthenticatedContext());
    const paths = await Promise.all([
      caller.tracker.directory.bySlug({ slug: "university-kentucky-biomedical-engineering-phd" }),
      caller.tracker.directory.bySlug({ slug: "university-kentucky-biomedical-engineering-ms" }),
    ]);
    for (const program of paths) {
      expect(program?.applicationGuidance).toEqual(expect.arrayContaining([
        expect.objectContaining({
          guidanceType: "fee_waiver_contact",
          destinationUrl: "mailto:GSAdmissions@uky.edu",
          details: expect.stringContaining("Chapter 33 or Chapter 35"),
          verificationPasses: 3,
        }),
      ]));
    }
  });

  it("returns UNL Biomedical Engineering Ph.D. with the qualified department-contact fee-waiver route", async () => {
    const caller = appRouter.createCaller(createUnauthenticatedContext());
    const program = await caller.tracker.directory.bySlug({ slug: "university-nebraska-biomedical-engineering-phd" });

    expect(program?.applicationGuidance).toEqual(expect.arrayContaining([
      expect.objectContaining({
        guidanceType: "fee_waiver_contact",
        destinationUrl: "mailto:gbashford2@unl.edu",
        details: expect.stringContaining("McNair Scholars"),
        verificationPasses: 3,
      }),
    ]));
  });

  it("returns UT Knoxville Biomedical Engineering’s qualified doctoral-only fee-waiver code without copying it to the M.S.", async () => {
    const caller = appRouter.createCaller(createUnauthenticatedContext());
    const phd = await caller.tracker.directory.bySlug({ slug: "university-tennessee-knoxville-biomedical-engineering-phd" });
    const masters = await caller.tracker.directory.bySlug({ slug: "university-tennessee-knoxville-biomedical-engineering-ms" });

    expect(phd?.applicationGuidance).toEqual(expect.arrayContaining([
      expect.objectContaining({
        guidanceType: "fee_waiver_code",
        destinationUrl: "https://tickle.utk.edu/bme/academics/graduate/admission-requirements/",
        details: expect.stringContaining("first-time Ph.D. applicants"),
        verificationPasses: 3,
      }),
    ]));
    expect(masters?.applicationGuidance.some((guide) => guide.guidanceType.startsWith("fee_waiver_"))).toBe(false);
  });

  it("returns Rensselaer Biomedical Engineering degree paths with the qualified Graduate Admissions fee-waiver route", async () => {
    const caller = appRouter.createCaller(createUnauthenticatedContext());
    const paths = await Promise.all([
      caller.tracker.directory.bySlug({ slug: "rpi-biomedical-engineering-phd" }),
      caller.tracker.directory.bySlug({ slug: "rpi-biomedical-engineering-ms" }),
    ]);
    for (const program of paths) {
      expect(program?.applicationGuidance).toEqual(expect.arrayContaining([
        expect.objectContaining({
          guidanceType: "fee_waiver_contact",
          destinationUrl: "mailto:gradadmissions@rpi.edu",
          details: expect.stringContaining("non-matriculating"),
          verificationPasses: 3,
        }),
      ]));
    }
  });

  it("returns Delaware Quantitative Systems Pharmacology M.S. with the qualified Graduate Admissions fee-waiver route", async () => {
    const caller = appRouter.createCaller(createUnauthenticatedContext());
    const program = await caller.tracker.directory.bySlug({ slug: "university-delaware-quantitative-systems-pharmacology-ms" });

    expect(program?.applicationGuidance).toEqual(expect.arrayContaining([
      expect.objectContaining({
        guidanceType: "fee_waiver_contact",
        destinationUrl: "https://www.udel.edu/academics/colleges/grad/prospective-students/programs/quantitative-systems-pharmacology/",
        details: expect.stringContaining("Bridge to the Doctorate"),
        verificationPasses: 3,
      }),
    ]));
  });

  it("returns UIC Biomedical Engineering degree paths with the qualified central fee-waiver route while keeping Research Engagement doctoral-only", async () => {
    const caller = appRouter.createCaller(createUnauthenticatedContext());
    const phd = await caller.tracker.directory.bySlug({ slug: "university-illinois-chicago-biomedical-engineering-phd" });
    const masters = await caller.tracker.directory.bySlug({ slug: "university-illinois-chicago-biomedical-engineering-ms" });

    expect(phd?.applicationGuidance).toEqual(expect.arrayContaining([
      expect.objectContaining({
        guidanceType: "fee_waiver_form",
        destinationUrl: "https://admissions.uic.edu/graduate-professional/application-process/application-fee-waivers",
        details: expect.stringContaining("Research Engagement Program"),
        verificationPasses: 3,
      }),
    ]));
    expect(masters?.applicationGuidance).toEqual(expect.arrayContaining([
      expect.objectContaining({
        guidanceType: "fee_waiver_form",
        destinationUrl: "https://admissions.uic.edu/graduate-professional/application-process/application-fee-waivers",
        details: expect.stringContaining("not represented for this M.S. path"),
        verificationPasses: 3,
      }),
    ]));
  });

  it("returns Louisville Bioengineering degree paths with the qualified Graduate School fee-waiver route", async () => {
    const caller = appRouter.createCaller(createUnauthenticatedContext());
    const paths = await Promise.all([
      caller.tracker.directory.bySlug({ slug: "university-louisville-translational-bioengineering-phd" }),
      caller.tracker.directory.bySlug({ slug: "university-louisville-bioengineering-ms" }),
    ]);
    for (const program of paths) {
      expect(program?.applicationGuidance).toEqual(expect.arrayContaining([
        expect.objectContaining({
          guidanceType: "fee_waiver_form",
          destinationUrl: "https://apply.graduate.louisville.edu/portal/status",
          details: expect.stringContaining("military-connected"),
          verificationPasses: 3,
        }),
      ]));
    }
  });

  it("returns Illinois Tech Biomedical Engineering degree paths with the qualified current-student and alumni fee-waiver route", async () => {
    const caller = appRouter.createCaller(createUnauthenticatedContext());
    const paths = await Promise.all([
      caller.tracker.directory.bySlug({ slug: "illinois-tech-biomedical-engineering-phd" }),
      caller.tracker.directory.bySlug({ slug: "illinois-tech-biomedical-engineering-ms" }),
    ]);
    for (const program of paths) {
      expect(program?.applicationGuidance).toEqual(expect.arrayContaining([
        expect.objectContaining({
          guidanceType: "fee_waiver_form",
          destinationUrl: "https://apply.illinoistech.edu/apply/",
          details: expect.stringContaining("enrollment-history"),
          verificationPasses: 3,
        }),
      ]));
    }
  });

  it("returns CU Boulder Biomedical Engineering’s qualified Fall 2027 doctoral fee-waiver without copying it to the M.S.", async () => {
    const caller = appRouter.createCaller(createUnauthenticatedContext());
    const phd = await caller.tracker.directory.bySlug({ slug: "cu-boulder-biomedical-engineering-phd" });
    const masters = await caller.tracker.directory.bySlug({ slug: "cu-boulder-biomedical-engineering-ms" });

    expect(phd?.applicationGuidance).toEqual(expect.arrayContaining([
      expect.objectContaining({
        guidanceType: "fee_waiver_form",
        destinationUrl: "https://www.colorado.edu/engineering/admissions/graduate-students/graduate-application-fee-waiver",
        details: expect.stringContaining("November 15, 2026"),
        verificationPasses: 3,
      }),
    ]));
    expect(masters?.applicationGuidance.some((guide) => guide.guidanceType.startsWith("fee_waiver_"))).toBe(false);
  });

  it("returns Purdue Biomedical Engineering Ph.D. and thesis M.S. with the current virtual-showcase fee-waiver route", async () => {
    const caller = appRouter.createCaller(createUnauthenticatedContext());
    const paths = await Promise.all([
      caller.tracker.directory.bySlug({ slug: "purdue-biomedical-engineering-phd" }),
      caller.tracker.directory.bySlug({ slug: "purdue-biomedical-engineering-ms-thesis" }),
    ]);

    for (const program of paths) {
      expect(program?.applicationGuidance).toEqual(expect.arrayContaining([
        expect.objectContaining({
          guidanceType: "fee_waiver_session",
          destinationUrl: "https://engineering.purdue.edu/Engr/Academics/Graduate/graduate-showcase",
          details: expect.stringContaining("October 12, 2026"),
          verificationPasses: 3,
        }),
      ]));
    }
  });

  it("returns Penn State Biomedical Engineering Ph.D. and thesis M.S. with the qualified Engineering recruitment-program fee-waiver contact", async () => {
    const caller = appRouter.createCaller(createUnauthenticatedContext());
    const paths = await Promise.all([
      caller.tracker.directory.bySlug({ slug: "penn-state-biomedical-engineering-phd" }),
      caller.tracker.directory.bySlug({ slug: "penn-state-biomedical-engineering-thesis-ms" }),
    ]);

    for (const program of paths) {
      expect(program?.applicationGuidance).toEqual(expect.arrayContaining([
        expect.objectContaining({
          guidanceType: "fee_waiver_contact",
          destinationUrl: "mailto:gradfeewaivers@engr.psu.edu",
          details: expect.stringContaining("Center for Engineering Outreach & Inclusion"),
          verificationPasses: 3,
        }),
      ]));
    }
  });

  it("returns CU Denver Biomedical Engineering Ph.D. and M.S. with the qualified central fee-waiver request", async () => {
    const caller = appRouter.createCaller(createUnauthenticatedContext());
    const paths = await Promise.all([
      caller.tracker.directory.bySlug({ slug: "cu-denver-biomedical-engineering-phd" }),
      caller.tracker.directory.bySlug({ slug: "cu-denver-biomedical-engineering-ms" }),
    ]);

    for (const program of paths) {
      expect(program?.applicationGuidance).toEqual(expect.arrayContaining([
        expect.objectContaining({
          guidanceType: "fee_waiver_form",
          destinationUrl: "https://www.cudenver.edu/graduate-admissions/before-you-apply/requirements",
          details: expect.stringContaining("3–5 business days"),
          verificationPasses: 3,
        }),
      ]));
    }
  });

  it("returns Michigan’s AMPED medical-product engineering M.Eng. with limited Rackham waiver guidance", async () => {
    const caller = appRouter.createCaller(createUnauthenticatedContext());
    const program = await caller.tracker.directory.bySlug({ slug: "university-michigan-amped-meng" });

    expect(program?.applicationFeeDisplay).toContain("US$75 U.S. citizens/permanent residents");
    expect(program?.grePolicy).toBe("Not required");
    expect(program?.duolingoPolicy).toBe("Duolingo is not listed among Rackham and BME’s stated graduate English-proficiency tests.");
    expect(program?.fundingStatus).toBe("available");
    expect(program?.campusImageCredit).toBe("University of Michigan Biomedical Engineering");
    expect(program?.applicationGuidance).toEqual(expect.arrayContaining([
      expect.objectContaining({
        guidanceType: "fee_waiver_form",
        destinationUrl: "https://rackham.umich.edu/admissions/applying/application-fee-and-payment/",
        details: expect.stringContaining("Student Aid Index"),
      }),
    ]));
  });

  it("returns Illinois Tech’s Medical Devices and Biomaterials M.S. with current-student waiver guidance", async () => {
    const caller = appRouter.createCaller(createUnauthenticatedContext());
    const program = await caller.tracker.directory.bySlug({ slug: "illinois-tech-medical-devices-biomaterials-ms" });

    expect(program?.applicationFeeDisplay).toContain("US$100 graduate application fee");
    expect(program?.grePolicy).toContain("Required: composite 300");
    expect(program?.englishTestPolicy).toContain("TOEFL iBT 80");
    expect(program?.duolingoPolicy).toBe("Duolingo English Test 115");
    expect(program?.fundingStatus).toBe("available");
    expect(program?.campusImageCredit).toBe("Illinois Institute of Technology Biomedical Engineering");
    expect(program?.applicationGuidance).toEqual(expect.arrayContaining([
      expect.objectContaining({
        guidanceType: "fee_waiver_form",
        details: expect.stringContaining("current students and alumni"),
      }),
    ]));
  });

  it("returns Saint Louis University’s distinct Biomedical Engineering M.S. with its Ph.D. sibling and source-safe admissions fields", async () => {
    const caller = appRouter.createCaller(createUnauthenticatedContext());
    const program = await caller.tracker.directory.bySlug({ slug: "saint-louis-university-biomedical-engineering-ms" });
    const doctorate = await caller.tracker.directory.bySlug({ slug: "saint-louis-university-biomedical-engineering-phd" });

    expect(program?.applicationFeeDisplay).toBe("No application fee through the direct SLU graduate application");
    expect(program?.applicationUrl).toBe("https://gradapply.slu.edu/apply/");
    expect(program?.duolingoPolicy).toContain("110");
    expect(program?.grePolicy).toBeNull();
    expect(program?.deadlines).toEqual([]);
    expect(program?.fundingStatus).toBe("available");
    expect(program?.campusImageCredit).toBe("Saint Louis University Biomedical Engineering");
    expect(program?.degreeOptions).toEqual(expect.arrayContaining([
      expect.objectContaining({ slug: "saint-louis-university-biomedical-engineering-phd", degreeType: "phd" }),
    ]));
    expect(doctorate?.duolingoPolicy).toBe("SLU baseline: Duolingo 110; graduate programs may set higher minimums.");
  });

  it("returns SDSU’s Bioengineering M.S. and joint doctoral pathways without merging their admissions rules", async () => {
    const caller = appRouter.createCaller(createUnauthenticatedContext());
    const masters = await caller.tracker.directory.bySlug({ slug: "san-diego-state-bioengineering-ms" });
    const doctorate = await caller.tracker.directory.bySlug({ slug: "san-diego-state-joint-engineering-science-bioengineering-phd" });

    expect(masters?.applicationFeeDisplay).toBe("US$70 non-refundable Cal State Apply fee");
    expect(masters?.duolingoPolicy).toContain("105");
    expect(masters?.fundingStatus).toBe("not_stated");
    expect(masters?.applicationGuidance).toEqual(expect.arrayContaining([
      expect.objectContaining({ guidanceType: "fee_waiver_contact", destinationUrl: "mailto:admissions@sdsu.edu" }),
    ]));

    expect(doctorate?.applicationFeeDisplay).toContain("UC San Diego JDP application fee waived");
    expect(doctorate?.grePolicy).toContain("Not required");
    expect(doctorate?.duolingoPolicy).toBe("Not accepted for the Engineering Joint Doctoral Program.");
    expect(doctorate?.fundingStatus).toBe("available");
    expect(doctorate?.deadlines[0]?.deadlineLabel).toContain("December 1, 2026");
    expect(doctorate?.degreeOptions).toEqual(expect.arrayContaining([
      expect.objectContaining({ slug: "san-diego-state-bioengineering-ms", degreeType: "masters" }),
    ]));
  });

  it("returns UTEP’s separate Biomedical Engineering M.S. and Ph.D. with source-bounded shared policy evidence", async () => {
    const caller = appRouter.createCaller(createUnauthenticatedContext());
    const masters = await caller.tracker.directory.bySlug({ slug: "utep-biomedical-engineering-ms" });
    const doctorate = await caller.tracker.directory.bySlug({ slug: "utep-biomedical-engineering-phd" });

    expect(masters?.applicationFeeDisplay).toContain("US$45");
    expect(masters?.applicationFeeDisplay).toContain("US$80");
    expect(masters?.grePolicy).toBe("Optional; scores may be considered as part of review.");
    expect(masters?.duolingoPolicy).toContain("110");
    expect(masters?.fundingStatus).toBe("not_stated");
    expect(masters?.deadlines).toEqual(expect.arrayContaining([
      expect.objectContaining({ deadlineLabel: "Fall 2027 final deadline: June 30, 2027" }),
    ]));

    expect(doctorate?.deadlines).toEqual(expect.arrayContaining([
      expect.objectContaining({ deadlineLabel: "Fall 2027 final deadline: July 1, 2027" }),
    ]));
    expect(doctorate?.degreeOptions).toEqual(expect.arrayContaining([
      expect.objectContaining({ slug: "utep-biomedical-engineering-ms", degreeType: "masters" }),
    ]));
  });

  it("returns UTA and Oregon State profiles with source-bounded current central Duolingo policies", async () => {
    const caller = appRouter.createCaller(createUnauthenticatedContext());
    const uta = await caller.tracker.directory.bySlug({ slug: "ut-arlington-biomedical-engineering-phd" });
    const osu = await caller.tracker.directory.bySlug({ slug: "oregon-state-bioengineering-meng" });

    expect(uta?.duolingoPolicy).toBe("UTA central graduate baseline: Duolingo 100; programs may require or prefer higher English scores.");
    expect(osu?.duolingoPolicy).toContain("Duolingo 110 with subscores");
    expect(osu?.duolingoPolicy).toContain("programs may require higher scores");
    expect(osu?.duolingoPolicy).toContain("GTA funding review is case by case");
  });

  it("returns UT Austin Biomedical Engineering Ph.D. with the current Graduate School DET policy", async () => {
    const caller = appRouter.createCaller(createUnauthenticatedContext());
    const program = await caller.tracker.directory.bySlug({ slug: "ut-austin-biomedical-engineering-phd" });

    expect(program?.duolingoPolicy).toBe("UT Austin Graduate School accepts DET 115 overall; consult Biomedical Engineering for any preferred test.");
  });

  it("returns University of Kentucky Biomedical Engineering degree paths with the Graduate School DET baseline", async () => {
    const caller = appRouter.createCaller(createUnauthenticatedContext());
    const masters = await caller.tracker.directory.bySlug({ slug: "university-kentucky-biomedical-engineering-ms" });
    const doctorate = await caller.tracker.directory.bySlug({ slug: "university-kentucky-biomedical-engineering-phd" });

    for (const program of [masters, doctorate]) {
      expect(program?.duolingoPolicy).toBe("UK Graduate School: Duolingo 115; score may be evaluated by an ESL professional.");
    }
  });

  it("returns University of Iowa Biomedical Engineering degree paths with the central DET baseline and BME TOEFL caveat", async () => {
    const caller = appRouter.createCaller(createUnauthenticatedContext());
    const masters = await caller.tracker.directory.bySlug({ slug: "university-iowa-biomedical-engineering-ms" });
    const doctorate = await caller.tracker.directory.bySlug({ slug: "university-iowa-biomedical-engineering-phd" });

    for (const program of [masters, doctorate]) {
      expect(program?.duolingoPolicy).toBe("Iowa Graduate Admissions: DET 120+; BME publishes TOEFL 85 but no separate DET cutoff. DET admits require on-campus EPE.");
      expect(program?.englishTestPolicy).toContain("TOEFL iBT 85");
    }
  });

  it("returns University of Minnesota Medical Device Innovation M.S. with the Graduate School’s cycle-specific DET policy", async () => {
    const caller = appRouter.createCaller(createUnauthenticatedContext());
    const program = await caller.tracker.directory.bySlug({ slug: "university-minnesota-medical-device-innovation-ms" });

    expect(program?.duolingoPolicy).toBe("UMN Graduate School: DET 115 overall/writing/reading through Summer 2027; 120 effective Fall 2027. Scores valid two years; program may require more.");
  });

  it("returns UC Davis Medical Device Development M.Eng. with its directly stated Duolingo requirement", async () => {
    const caller = appRouter.createCaller(createUnauthenticatedContext());
    const program = await caller.tracker.directory.bySlug({ slug: "uc-davis-medical-device-development-meng" });

    expect(program?.duolingoPolicy).toBe("UC Davis Medical Device Development: Duolingo 115 minimum. Sole-DET admits must take TOEP; further English testing/coursework may follow.");
  });

  it("returns the UMass joint BMEBT degree family with the UMass Dartmouth-hosted Duolingo policy", async () => {
    const caller = appRouter.createCaller(createUnauthenticatedContext());
    const masters = await caller.tracker.directory.bySlug({ slug: "umass-joint-biomedical-engineering-biotechnology-ms" });
    const doctorate = await caller.tracker.directory.bySlug({ slug: "umass-joint-biomedical-engineering-biotechnology-phd" });

    for (const program of [masters, doctorate]) {
      expect(program?.duolingoPolicy).toBe("UMass Dartmouth-hosted application policy: most programs accept Duolingo 95; confirm BMEBT program-specific requirements.");
    }
  });

  it("returns University of Nebraska Biomedical Engineering Ph.D. with the current Graduate Studies DET policy", async () => {
    const caller = appRouter.createCaller(createUnauthenticatedContext());
    const program = await caller.tracker.directory.bySlug({ slug: "university-nebraska-biomedical-engineering-phd" });

    expect(program?.duolingoPolicy).toBe("UNL Graduate Studies: DET 120 for test dates through Dec. 31, 2026; scores valid two years. Departments may require more; low writing may require ESL 887.");
  });

  it("returns UNLV Biomedical Engineering M.S. with the current all-colleges DET standard", async () => {
    const caller = appRouter.createCaller(createUnauthenticatedContext());
    const program = await caller.tracker.directory.bySlug({ slug: "university-nevada-las-vegas-biomedical-engineering-ms" });

    expect(program?.duolingoPolicy).toBe("UNLV Graduate College: DET 105 minimum with no band below 100; scores must be under two years old at application.");
  });

  it("returns University of Tennessee Knoxville Biomedical Engineering Ph.D. with the Graduate School DET baseline", async () => {
    const caller = appRouter.createCaller(createUnauthenticatedContext());
    const program = await caller.tracker.directory.bySlug({ slug: "university-tennessee-knoxville-biomedical-engineering-phd" });

    expect(program?.duolingoPolicy).toBe("UT Knoxville Graduate School: DET 120 overall; scores valid two years. Programs may require more rigorous English standards.");
  });

  it("allows direct access to the single-owner personal application workspace", async () => {
    const caller = appRouter.createCaller(createUnauthenticatedContext());

    await expect(caller.tracker.applications.list()).resolves.toEqual(expect.any(Array));
  });

  it("returns UMass Lowell’s direct Biomedical Engineering Ph.D. with qualified doctoral support", async () => {
    const caller = appRouter.createCaller(createUnauthenticatedContext());
    const program = await caller.tracker.directory.bySlug({ slug: "umass-lowell-biomedical-engineering-phd" });

    expect(program?.programName).toBe("Ph.D. in Engineering, Biomedical Engineering");
    expect(program?.applicationFeeDisplay).toBe("US$75");
    expect(program?.applicationUrl).toContain("EngineeringCAS2027");
    expect(program?.grePolicy).toBe("Required for Ph.D. applicants.");
    expect(program?.duolingoPolicy).toBe("DET 115+ when English proficiency is required.");
    expect(program?.fundingStatus).toBe("available");
    expect(program?.deadlines).toEqual([]);
    expect(program?.campusImageCredit).toContain("UMass Lowell Biomedical Engineering & Biotechnology Program");
  });

  it("returns UMass Lowell’s distinct joint BMEBT master’s profile without resolving conflicting official GRE evidence", async () => {
    const caller = appRouter.createCaller(createUnauthenticatedContext());
    const program = await caller.tracker.directory.bySlug({ slug: "umass-lowell-biomedical-engineering-biotechnology-ms" });

    expect(program?.applicationFeeDisplay).toBe("US$75");
    expect(program?.grePolicy).toContain("Official sources conflict");
    expect(program?.englishTestPolicy).toContain("TOEFL or IELTS");
    expect(program?.duolingoPolicy).toBeNull();
    expect(program?.fundingStatus).toBe("available");
    expect(program?.deadlines).toEqual([]);
    expect(program?.degreeOptions).toEqual(expect.arrayContaining([
      expect.objectContaining({ slug: "umass-lowell-biomedical-engineering-phd", degreeType: "phd" }),
    ]));
  });
});
