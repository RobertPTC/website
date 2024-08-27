import { NextRequest, NextResponse } from "next/server";
import { v4 as uuid } from "uuid";

import EmailService, { validEmailRegex } from "@app/email";
import MemoryCache from "@app/memory-cache";

export interface AuthenticationService {}

export async function requestVerificationCode(
  req: NextRequest,
  memoryCache: MemoryCache,
  emailService: EmailService
) {
  try {
    const json = await req.json();
    if (!validEmailRegex.test(json.email)) {
      return NextResponse.json({ status: 400, statusText: "invalid email" });
    }
    const token = uuid();
    const res = await memoryCache.setVerificationToken(
      json.email,
      token,
      5 * 60
    );
    if (!res) {
      throw new Error("error setting verification token");
    }
    const success = await emailService.sendVerificationToken(json.email, token);
    if (!success) {
      // delete token?
      throw new Error("error sending verification token email ");
    }
    return NextResponse.json({ status: 200, statusText: "OK" });
  } catch (e) {
    return NextResponse.json({ status: 500, statusText: "key not set" });
  }
}
