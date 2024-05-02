import { getSession, withApiAuthRequired } from "@auth0/nextjs-auth0";
import { NextRequest } from "next/server";
import postgres, { Row } from "postgres";

import { Moments } from "../types";

export const GET = withApiAuthRequired(async (request: NextRequest) => {
  const year = request.nextUrl.searchParams.get("year");
  const session = await getSession();
  const sql = postgres(process.env.DB_URI || "", {
    password: process.env.DB_PASSWORD,
    ssl: {
      rejectUnauthorized: false,
    },
  });
  const data =
    await sql`SELECT * FROM moment WHERE journalist_id IN (SELECT journalist_id FROM journalist WHERE email = ${session?.user.email}) AND year = ${year} ORDER BY month ASC`;
  sql.end();
  let results: Moments = {};
  data.forEach((v: Row) => {
    if (!results[v.month]) {
      results[v.month] = {
        minScore: v.score,
        maxScore: v.score,
        moments: {
          [v.date]: [
            {
              moment: v.moment,
              date: v.date,
              date_string: v.date_string,
              year: v.year,
              month: v.month,
              score: v.score,
            },
          ],
        },
      };
      return;
    }
    if (results[v.month]) {
      const moments = results[v.month]["moments"];
      const momentsForDate = moments[v.date];
      const month = results[v.month];
      const moment = {
        moment: v.moment,
        date: v.date,
        date_string: v.date_string,
        year: v.year,
        month: v.month,
        score: v.score,
      };
      results[v.month] = {
        minScore: month.minScore < v.score ? month.minScore : v.score,
        maxScore: month.maxScore > v.score ? month.maxScore : v.score,
        moments: {
          ...moments,
          [v.date]: momentsForDate ? [...momentsForDate, moment] : [moment],
        },
      };
    }
  });
  return Response.json(results, { status: 200 });
});
