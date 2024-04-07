import dayjs from "dayjs";
import suncalc from "suncalc";

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
  d: DateInput | undefined
): PlanetaryHours | undefined {
  if (!pos || !d) return;
  const { isCurrent, date } = d;
  if (!isCurrent) {
    const { sunrise, sunset } = suncalc.getTimes(
      date.toDate(),
      pos.latitude,
      pos.longitude
    );
    const dayHourLength = calculatePlanetaryHourLength(sunset, sunrise);
    const hours = planetaryHoursMap[date.day() as Days];
    const dayHours = hours.day.map((h, i) => {
      return buildHour(sunrise, dayHourLength, h, i);
    });
    const { sunrise: tomorrowSunrise } = suncalc.getTimes(
      date.add(1, "day").toDate(),
      pos.latitude,
      pos.longitude
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
  const now = dayjs();

  const { sunset } = suncalc.getTimes(
    d.date.toDate(),
    pos.latitude,
    pos.longitude
  );

  if (now.isAfter(dayjs(sunset))) {
    const tomorrow = now.add(1, "day");
    const { sunrise: tomorrowSunrise, sunset: tomorrowSunset } =
      suncalc.getTimes(tomorrow.toDate(), pos.latitude, pos.longitude);
    const nightHourLength = calculatePlanetaryHourLength(
      tomorrowSunrise,
      sunset
    );
    const dayHourLength = calculatePlanetaryHourLength(
      tomorrowSunset,
      tomorrowSunrise
    );
    const hours = planetaryHoursMap[now.day() as Days];
    const nightHours = hours.night.map((h, i) => {
      return buildHour(sunset, nightHourLength, h, i);
    });
    const dayHours = hours.day.map((h, i) => {
      return buildHour(tomorrowSunrise, dayHourLength, h, i);
    });
    return {
      hours: nightHours.concat(dayHours).filter((d) => d.hourEnd.isAfter(now)),
    };
  }
  const { sunrise } = suncalc.getTimes(
    now.toDate(),
    pos.latitude,
    pos.longitude
  );
  if (now.isBefore(sunrise)) {
    const yesterday = now.subtract(1, "day");
    const { sunset: yesterdaySunset } = suncalc.getTimes(
      yesterday.toDate(),
      pos.latitude,
      pos.longitude
    );
    const nightHourLength = calculatePlanetaryHourLength(
      sunrise,
      yesterdaySunset
    );
    const hours = planetaryHoursMap[yesterday.day() as Days];
    const nightHours = hours.night.map((h, i) => {
      return buildHour(yesterdaySunset, nightHourLength, h, i);
    });
    const { sunset } = suncalc.getTimes(
      now.toDate(),
      pos.latitude,
      pos.longitude
    );
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
  const hours = planetaryHoursMap[now.day() as Days];
  const dayHours = hours.day.map((h, i) => {
    return buildHour(sunrise, dayHourLength, h, i);
  });
  const tomorrow = now.add(1, "day");
  const { sunrise: tomorrowSunrise } = suncalc.getTimes(
    tomorrow.toDate(),
    pos.latitude,
    pos.longitude
  );
  const nightHourLength = calculatePlanetaryHourLength(tomorrowSunrise, sunset);
  const nightHours = hours.night.map((h, i) => {
    return buildHour(sunset, nightHourLength, h, i);
  });
  return {
    hours: dayHours.concat(nightHours).filter((d) => d.hourEnd.isAfter(now)),
  };
}
