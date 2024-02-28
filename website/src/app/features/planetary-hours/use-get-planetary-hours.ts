import dayjs from "dayjs";
import { getSunrise, getSunset } from "sunrise-sunset-js";

import {
  HourMetadata,
  Position,
  PlanetaryHour,
  DateInput,
} from "app/features/planetary-hours/types";
import { calculatePlanetaryHourLength } from "app/features/planetary-hours/utils";

import { Days, planetaryHoursMap } from "./constants";

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
  { date, isCurrent }: DateInput
): PlanetaryHours | undefined {
  if (!pos) return;
  if (!isCurrent) {
    const sunrise = getSunrise(pos.latitude, pos.longitude, date.toDate());
    const sunset = getSunset(pos.latitude, pos.longitude, date.toDate());
    const dayHourLength = calculatePlanetaryHourLength(sunset, sunrise);
    const hours = planetaryHoursMap[date.day() as Days];
    const dayHours = hours.day.map((h, i) => {
      return buildHour(sunrise, dayHourLength, h, i);
    });
    const tomorrowSunrise = getSunrise(
      pos.latitude,
      pos.longitude,
      date.add(1, "day").toDate()
    );
    const nightHourLength = calculatePlanetaryHourLength(
      tomorrowSunrise,
      sunset
    );
    const nightHours = hours.night.map((h, i) => {
      return buildHour(sunset, nightHourLength, h, i);
    });
    return {
      hours: dayHours.concat(nightHours),
    };
  }
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
  const now = dayjs();
  const sunrise = getSunrise(pos.latitude, pos.longitude, now.toDate());
  if (now.isBefore(sunrise)) {
    const yesterday = now.subtract(1, "day");
    const yesterdaySunset = getSunset(
      pos.latitude,
      pos.longitude,
      yesterday.toDate()
    );
    const nightHourLength = calculatePlanetaryHourLength(
      sunrise,
      yesterdaySunset
    );
    const hours = planetaryHoursMap[yesterday.day() as Days];
    const nightHours = hours.night.map((h, i) => {
      return buildHour(yesterdaySunset, nightHourLength, h, i);
    });
    const sunset = getSunset(pos.latitude, pos.longitude, now.toDate());
    const dayHourLength = calculatePlanetaryHourLength(sunset, sunrise);
    const todayHours = planetaryHoursMap[now.day() as Days];
    const dayHours = todayHours.day.map((h, i) => {
      return buildHour(sunrise, dayHourLength, h, i);
    });
    return {
      hours: nightHours.concat(dayHours).filter((d) => d.hourEnd.isAfter(now)),
    };
  }
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
