import { httpRouter } from "convex/server";
import { castVoteAction } from "./votes";

const http = httpRouter();

http.route({
  path: "/cast-vote",
  method: "POST",
  handler: castVoteAction,
});

http.route({
  path: "/cast-vote",
  method: "OPTIONS",
  handler: async (_, request) => {
    return new Response(null, {
      status: 204,
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "POST, OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type",
      },
    });
  },
});

export default http;
