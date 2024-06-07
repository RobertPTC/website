import { NextRequest } from "next/server";
import postgres from "postgres";

import { UpdateMoment } from "app/api/types";
import SentimentAlyze from "app/sentiment-alyze";

export function PUT(request: NextRequest) {
  return request.json().then(async (json: UpdateMoment) => {
    const sql = postgres(process.env.DB_URI || "", {
      password: process.env.DB_PASSWORD,
      ssl: {
        rejectUnauthorized: false,
      },
    });
    try {
      const sA = SentimentAlyze();
      const values = {
        moment: json.moment,
        score: sA.analyze(json.moment).comparative,
      };
      await sql`
              UPDATE moment set ${sql(values)} WHERE moment_id = ${json.id};
          `;
      sql.end();
      return Response.json({}, { status: 200 });
    } catch (e) {
      return Response.json({}, { status: 500 });
    }
  });
}
