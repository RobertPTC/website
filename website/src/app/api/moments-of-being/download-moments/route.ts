import { withApiAuthRequired } from "@auth0/nextjs-auth0";
import { NextRequest } from "next/server";

import Database, { db } from "@app/db";
import dependencyInjector from "@app/dependency-injector";
import MemoryCache, { memoryCache } from "@app/memory-cache";

import requestsHandler from "..";

const withServices = dependencyInjector(
  async (
    memoryCache: MemoryCache,
    db: Database,
    req: NextRequest | undefined
  ) => {},
  memoryCache,
  db
);

export const POST = withApiAuthRequired(async (request: NextRequest) => {
  return requestsHandler.DownloadMoments(request);
});
