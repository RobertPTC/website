import { NextRequest, NextResponse } from "next/server";
import { v4 as uuid } from "uuid";

import memoryCache from "memory-cache";

export async function POST(req: NextRequest) {
  try {
    const json = await req.json();
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
    return NextResponse.json({ status: 500, statusText: "key not set" });
  }
}
