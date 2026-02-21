import { and, desc, eq } from "drizzle-orm";
import { z } from "zod";

import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";
import { todos } from "~/server/db/schema";

export const todoStatusSchema = z.enum(["PENDING", "IN_PROGRESS", "DONE"]);

export const todoRouter = createTRPCRouter({
  getAll: protectedProcedure.query(({ ctx }) => {
    return ctx.db
      .select()
      .from(todos)
      .where(eq(todos.userId, ctx.session.user.id))
      .orderBy(desc(todos.createdAt));
  }),

  create: protectedProcedure
    .input(
      z.object({
        title: z.string().min(1).max(256),
        description: z.string().optional(),
      })
    )
    .mutation(({ ctx, input }) => {
      return ctx.db.insert(todos).values({
        title: input.title,
        description: input.description,
        userId: ctx.session.user.id,
      });
    }),

  updateStatus: protectedProcedure
    .input(
      z.object({
        id: z.number(),
        status: todoStatusSchema,
      })
    )
    .mutation(({ ctx, input }) => {
      return ctx.db
        .update(todos)
        .set({ status: input.status })
        .where(
          and(
            eq(todos.id, input.id),
            eq(todos.userId, ctx.session.user.id)
          )
        );
    }),

  delete: protectedProcedure
    .input(z.object({ id: z.number() }))
    .mutation(({ ctx, input }) => {
      return ctx.db
        .delete(todos)
        .where(
          and(
            eq(todos.id, input.id),
            eq(todos.userId, ctx.session.user.id)
          )
        );
    }),
});
