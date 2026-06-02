import { query, internalMutation } from "./_generated/server";
import { v } from "convex/values";

export const getCandidates = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db
      .query("candidates")
      .filter((q) => q.eq(q.field("isActive"), true))
      .order("asc")
      .collect()
      .then((rows) => rows.sort((a, b) => a.order - b.order));
  },
});

export const getCandidateById = query({
  args: { id: v.id("candidates") },
  handler: async (ctx, args) => {
    return await ctx.db.get(args.id);
  },
});

export const seedCandidates = internalMutation({
  args: {},
  handler: async (ctx) => {
    const existing = await ctx.db.query("candidates").collect();
    if (existing.length > 0) return;
    const candidates = [
      {
        name: "Amina Juma",
        nickname: "Team Amina",
        class: "Standard 7A",
        bio: "Bringing change and unity to our school. Every voice matters!",
        photoStorageId: "",
        photoUrl: "",
        manifesto: ["Better school lunches", "More sports days", "Cleaner classrooms"],
        colorHex: "#6C63FF",
        isActive: true,
        order: 1,
      },
      {
        name: "Brian Otieno",
        nickname: "Team Brian",
        class: "Standard 7B",
        bio: "Strong leadership for a stronger school community.",
        photoStorageId: "",
        photoUrl: "",
        manifesto: ["New library books", "Student council meetings", "Anti-bullying program"],
        colorHex: "#FF6584",
        isActive: true,
        order: 2,
      },
      {
        name: "Cynthia Mwangi",
        nickname: "Team Cynthia",
        class: "Standard 6A",
        bio: "Innovation and fun — let's make school the best place to be!",
        photoStorageId: "",
        photoUrl: "",
        manifesto: ["Science club expansion", "Music Fridays", "Tree planting initiative"],
        colorHex: "#22D3A0",
        isActive: true,
        order: 3,
      },
      {
        name: "David Kariuki",
        nickname: "Team David",
        class: "Standard 6B",
        bio: "Fairness, fun, and friendship for every student.",
        photoStorageId: "",
        photoUrl: "",
        manifesto: ["Fair rules for all", "More break time games", "Art competitions"],
        colorHex: "#F5C842",
        isActive: true,
        order: 4,
      },
    ];
    for (const c of candidates) {
      await ctx.db.insert("candidates", c);
    }
  },
});
