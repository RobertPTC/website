import fs from "fs";
import { spawn } from "node:child_process";

import { getSession } from "@auth0/nextjs-auth0";
import { NextRequest } from "next/server";
import { Row } from "postgres";

import SentimentAlyze from "sentiment-alyze";

import sql from "../../../db";
import getMoments from "../../../db/get-moments";
import { Moment, Moments, UpdateMoment } from "../types";

interface MomentsOfBeing {
  CreateMoment(req: NextRequest): Promise<Response>;
  DownloadMoments(req: NextRequest): Promise<Response>;
  Moments(req: NextRequest): Promise<Response>;
  UpdateMoment(req: NextRequest): Promise<Response>;
  GetNav(req: NextRequest): Promise<Response>;
}

const sA = SentimentAlyze();
// TODO create interface for DB
function MomentsOfBeing(): MomentsOfBeing {
  return {
    CreateMoment(req) {
      return req.json().then(async (json: Moment) => {
        if (!sql) {
          return Response.json(
            {},
            { status: 500, statusText: "SQL not instantiated" }
          );
        }
        try {
          const sA = SentimentAlyze();
          const values = {
            ...json,
            score: sA.analyze(json.moment).comparative,
          };
          const res = await sql`
                    INSERT INTO moment ${sql(values)} RETURNING moment_id;
                `;

          return Response.json({ id: res[0].moment_id }, { status: 200 });
        } catch (e) {
          return Response.json({}, { status: 500 });
        }
      });
    },
    async DownloadMoments() {
      return new Promise(async (resolve, reject) => {
        const session = await getSession();
        if (!session || !sql) {
          return Response.json(
            {},
            { status: 500, statusText: "Session not included" }
          );
        }
        const data = await getMoments(session.user.email, sql);
        const moments = data
          .map((v) => {
            return `<div>
                    <h2>${v.date_string}</h2>
                    <p>${v.moment}</p>
            </div>`;
          })
          .join("");
        const htmlTemplate = `
        <!DOCTYPE html>
        <html>
            <body>
                <main>
                   ${moments}
                </main>
            </body>
        </html>`;
        fs.writeFile("moments.html", htmlTemplate, "utf8", () => {
          const wkhtmltopdf = spawn("wkhtmltopdf", [
            "moments.html",
            "moments.pdf",
          ]);
          wkhtmltopdf.on("close", (code) => {
            fs.readFile("moments.pdf", (err, data) => {
              if (err) {
                reject(Response.json({}, { status: 500 }));
                return;
              }
              const base64 = data.toString("base64");
              resolve(
                Response.json(
                  { pdfDataURI: `data:application/pdf;base64,${base64}` },
                  { status: 200 }
                )
              );
            });
          });
        });
      });
    },
    async Moments(req) {
      const year = req.nextUrl.searchParams.get("year");
      const month = req.nextUrl.searchParams.get("month");
      const date = req.nextUrl.searchParams.get("date");
      const session = await getSession();
      if (!year || !session || !sql) {
        return Response.json(
          {},
          { status: 500, statusText: "Year or session not included" }
        );
      }
      const data = await getMoments(session.user.email, sql, year, month, date);
      let results: Moments = {};
      data.forEach((v: Row) => {
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
                  id: v.moment_id,
                  date_string: v.date_string,
                },
              ],
              [v.date]: [
                {
                  moment: v.moment,
                  date: v.date,
                  date_string: v.date_string,
                  year: v.year,
                  month: v.month,
                  score: v.score,
                  id: v.moment_id,
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
          const moment: Moment = {
            moment: v.moment,
            date: v.date,
            date_string: v.date_string,
            year: v.year,
            month: v.month,
            score: v.score,
            id: v.moment_id,
          };
          const allMoments = [
            ...moments.all,
            { moment: v.moment, id: v.moment_id, date_string: v.date_string },
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
      return Response.json(results, { status: 200 });
    },
    UpdateMoment(req) {
      return req.json().then(async (json: UpdateMoment) => {
        if (!sql) {
          return Response.json(
            {},
            { status: 500, statusText: "SQL not instantiated" }
          );
        }
        try {
          const sA = SentimentAlyze();
          const values = {
            moment: json.moment,
            score: sA.analyze(json.moment).comparative,
          };
          await sql`
                      UPDATE moment set ${sql(values)} WHERE moment_id = ${
            json.id
          };
                  `;
          return Response.json({}, { status: 200 });
        } catch (e) {
          return Response.json({}, { status: 500 });
        }
      });
    },
    async GetNav(req) {
      const session = await getSession();
      const data =
        await sql`SELECT DISTINCT year FROM moment WHERE journalist_id IN (SELECT journalist_id FROM journalist WHERE email = ${session?.user.email}) ORDER BY year DESC`;
      const result = data.map((v) => v.year);
      return Response.json(result, { status: 200 });
    },
  };
}

const requestHandlers = MomentsOfBeing();

export default requestHandlers;
