import { NextRequest } from "next/server";

import MomentsOfBeing from "..";

const mob = MomentsOfBeing();

export function POST(request: NextRequest) {
  return mob.CreateMoment(request);
}
