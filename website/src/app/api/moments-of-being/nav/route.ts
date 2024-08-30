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
      const navLinks = await db.getMomentsNav(email);
      return NextResponse.json(navLinks, { status: 200 });
    } catch (error) {
      console.error("error", error);
      return NextResponse.json({}, { status: 500 });
    }
  },
  memoryCache,
  db
);

export const GET = withJWT(withServices);
