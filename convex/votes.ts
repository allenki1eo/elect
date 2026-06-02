import { query, mutation } from "./_generated/server";
import { v } from "convex/values";
import { httpAction } from "./_generated/server";
import { api } from "./_generated/api";

export const getResults = query({
  args: {},
  handler: async (ctx) => {
    const candidates = await ctx.db
      .query("candidates")
      .filter((q) => q.eq(q.field("isActive"), true))
      .collect();

    const results = await Promise.all(
      candidates.map(async (c) => {
        const votes = await ctx.db
          .query("votes")
          .withIndex("by_candidateId", (q) => q.eq("candidateId", c._id))
          .collect();
        return { ...c, voteCount: votes.length };
      })
    );

    return results.sort((a, b) => b.voteCount - a.voteCount);
  },
});

export const getVoteByShareToken = query({
  args: { shareToken: v.string() },
  handler: async (ctx, args) => {
    const vote = await ctx.db
      .query("votes")
      .withIndex("by_shareToken", (q) => q.eq("shareToken", args.shareToken))
      .first();
    if (!vote) return null;
    const candidate = await ctx.db.get(vote.candidateId);
    return { vote, candidate };
  },
});

export const getTotalVotes = query({
  args: {},
  handler: async (ctx) => {
    const stat = await ctx.db
      .query("stats")
      .withIndex("by_key", (q) => q.eq("key", "total_votes"))
      .first();
    if (stat && stat.value > 0) return stat.value;
    const votes = await ctx.db.query("votes").collect();
    return votes.length;
  },
});

const corsHeaders = {
  "Content-Type": "application/json",
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type",
};

export const castVoteAction = httpAction(async (ctx, request) => {
  const body = await request.json();
  const { candidateId, voterName, voterClass, fingerprint } = body;

  const ip =
    request.headers.get("cf-connecting-ip") ||
    request.headers.get("x-forwarded-for") ||
    "unknown";

  const encoder = new TextEncoder();
  const data = encoder.encode(ip);
  const hashBuffer = await crypto.subtle.digest("SHA-256", data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  const ipHash = hashArray.map((b) => b.toString(16).padStart(2, "0")).join("");

  // Check IP
  const existingIp = await ctx.runQuery(api.votes.checkIpHash, { ipHash });
  if (existingIp) {
    return new Response(
      JSON.stringify({ error: "ALREADY_VOTED", message: "Kura yako tayari imehesabiwa!" }),
      { status: 400, headers: corsHeaders }
    );
  }

  // Check fingerprint
  const existingFp = await ctx.runQuery(api.votes.checkFingerprint, { fingerprint });
  if (existingFp) {
    return new Response(
      JSON.stringify({ error: "ALREADY_VOTED", message: "Kura yako tayari imehesabiwa!" }),
      { status: 400, headers: corsHeaders }
    );
  }

  const result = await ctx.runMutation(api.votes.insertVote, {
    candidateId,
    voterName,
    voterClass,
    ipHash,
    fingerprint,
  });

  return new Response(JSON.stringify(result), {
    status: 200,
    headers: corsHeaders,
  });
});

export const checkIpHash = query({
  args: { ipHash: v.string() },
  handler: async (ctx, args) => {
    const existing = await ctx.db
      .query("votes")
      .withIndex("by_ipHash", (q) => q.eq("ipHash", args.ipHash))
      .first();
    return !!existing;
  },
});

export const checkFingerprint = query({
  args: { fingerprint: v.string() },
  handler: async (ctx, args) => {
    const existing = await ctx.db
      .query("votes")
      .withIndex("by_fingerprint", (q) => q.eq("fingerprint", args.fingerprint))
      .first();
    return !!existing;
  },
});

export const insertVote = mutation({
  args: {
    candidateId: v.id("candidates"),
    voterName: v.string(),
    voterClass: v.string(),
    ipHash: v.string(),
    fingerprint: v.string(),
  },
  handler: async (ctx, args) => {
    const { customAlphabet } = await import("nanoid");
    const nanoid = customAlphabet("abcdefghijklmnopqrstuvwxyz0123456789", 10);
    const shareToken = nanoid();

    await ctx.db.insert("votes", {
      candidateId: args.candidateId,
      voterName: args.voterName,
      voterClass: args.voterClass,
      ipHash: args.ipHash,
      fingerprint: args.fingerprint,
      shareToken,
      createdAt: Date.now(),
    });

    // Update stats
    const stat = await ctx.db
      .query("stats")
      .withIndex("by_key", (q) => q.eq("key", "total_votes"))
      .first();
    if (stat) {
      await ctx.db.patch(stat._id, { value: stat.value + 1 });
    } else {
      await ctx.db.insert("stats", { key: "total_votes", value: 1 });
    }

    const candidate = await ctx.db.get(args.candidateId);
    return {
      success: true,
      shareToken,
      candidateName: candidate?.name,
      candidatePhotoUrl: candidate?.photoUrl,
    };
  },
});

export const getAllVotesAdmin = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db.query("votes").order("desc").collect();
  },
});

export const resetAllVotes = mutation({
  args: {},
  handler: async (ctx) => {
    const votes = await ctx.db.query("votes").collect();
    for (const v of votes) {
      await ctx.db.delete(v._id);
    }
    const stat = await ctx.db
      .query("stats")
      .withIndex("by_key", (q) => q.eq("key", "total_votes"))
      .first();
    if (stat) {
      await ctx.db.patch(stat._id, { value: 0 });
    }
  },
});
