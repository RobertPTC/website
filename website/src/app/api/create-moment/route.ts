import { NextRequest } from "next/server";
import postgres from "postgres";

import SentimentAlyze from "app/sentiment-alyze";

import { Moment } from "../types";

export function POST(request: NextRequest) {
  request.json().then(async (json: Moment) => {
    const sql = postgres(process.env.DB_URI || "", {
      password: process.env.DB_PASSWORD,
      ssl: {
        rejectUnauthorized: false,
      },
    });
    try {
      const sA = SentimentAlyze();
      const values = { ...json, score: sA.analyze(json.moment).comparative };
      await sql`
            INSERT INTO moment ${sql(values)}
        `;
    } catch (e) {}
    sql.end();
  });
  return new Response("ok", { status: 200 });
}
