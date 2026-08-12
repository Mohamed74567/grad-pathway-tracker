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
});
