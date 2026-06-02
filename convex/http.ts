import { httpRouter } from "convex/server";
import { httpAction } from "./_generated/server";
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
  handler: httpAction(async () => {
    return new Response(null, {
      status: 204,
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "POST, OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type",
      },
    });
  }),
});

export default http;
