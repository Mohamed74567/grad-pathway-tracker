import { z } from "zod";
import * as db from "../db";
import { publicProcedure, router } from "../_core/trpc";

const applicationStatus = z.enum(["researching", "applied", "interview", "offer", "accepted", "rejected"]);

export const trackerRouter = router({
  directory: router({
    list: publicProcedure.input(z.object({
      degreeTypes: z.array(z.enum(["phd", "masters"])).optional(),
      subfields: z.array(z.string()).optional(),
      states: z.array(z.string()).optional(),
      funding: z.array(z.enum(["funded", "available", "not_stated", "not_applicable"])).optional(),
      tiers: z.array(z.enum(["q1", "q2", "q3", "not_listed"])).optional(),
      search: z.string().max(120).optional(),
    }).optional()).query(({ input }) => db.getDirectoryPrograms(input)),
    facets: publicProcedure.query(() => db.getDirectoryFacets()),
    bySlug: publicProcedure.input(z.object({ slug: z.string().min(1).max(180) })).query(({ input }) => db.getProgramBySlug(input.slug)),
  }),
  applications: router({
    list: publicProcedure.query(async () => db.getApplicationsForUser((await db.getPersonalWorkspaceUser()).id)),
    add: publicProcedure.input(z.object({ programId: z.number().int().positive() })).mutation(async ({ input }) => db.addApplication((await db.getPersonalWorkspaceUser()).id, input.programId)),
    update: publicProcedure.input(z.object({
      applicationId: z.number().int().positive(),
      status: applicationStatus.optional(),
      priority: z.enum(["reach", "match", "safety", "undecided"]).optional(),
      targetResult: z.enum(["pending", "interview", "offer", "accepted", "rejected", "waitlisted"]).optional(),
      nextAction: z.string().max(255).optional(),
      notes: z.string().max(10000).optional(),
      primaryContactName: z.string().max(255).optional(),
      primaryContactEmail: z.string().email().max(320).or(z.literal("")).optional(),
      reminderAt: z.string().date().nullable().optional(),
    })).mutation(async ({ input }) => {
      const { applicationId, ...data } = input;
      return db.updateApplication((await db.getPersonalWorkspaceUser()).id, applicationId, data);
    }),
    toggleDocument: publicProcedure.input(z.object({ documentId: z.number().int().positive(), isComplete: z.boolean() })).mutation(async ({ input }) => db.toggleApplicationDocument((await db.getPersonalWorkspaceUser()).id, input.documentId, input.isComplete)),
    addRecommender: publicProcedure.input(z.object({ applicationId: z.number().int().positive() })).mutation(async ({ input }) => db.addRecommender((await db.getPersonalWorkspaceUser()).id, input.applicationId)),
    updateRecommender: publicProcedure.input(z.object({
      recommenderId: z.number().int().positive(),
      name: z.string().max(255).optional(),
      email: z.string().email().max(320).or(z.literal("")).optional(),
      status: z.enum(["not_requested", "requested", "received"]).optional(),
      dueDate: z.string().date().nullable().optional(),
    })).mutation(async ({ input }) => {
      const { recommenderId, ...data } = input;
      return db.updateRecommender((await db.getPersonalWorkspaceUser()).id, recommenderId, data);
    }),
  }),
  legacy: router({
    list: publicProcedure.query(() => db.getLegacyApplicationRecords()),
  }),
});
