import { NextRequest, NextResponse } from "next/server";

import withJWT from "@app/authentication/with-jwt";
import Database, { db } from "@app/db";
import dependencyInjector from "@app/dependency-injector";
import SentimentAlyze from "@app/sentiment-alyze";

import { Moment } from "../../types";

const withServices = dependencyInjector(
  async (db: Database, req: NextRequest) => {
    try {
      const json = await req.json();
      const sA = SentimentAlyze();
      const moment: Moment = {
        ...json,
        score: sA.analyze(json.moment).comparative,
      };
      const momentID = await db.setMoment(moment);
      if (!momentID) {
        throw new Error("failed to set moment");
      }
      return NextResponse.json({}, { status: 200 });
    } catch (error) {
      return NextResponse.json({}, { status: 500 });
    }
  },
  db
);

export const POST = withJWT(withServices);
