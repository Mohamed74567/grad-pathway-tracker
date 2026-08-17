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

  it("allows direct access to the single-owner personal application workspace", async () => {
    const caller = appRouter.createCaller(createUnauthenticatedContext());

    await expect(caller.tracker.applications.list()).resolves.toEqual(expect.any(Array));
  });
});
