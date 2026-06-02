import { mutation } from "./_generated/server";
import { v } from "convex/values";

export const generateUploadUrl = mutation({
  args: {},
  handler: async (ctx) => {
    return await ctx.storage.generateUploadUrl();
  },
});

export const savePhotoUrl = mutation({
  args: {
    candidateId: v.id("candidates"),
    storageId: v.string(),
    url: v.string(),
  },
  handler: async (ctx, args) => {
    await ctx.db.patch(args.candidateId, {
      photoStorageId: args.storageId,
      photoUrl: args.url,
    });
  },
});
