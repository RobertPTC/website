import { withApiAuthRequired } from "@auth0/nextjs-auth0";
import { NextRequest } from "next/server";

import MomentsOfBeing from "..";

const mob = MomentsOfBeing();

export const POST = withApiAuthRequired(async (request: NextRequest) => {
  return mob.DownloadMoments(request);
});
