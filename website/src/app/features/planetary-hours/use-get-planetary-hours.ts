import { useState } from "react";

import dayjs, { Dayjs } from "dayjs";
import { getSunrise, getSunset } from "sunrise-sunset-js";

import { Position } from "app/features/planetary-hours/types";
import { calculatePlanetaryHourLength } from "app/features/planetary-hours/utils";

type PlanetaryHour = {};

type ResponseStatus = "loading" | "success" | "error";

type PlanetaryHours = { day: PlanetaryHour[]; night: PlanetaryHour[] };

export default function useGetPlanetaryHours(
  pos: Position | undefined,
  date: Dayjs
): PlanetaryHours | undefined {
  // const sunrise = getSunrise(pos.latitude, pos.longitude, date.toDate());
  if (!pos) return;

  const sunset = getSunset(pos.latitude, pos.longitude, date.toDate());
  if (date.isAfter(dayjs(sunset))) {
    const tomorrow = date.add(1, "day");
    const tomorrowSunrise = getSunrise(
      pos.latitude,
      pos.longitude,
      tomorrow.toDate()
    );
    const planetaryHourLength = calculatePlanetaryHourLength(
      tomorrowSunrise,
      sunset
    );
    console.log("planetaryHourLength ", planetaryHourLength);
  }
  return { day: [], night: [] };
}
