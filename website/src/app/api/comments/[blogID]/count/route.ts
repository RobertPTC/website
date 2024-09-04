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
      const count = await db.getCommentsCountForBlog(context.params.blogID);
      if (count === null) {
        throw new Error("could not get count");
      }
      return NextResponse.json({ count }, { status: 200 });
    } catch (error) {
      console.error("error ", error);
      return NextResponse.json({ count: null }, { status: 500 });
    }
  },
  db
);

export const GET = withService;
