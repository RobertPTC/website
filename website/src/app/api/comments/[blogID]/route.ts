import { NextRequest, NextResponse } from "next/server";

import Database, { db } from "@app/db";
import dependencyInjector from "@app/dependency-injector";

const withService = dependencyInjector(
  async (
    db: Database,
    request: NextRequest,
    context: { params: { blogID: string } }
  ) => {
    try {
      const comments = await db.getCommentsForBlog(context.params.blogID);
      if (!comments) {
        return NextResponse.json([], { status: 200 });
      }
      return NextResponse.json(comments, { status: 200 });
    } catch (error) {}
  },
  db
);

export const GET = withService;
