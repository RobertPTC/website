import { NextRequest, NextResponse } from "next/server";

import memoryCache from "memory-cache";

export async function POST(req: NextRequest) {
  const json = await req.json();

  const res = await memoryCache.setVerificationToken(
    "rptc3000@gmail.com",
    "777777",
    5 * 60
  );
  if (res) {
    return NextResponse.json({ status: 200, statusText: "OK" });
  }
  return NextResponse.json({ status: 500, statusText: "key not set" });
}
