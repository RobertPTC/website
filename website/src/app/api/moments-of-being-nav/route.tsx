import { withApiAuthRequired, getSession } from "@auth0/nextjs-auth0";
import { NextRequest } from "next/server";
import postgres from "postgres";

export const GET = withApiAuthRequired(async (request: NextRequest) => {
  const session = await getSession();
  console.log("session ", session);
  const sql = postgres(process.env.DB_URI || "", {
    password: process.env.DB_PASSWORD,
    ssl: {
      rejectUnauthorized: false,
    },
  });
  return Response.json({}, { status: 200 });
});
