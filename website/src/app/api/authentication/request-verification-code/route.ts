import { NextRequest } from "next/server";

import { emailService } from "@app/email";
import { memoryCache } from "@app/memory-cache";

import { requestVerificationCode } from "..";

export async function POST(req: NextRequest) {
  return requestVerificationCode(req, memoryCache, emailService);
}
