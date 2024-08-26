import { NextResponse } from "next/server";
import { v4 as uuid } from "uuid";

import EmailService, { validEmailRegex } from "@app/email";
import MemoryCache from "@app/memory-cache";

export interface AuthenticationService {}

export async function requestVerificationCode(
  req: Request,
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
    if (res) {
      return NextResponse.json({ status: 200, statusText: "OK" });
    }
    return NextResponse.json({ status: 500, statusText: "key not set" });
  } catch (e) {
    console.log("e ", e);
    return NextResponse.json({ status: 500, statusText: "key not set" });
  }
}
