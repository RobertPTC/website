import { withApiAuthRequired } from "@auth0/nextjs-auth0";
import { NextRequest } from "next/server";

import requestHandlers from "..";

export const GET = withApiAuthRequired(async (request: NextRequest) => {
  return requestHandlers.Moments(request);
});
