import { NextRequest } from "next/server";
import postgres from "postgres";

import { Moment } from "../types";

export function POST(request: NextRequest) {
  request.json().then(async (json: Moment) => {
    console.log("json ", json);
    const sql = postgres(process.env.DB_URI || "", {
      password: process.env.DB_PASSWORD,
      ssl: {
        rejectUnauthorized: false,
      },
    });
    await sql`
        insert into moment ${sql(json)}
    `;
    sql.end();
  });
  return new Response("ok", { status: 200 });
}
