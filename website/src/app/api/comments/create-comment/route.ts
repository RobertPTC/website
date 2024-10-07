import { NextRequest, NextResponse } from "next/server";
import { v4 as uuid } from "uuid";

import getJWTPayload from "@app/authentication/get-jwt-payload";
import verifyJWT from "@app/authentication/verify-jwt";
import { jwtSession } from "@app/cookies";
import Database, { db } from "@app/db";
import dependencyInjector from "@app/dependency-injector";
import MemoryCache, { memoryCache } from "@app/memory-cache";

import { BlogComment } from "../../types";

async function handler(
  memoryCache: MemoryCache,
  db: Database,
  req: NextRequest
) {
  try {
    const jwt = req.cookies.get(jwtSession);
    if (!jwt?.value) {
      throw new Error("no jwt");
    }
    const isValid = verifyJWT(jwt.value);
    if (!isValid) {
      throw new Error("invalid JWT");
    }
    const jwtPayload = getJWTPayload(jwt?.value || "");
    const email = await memoryCache.getEmailForSessionID(jwtPayload?.sub || "");
    if (!email) {
      throw new Error("Who are you?");
    }
    const formData = await req.formData();
    if (
      !formData.get("responds_to") ||
      !formData.get("text") ||
      !formData.get("date")
    ) {
      throw new Error("form data incomplete");
    }
    const journalistID = await db.getJournalistIDForEmail(email);
    if (!journalistID) {
      throw new Error("Something went wrong");
    }
    const blogComment: BlogComment = {
      responds_to: formData.get("responds_to") as string,
      text: formData.get("text") as string,
      date: formData.get("date") as string,
      blog_comment_id: uuid(),
      journalist_id: journalistID,
    };
    const res = await db.setComment(blogComment);
    if (!res) {
      throw new Error("Something went wrong");
    }
    return NextResponse.json({}, { status: 200 });
  } catch (error) {
    console.error("error ", error);
    return NextResponse.json({}, { status: 500 });
  }
}

export const POST = dependencyInjector(handler, memoryCache, db);
