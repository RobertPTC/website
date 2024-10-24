import { NextRequest, NextResponse } from "next/server";

import Database, { db } from "@app/db";
import dependencyInjector from "@app/dependency-injector";

const withService = dependencyInjector(
  async (
    db: Database,
    request: NextRequest,
    context: { params: { commentID: string } }
  ) => {
    try {
      const comments = await db.getCommentsForComment(context.params.commentID);
      if (comments === null) {
        throw new Error("could not get comments for comment");
      }
      return NextResponse.json({ comments }, { status: 200 });
    } catch (error) {
      console.error("error ", error);
      return NextResponse.json({ comments: null }, { status: 500 });
    }
  },
  db
);

export const GET = withService;
