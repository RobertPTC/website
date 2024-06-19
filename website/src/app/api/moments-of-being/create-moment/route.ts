import { NextRequest } from "next/server";

import requestsHandler from "..";

export function POST(request: NextRequest) {
  return requestsHandler.CreateMoment(request);
}
