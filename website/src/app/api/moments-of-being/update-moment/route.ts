import { NextRequest } from "next/server";

import requestsHandler from "..";

export function PUT(request: NextRequest) {
  return requestsHandler.UpdateMoment(request);
}
