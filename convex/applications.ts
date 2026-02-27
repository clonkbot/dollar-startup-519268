import { query, mutation } from "./_generated/server";
import { v } from "convex/values";
import { getAuthUserId } from "@convex-dev/auth/server";

export const submit = mutation({
  args: {
    name: v.string(),
    email: v.string(),
    twitterHandle: v.string(),
    experience: v.string(),
    projectIdea: v.string(),
    whyYou: v.string(),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);

    // Check if email already applied
    const existing = await ctx.db
      .query("applications")
      .withIndex("by_email", (q) => q.eq("email", args.email))
      .first();

    if (existing) {
      throw new Error("You've already submitted an application with this email.");
    }

    return await ctx.db.insert("applications", {
      ...args,
      userId: userId ?? undefined,
      createdAt: Date.now(),
      status: "pending",
    });
  },
});

export const getStats = query({
  args: {},
  handler: async (ctx) => {
    const all = await ctx.db.query("applications").collect();
    return {
      total: all.length,
      pending: all.filter((a) => a.status === "pending").length,
      accepted: all.filter((a) => a.status === "accepted").length,
    };
  },
});

export const checkExisting = query({
  args: { email: v.string() },
  handler: async (ctx, args) => {
    if (!args.email) return null;
    const existing = await ctx.db
      .query("applications")
      .withIndex("by_email", (q) => q.eq("email", args.email))
      .first();
    return existing ? { status: existing.status, createdAt: existing.createdAt } : null;
  },
});
