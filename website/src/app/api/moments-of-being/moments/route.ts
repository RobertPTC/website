import { withApiAuthRequired } from "@auth0/nextjs-auth0";
import { NextRequest } from "next/server";

import SentimentAlyze from "app/sentiment-alyze";

import MomentsOfBeing from "..";

const sA = SentimentAlyze();

const mob = MomentsOfBeing();

export const GET = withApiAuthRequired(async (request: NextRequest) => {
  return mob.Moments(request);
});
