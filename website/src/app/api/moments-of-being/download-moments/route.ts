import fs from "fs";
import { spawn } from "node:child_process";

import { NextRequest, NextResponse } from "next/server";

import getJWTPayload from "@app/authentication/get-jwt-payload";
import withJWT from "@app/authentication/with-jwt";
import { jwtSession } from "@app/cookies";
import Database, { db } from "@app/db";
import dependencyInjector from "@app/dependency-injector";
import MemoryCache, { memoryCache } from "@app/memory-cache";

const withServices = dependencyInjector(
  async (
    memoryCache: MemoryCache,
    db: Database,
    req: NextRequest | undefined
  ) => {
    try {
      if (!req) {
        throw new Error("no jwt");
      }
      const jwt = req.cookies.get(jwtSession);
      const jwtPayload = getJWTPayload(jwt?.value || "");
      const email = await memoryCache.getEmailForSessionID(
        jwtPayload?.sub || ""
      );
      if (!email) {
        throw new Error("no email");
      }
      const data = await db.getMoments(email);
      if (!data) {
        throw new Error("no data");
      }
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
      return new Promise((resolve, reject) => {
        fs.writeFile("moments.html", htmlTemplate, "utf8", () => {
          const wkhtmltopdf = spawn("wkhtmltopdf", [
            "moments.html",
            "moments.pdf",
          ]);
          wkhtmltopdf.on("close", (code) => {
            fs.readFile("moments.pdf", (err, data) => {
              if (err) {
                reject("error reading file");
                return;
              }
              const base64 = data.toString("base64");
              resolve(
                NextResponse.json(
                  { pdfDataURI: `data:application/pdf;base64,${base64}` },
                  { status: 200 }
                )
              );
            });
          });
        });
      });
    } catch (error) {
      return NextResponse.json({}, { status: 500 });
    }
  },
  memoryCache,
  db
);

export const POST = withJWT(withServices);
