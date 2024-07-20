import dayjs, { Dayjs } from "dayjs";
import timezone from "dayjs/plugin/timezone";
import utc from "dayjs/plugin/utc";
import suncalc from "suncalc";

import { Days, planetaryHoursMap } from "./constants";
import {
  HourMetadata,
  Position,
  PlanetaryHour,
  DateInput,
  PositionSuccess,
} from "./types";
import { calculatePlanetaryHourLength } from "./utils";

dayjs.extend(timezone);
dayjs.extend(utc);

type PlanetaryHours = {
  hours: PlanetaryHour[];
};

function buildHour(
  start: Date | Dayjs,
  hourLength: number,
  h: HourMetadata,
  i: number,
  date: Dayjs
): PlanetaryHour {
  const hourStart = dayjs(start).add(i * hourLength, "minutes");
  const hourEnd = hourStart.add(hourLength, "minutes");
  const isCurrent = date.isAfter(hourStart) && date.isBefore(hourEnd);
  return {
    ...h,
    hourEnd,
    hourStart,
    isCurrent,
  };
}

function getSuncalcTimes(d: DateInput, p: PositionSuccess) {
  const { sunrise, sunset } = suncalc.getTimes(
    d.date.toDate(),
    p.latitude,
    p.longitude
  );
  return {
    sunrise: dayjs(sunrise).tz(d.tz),
    sunset: dayjs(sunset).tz(d.tz),
  };
}

export default function useGetPlanetaryHours(
  pos: Position | undefined,
  d: DateInput | undefined
): PlanetaryHours | undefined {
  if (!pos || !d || pos.state === "error") return;
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
      return buildHour(sunrise, dayHourLength, h, i, date);
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
      return buildHour(sunset, nightHourLength, h, i, date);
    });
    return {
      hours: dayHours.concat(nightHours),
    };
  }

  const { sunset } = suncalc.getTimes(
    d.date.toDate(),
    pos.latitude,
    pos.longitude
  );

  if (date.isAfter(dayjs(sunset))) {
    const tomorrow = date.add(1, "day");
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
    const hours = planetaryHoursMap[date.day() as Days];
    const nightHours = hours.night.map((h, i) => {
      return buildHour(sunset, nightHourLength, h, i, date);
    });
    const dayHours = hours.day.map((h, i) => {
      return buildHour(tomorrowSunrise, dayHourLength, h, i, date);
    });
    return {
      hours: nightHours.concat(dayHours).filter((d) => d.hourEnd.isAfter(date)),
    };
  }
  const { sunrise } = getSuncalcTimes(d, pos);

  if (date.isBefore(sunrise)) {
    const yesterday = date.subtract(1, "day");
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
      return buildHour(yesterdaySunset, nightHourLength, h, i, date);
    });
    const { sunset } = suncalc.getTimes(
      date.toDate(),
      pos.latitude,
      pos.longitude
    );
    const dayHourLength = calculatePlanetaryHourLength(sunset, sunrise);
    const todayHours = planetaryHoursMap[date.day() as Days];
    const dayHours = todayHours.day.map((h, i) => {
      return buildHour(sunrise, dayHourLength, h, i, date);
    });
    return {
      hours: nightHours.concat(dayHours).filter((d) => d.hourEnd.isAfter(date)),
    };
  }
  const dayHourLength = calculatePlanetaryHourLength(sunset, sunrise);
  const hours = planetaryHoursMap[date.day() as Days];

  const dayHours = hours.day.map((h, i) => {
    return buildHour(sunrise, dayHourLength, h, i, date);
  });
  const tomorrow = date.add(1, "day");
  const { sunrise: tomorrowSunrise } = suncalc.getTimes(
    tomorrow.toDate(),
    pos.latitude,
    pos.longitude
  );
  const nightHourLength = calculatePlanetaryHourLength(tomorrowSunrise, sunset);
  const nightHours = hours.night.map((h, i) => {
    return buildHour(sunset, nightHourLength, h, i, date);
  });
  return {
    hours: dayHours.concat(nightHours).filter((d) => d.hourEnd.isAfter(date)),
  };
}
