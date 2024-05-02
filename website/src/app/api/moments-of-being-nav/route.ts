import { withApiAuthRequired, getSession } from "@auth0/nextjs-auth0";
import { NextRequest } from "next/server";
import postgres from "postgres";

import { MomentNav } from "../types";

export const GET = withApiAuthRequired(async (request: NextRequest) => {
  const session = await getSession();
  const sql = postgres(process.env.DB_URI || "", {
    password: process.env.DB_PASSWORD,
    ssl: {
      rejectUnauthorized: false,
    },
  });
  const data =
    await sql`SELECT DISTINCT year FROM moment WHERE journalist_id IN (SELECT journalist_id FROM journalist WHERE email = ${session?.user.email}) ORDER BY year DESC`;
  sql.end();
  console.log("data ", data);
  const result = data.map((v) => v.year);
  console.log("data ", data);
  return Response.json(result, { status: 200 });
});
