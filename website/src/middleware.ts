import { getSession } from "@auth0/nextjs-auth0/edge"; // Note the /edge import
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// This function can be marked `async` if using `await` inside
export async function middleware(request: NextRequest) {
  const session = await getSession();
  console.log("session ", session);
}

// See "Matching Paths" below to learn more
export const config = {
  matcher: "/moments-of-being/:path*",
};
