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

  it("returns Louisiana Tech’s verified Biomedical Engineering Ph.D. and Biomedical-track M.S.E. family", async () => {
    const caller = appRouter.createCaller(createUnauthenticatedContext());

    const doctorate = await caller.tracker.directory.bySlug({ slug: "louisiana-tech-biomedical-engineering-phd" });
    const masters = await caller.tracker.directory.bySlug({ slug: "louisiana-tech-engineering-mse-biomedical-track" });

    for (const program of [doctorate, masters]) {
      expect(program?.applicationFeeDisplay).toBe("US$40 non-refundable");
      expect(program?.applicationUrl).toBe("https://experience.latech.edu/apply");
      expect(program?.fundingStatus).toBe("available");
      expect(program?.grePolicy).toBeNull();
      expect(program?.duolingoPolicy).toBeNull();
      expect(program?.campusImageCredit).toContain("Louisiana Tech University");
    }

    expect(doctorate?.degreeOptions).toEqual(expect.arrayContaining([
      expect.objectContaining({ slug: "louisiana-tech-engineering-mse-biomedical-track", degreeType: "masters" }),
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

    for (const program of [biomedicalDoctorate, neuralMasters]) {
      expect(program?.applicationFeeDisplay).toBe("US$55 domestic / US$65 international");
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
      expect(program?.duolingoPolicy).toBeNull();
      expect(program?.campusImageCredit).toContain("The University of Akron");
    }

    expect(mse?.englishTestPolicy).toContain("TOEFL iBT 96");
    expect(mbe?.englishTestPolicy).toContain("TOEFL iBT 79");
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
      expect(program?.duolingoPolicy).toBeNull();
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
    expect(program?.duolingoPolicy).toBeNull();
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

  it("returns UMass Dartmouth’s verified BMEBT M.S. and Ph.D. family without an inferred Duolingo policy", async () => {
    const caller = appRouter.createCaller(createUnauthenticatedContext());

    const ms = await caller.tracker.directory.bySlug({ slug: "umass-dartmouth-biomedical-engineering-biotechnology-ms" });
    const phd = await caller.tracker.directory.bySlug({ slug: "umass-dartmouth-biomedical-engineering-biotechnology-phd" });

    for (const program of [ms, phd]) {
      expect(program?.applicationFeeDisplay).toBe("US$60 non-refundable");
      expect(program?.applicationUrl).toContain("apply.umassd.edu");
      expect(program?.grePolicy).toContain("waived");
      expect(program?.englishTestPolicy).toContain("TOEFL iBT 72");
      expect(program?.duolingoPolicy).toBeNull();
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

  it("returns Michigan’s AMPED medical-product engineering M.Eng. with limited Rackham waiver guidance", async () => {
    const caller = appRouter.createCaller(createUnauthenticatedContext());
    const program = await caller.tracker.directory.bySlug({ slug: "university-michigan-amped-meng" });

    expect(program?.applicationFeeDisplay).toContain("US$75 U.S. citizens/permanent residents");
    expect(program?.grePolicy).toBe("Not required");
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

  it("allows direct access to the single-owner personal application workspace", async () => {
    const caller = appRouter.createCaller(createUnauthenticatedContext());

    await expect(caller.tracker.applications.list()).resolves.toEqual(expect.any(Array));
  });
});
