import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  candidates: defineTable({
    name: v.string(),
    nickname: v.string(),
    class: v.string(),
    bio: v.string(),
    photoStorageId: v.string(),
    photoUrl: v.string(),
    manifesto: v.array(v.string()),
    colorHex: v.string(),
    isActive: v.boolean(),
    order: v.number(),
  }),
  votes: defineTable({
    candidateId: v.id("candidates"),
    voterName: v.string(),
    voterClass: v.string(),
    ipHash: v.string(),
    fingerprint: v.string(),
    shareToken: v.string(),
    createdAt: v.number(),
  })
    .index("by_ipHash", ["ipHash"])
    .index("by_fingerprint", ["fingerprint"])
    .index("by_shareToken", ["shareToken"])
    .index("by_candidateId", ["candidateId"]),
  stats: defineTable({
    key: v.string(),
    value: v.number(),
  })
    .index("by_key", ["key"]),
});
