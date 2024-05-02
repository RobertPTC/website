import { NextRequest } from "next/server";

import { City } from "app/api/types";
import { distanceBetweenTwoPoints } from "app/api/utils";
import cities from "app/api/worldcities.json";

export function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const lat = searchParams.get("lat");
  const lng = searchParams.get("lng");
  if (lat && lng) {
    const closestCity = (cities as City[]).find((c) => {
      const lat2 = Number(c.lat);
      const lng2 = Number(c.lng);
      const distance = distanceBetweenTwoPoints(
        Number(lat),
        Number(lng),
        lat2,
        lng2
      );
      return distance < 2;
    });
    if (closestCity) {
      return Response.json(
        { data: closestCity, value: closestCity.city },
        { status: 200 }
      );
    }
    return new Response("", { status: 404 });
  }
  return new Response("", { status: 500 });
}
