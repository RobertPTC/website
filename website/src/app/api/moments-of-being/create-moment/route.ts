import { NextRequest } from "next/server";
import postgres from "postgres";

import SentimentAlyze from "app/sentiment-alyze";

import { Moment } from "../../types";

export function POST(request: NextRequest) {
  return request.json().then(async (json: Moment) => {
    const sql = postgres(process.env.DB_URI || "", {
      password: process.env.DB_PASSWORD,
      ssl: {
        rejectUnauthorized: false,
      },
    });
    try {
      const sA = SentimentAlyze();
      const values = { ...json, score: sA.analyze(json.moment).comparative };
      const res = await sql`
            INSERT INTO moment ${sql(values)} RETURNING moment_id;
        `;
      sql.end();
      return Response.json({ id: res[0].moment_id }, { status: 200 });
    } catch (e) {
      return Response.json({}, { status: 500 });
    }
  });
}
