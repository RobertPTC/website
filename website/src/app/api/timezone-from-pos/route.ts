import { find } from "geo-tz";
import { NextRequest } from "next/server";

export function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const lat = searchParams.get("lat");
  const lng = searchParams.get("lng");
  if (lat && lng) {
    const tz = find(Number(lat), Number(lng));
    return Response.json({ tz }, { status: 200 });
  }
  return Response.json({ tz: [] }, { status: 500 });
}
