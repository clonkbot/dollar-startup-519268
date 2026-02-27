import { defineSchema, defineTable } from "convex/server";
import { authTables } from "@convex-dev/auth/server";
import { v } from "convex/values";

export default defineSchema({
  ...authTables,
  applications: defineTable({
    name: v.string(),
    email: v.string(),
    twitterHandle: v.string(),
    experience: v.string(),
    projectIdea: v.string(),
    whyYou: v.string(),
    userId: v.optional(v.id("users")),
    createdAt: v.number(),
    status: v.string(), // "pending" | "accepted" | "rejected"
  }).index("by_email", ["email"])
    .index("by_status", ["status"])
    .index("by_created", ["createdAt"]),
});
