import dayjs, { Dayjs } from "dayjs";
import { getSunrise, getSunset } from "sunrise-sunset-js";

import {
  HourMetadata,
  Position,
  PlanetaryHour,
} from "app/features/planetary-hours/types";
import { calculatePlanetaryHourLength } from "app/features/planetary-hours/utils";

import { Days, planetaryHoursMap } from "./constants";

type ResponseStatus = "loading" | "success" | "error";

type PlanetaryHours = {
  hours: PlanetaryHour[];
};

function buildHour(
  start: Date,
  hourLength: number,
  h: HourMetadata,
  i: number
): PlanetaryHour {
  const hourStart = dayjs(start).add(i * hourLength, "minutes");
  const hourEnd = hourStart.add(hourLength, "minutes");
  const now = dayjs();
  const isCurrent = now.isAfter(hourStart) && now.isBefore(hourEnd);
  return {
    ...h,
    hourEnd,
    hourStart,
    isCurrent,
  };
}

export default function useGetPlanetaryHours(
  pos: Position | undefined,
  date: Dayjs
): PlanetaryHours | undefined {
  if (!pos) return;
  const sunset = getSunset(pos.latitude, pos.longitude, date.toDate());
  if (date.isAfter(dayjs(sunset))) {
    const tomorrow = date.add(1, "day");
    const tomorrowSunrise = getSunrise(
      pos.latitude,
      pos.longitude,
      tomorrow.toDate()
    );
    const tomorrowSunset = getSunset(
      pos.latitude,
      pos.longitude,
      tomorrow.toDate()
    );
    const nightHourLength = calculatePlanetaryHourLength(
      tomorrowSunrise,
      sunset
    );
    const dayHourLength = calculatePlanetaryHourLength(
      tomorrowSunset,
      tomorrowSunrise
    );
    const hours = planetaryHoursMap[date.day() as Days];
    const nightHours = hours.night.map((h, i) => {
      return buildHour(sunset, nightHourLength, h, i);
    });
    const dayHours = hours.day.map((h, i) => {
      return buildHour(tomorrowSunrise, dayHourLength, h, i);
    });
    return {
      hours: nightHours.concat(dayHours).filter((d) => d.hourEnd.isAfter(date)),
    };
  }
  const sunrise = getSunrise(pos.latitude, pos.longitude, date.toDate());
  const dayHourLength = calculatePlanetaryHourLength(sunset, sunrise);
  const hours = planetaryHoursMap[date.day() as Days];
  const dayHours = hours.day.map((h, i) => {
    return buildHour(sunrise, dayHourLength, h, i);
  });
  const tomorrow = date.add(1, "day");
  const tomorrowSunrise = getSunrise(
    pos.latitude,
    pos.longitude,
    tomorrow.toDate()
  );
  const nightHourLength = calculatePlanetaryHourLength(tomorrowSunrise, sunset);
  const nightHours = hours.night.map((h, i) => {
    return buildHour(sunset, nightHourLength, h, i);
  });
  return {
    hours: dayHours.concat(nightHours).filter((d) => d.hourEnd.isAfter(date)),
  };
}
