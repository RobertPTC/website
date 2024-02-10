import { useState } from "react";

import dayjs from "dayjs";
import { getSunrise, getSunset } from "sunrise-sunset-js";

import { calculatePlanetaryHourLength } from "app/planetary-hours-calculator/utils";

type PlanetaryHour = {};

type ResponseStatus = "loading" | "success" | "error";

type PlanetaryHoursResponse = {
  data?: PlanetaryHour[];
  status: ResponseStatus;
};

export default function useGetPlanetaryHours(): PlanetaryHoursResponse {
  const [planetaryHoursResponse, setPlanetaryHoursResponse] =
    useState<PlanetaryHoursResponse>({ data: undefined, status: "loading" });
  navigator.geolocation.watchPosition((pos) => {
    const now = dayjs();
    const tomorrow = now.add(1, "day");
    const {
      coords: { latitude, longitude },
    } = pos;
    const sunrise = getSunrise(latitude, longitude, now.toDate());
    const sunset = getSunset(latitude, longitude, now.toDate());
    const tomorrowSunrise = getSunrise(latitude, longitude, tomorrow.toDate());
    const dayHourLength = calculatePlanetaryHourLength(sunset, sunrise);
    const nightHourLength = calculatePlanetaryHourLength(
      tomorrowSunrise,
      sunset
    );
    console.log("sunrise ", sunrise);
    console.log("sunset ", sunset);
    console.log("dayHourLength ", dayHourLength);
    console.log("nightHourLength ", nightHourLength);
  });
  return planetaryHoursResponse;
}
