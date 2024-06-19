import { NextRequest } from "next/server";

import MomentsOfBeing from "..";

const mob = MomentsOfBeing();

export function PUT(request: NextRequest) {
  return mob.UpdateMoment(request);
}
