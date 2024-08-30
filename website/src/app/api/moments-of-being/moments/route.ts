import { NextRequest, NextResponse } from "next/server";

import getJWTPayload from "@app/authentication/get-jwt-payload";
import withJWT from "@app/authentication/with-jwt";
import { jwtSession } from "@app/cookies";
import Database, { db } from "@app/db";
import dependencyInjector from "@app/dependency-injector";
import MemoryCache, { memoryCache } from "@app/memory-cache";
import SentimentAlyze from "@app/sentiment-alyze";

import { Moments, Moment } from "../../types";

const withServiceGetMoments = dependencyInjector(
  async (
    memoryCache: MemoryCache,
    db: Database,
    req: NextRequest | undefined
  ) => {
    if (!req) {
      return NextResponse.json({}, { status: 401 });
    }
    try {
      const jwt = req.cookies.get(jwtSession);
      const jwtPayload = getJWTPayload(jwt?.value || "");
      const email = await memoryCache.getEmailForSessionID(
        jwtPayload?.sub || ""
      );
      if (!email) {
        throw new Error("no email");
      }
      const year = req.nextUrl.searchParams.get("year");
      const month = req.nextUrl.searchParams.get("month");
      const date = req.nextUrl.searchParams.get("date");
      const moments = await db.getMoments(email, year, month, date);
      if (!moments) {
        throw new Error("no moments");
      }
      const sA = SentimentAlyze();
      let results: Moments = {};
      moments.forEach((v: Moment) => {
        if (!results[v.month]) {
          const termFrequency = sA.termFrequency(v.moment);
          const mostImportantWords = Object.entries(termFrequency)
            .sort((a, b) => {
              return b[1] - a[1];
            })
            .map(([term]) => term)
            .slice(0, 5);
          results[v.month] = {
            minScore: v.score,
            maxScore: v.score,
            moments: {
              all: [
                {
                  moment: v.moment,
                  moment_id: v.moment_id,
                  date_string: v.date_string,
                },
              ],
              [Number(v.date)]: [
                {
                  moment: v.moment,
                  date: v.date,
                  date_string: v.date_string,
                  year: v.year,
                  month: v.month,
                  score: v.score,
                  moment_id: v.moment_id,
                },
              ],
            },
            mostImportantWords,
          };
          return;
        }
        if (results[v.month]) {
          const moments = results[v.month]["moments"];
          const momentsForDate = moments[Number(v.date)];
          const month = results[v.month];
          const moment: Moment = {
            moment: v.moment,
            date: v.date,
            date_string: v.date_string,
            year: v.year,
            month: v.month,
            score: v.score,
            moment_id: v.moment_id,
          };
          const allMoments = [
            ...moments.all,
            {
              moment: v.moment,
              moment_id: v.moment_id,
              date_string: v.date_string,
            },
          ];
          const tfidf = sA.tfidf(allMoments.map((m) => m.moment));
          const mostImportantWords = Object.entries(tfidf)
            .map(([word, vectors]) => {
              return {
                word,
                score: vectors.reduce((p, c) => p + c, 0),
              };
            })
            .sort((a, b) => {
              return b.score - a.score;
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
      return NextResponse.json(results, { status: 200 });
    } catch (error) {
      console.log("error ", error);
      return NextResponse.json({}, { status: 500 });
    }
  },
  memoryCache,
  db
);

export const GET = withJWT(withServiceGetMoments);
