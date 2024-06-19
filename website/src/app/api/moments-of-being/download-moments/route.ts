import { withApiAuthRequired } from "@auth0/nextjs-auth0";
import { NextRequest } from "next/server";

import requestsHandler from "..";

export const POST = withApiAuthRequired(async (request: NextRequest) => {
  return requestsHandler.DownloadMoments(request);
});
