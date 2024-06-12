import { getSession, withApiAuthRequired } from "@auth0/nextjs-auth0";
import { NextRequest } from "next/server";
import postgres, { Row } from "postgres";

import SentimentAlyze from "app/sentiment-alyze";

import { Moments } from "../../types";

const sA = SentimentAlyze();

async function getData(
  email: string,
  year: string,
  month: string | null,
  date: string | null
) {
  const sql = postgres(process.env.DB_URI || "", {
    password: process.env.DB_PASSWORD,
    ssl: {
      rejectUnauthorized: false,
    },
  });
  const data =
    await sql`SELECT * FROM moment WHERE journalist_id IN (SELECT journalist_id FROM journalist WHERE email = ${email}) AND year = ${year} ${
      month ? sql`AND month = ${month}` : sql``
    } ${date ? sql`AND date = ${date}` : sql``} ORDER BY month ASC`;
  sql.end();
  return data;
}

export const GET = withApiAuthRequired(async (request: NextRequest) => {
  const year = request.nextUrl.searchParams.get("year");
  const month = request.nextUrl.searchParams.get("month");
  const date = request.nextUrl.searchParams.get("date");
  const session = await getSession();
  if (!year || !session) {
    return Response.json(
      {},
      { status: 500, statusText: "Year or session not included" }
    );
  }
  const data = await getData(session.user.email, year, month, date);
  let results: Moments = {};
  data.forEach((v: Row) => {
    if (!results[v.month]) {
      const tfidf = sA.termFrequency(v.moment);
      const mostImportantWords = Object.entries(tfidf)
        .sort((a, b) => {
          if (a[1] < b[1]) return 1;
          if (a[1] === b[1]) return 0;
          return -1;
        })
        .map(([term]) => term)
        .slice(0, 5);
      results[v.month] = {
        minScore: v.score,
        maxScore: v.score,
        moments: {
          all: [v.moment],
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
        mostImportantWords,
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
      const allMoments = [...moments.all, v.moment];
      const tfidf = sA.tfidf(allMoments);
      const mostImportantWords = Object.entries(tfidf)
        .map(([word, vectors]) => {
          return {
            word,
            score: vectors.reduce((p, c) => p + c, 0),
          };
        })
        .sort((a, b) => {
          if (a.score >= b.score) {
            return a.score;
          }
          return b.score;
        })
        .map(({ word }) => word)
        .slice(0, 5);
      results[v.month] = {
        minScore: month.minScore < v.score ? month.minScore : v.score,
        maxScore: month.maxScore > v.score ? month.maxScore : v.score,
        moments: {
          ...moments,
          all: allMoments,
          [v.date]: momentsForDate ? [...momentsForDate, moment] : [moment],
        },
        mostImportantWords,
      };
    }
  });
  return Response.json(results, { status: 200 });
});
