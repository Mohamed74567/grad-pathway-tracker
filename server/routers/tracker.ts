import { z } from "zod";
import * as db from "../db";
import { protectedProcedure, publicProcedure, router } from "../_core/trpc";

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
    list: protectedProcedure.query(({ ctx }) => db.getApplicationsForUser(ctx.user.id)),
    add: protectedProcedure.input(z.object({ programId: z.number().int().positive() })).mutation(({ ctx, input }) => db.addApplication(ctx.user.id, input.programId)),
    update: protectedProcedure.input(z.object({
      applicationId: z.number().int().positive(),
      status: applicationStatus.optional(),
      priority: z.enum(["reach", "match", "safety", "undecided"]).optional(),
      targetResult: z.enum(["pending", "interview", "offer", "accepted", "rejected", "waitlisted"]).optional(),
      nextAction: z.string().max(255).optional(),
      notes: z.string().max(10000).optional(),
      primaryContactName: z.string().max(255).optional(),
      primaryContactEmail: z.string().email().max(320).or(z.literal("")).optional(),
      reminderAt: z.string().date().nullable().optional(),
    })).mutation(({ ctx, input }) => {
      const { applicationId, ...data } = input;
      return db.updateApplication(ctx.user.id, applicationId, data);
    }),
    toggleDocument: protectedProcedure.input(z.object({ documentId: z.number().int().positive(), isComplete: z.boolean() })).mutation(({ ctx, input }) => db.toggleApplicationDocument(ctx.user.id, input.documentId, input.isComplete)),
    addRecommender: protectedProcedure.input(z.object({ applicationId: z.number().int().positive() })).mutation(({ ctx, input }) => db.addRecommender(ctx.user.id, input.applicationId)),
    updateRecommender: protectedProcedure.input(z.object({
      recommenderId: z.number().int().positive(),
      name: z.string().max(255).optional(),
      email: z.string().email().max(320).or(z.literal("")).optional(),
      status: z.enum(["not_requested", "requested", "received"]).optional(),
      dueDate: z.string().date().nullable().optional(),
    })).mutation(({ ctx, input }) => {
      const { recommenderId, ...data } = input;
      return db.updateRecommender(ctx.user.id, recommenderId, data);
    }),
  }),
  legacy: router({
    list: protectedProcedure.query(({ ctx }) => ctx.user.role === "admin" ? db.getLegacyApplicationRecords() : []),
  }),
});
