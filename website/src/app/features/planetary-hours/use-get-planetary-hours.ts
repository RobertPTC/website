import dayjs, { Dayjs } from "dayjs";
import { getSunrise, getSunset } from "sunrise-sunset-js";

import { HourMetadata, Position } from "app/features/planetary-hours/types";
import { calculatePlanetaryHourLength } from "app/features/planetary-hours/utils";

import { Days, planetaryHoursMap } from "./constants";

interface PlanetaryHour extends HourMetadata {
  hourStart: Dayjs;
  hourEnd: Dayjs;
}

type ResponseStatus = "loading" | "success" | "error";

type PlanetaryHours = {
  hours: PlanetaryHour[];
  hourLengthInMinutes: number;
};

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
      const hourStart = dayjs(sunset).add(i * nightHourLength, "minutes");
      const hourEnd = hourStart.add(nightHourLength, "minutes");
      return {
        ...h,
        hourEnd,
        hourStart,
      };
    });
    const dayHours = hours.day.map((h, i) => {
      const hourStart = dayjs(tomorrowSunrise).add(
        i * dayHourLength,
        "minutes"
      );
      const hourEnd = hourStart.add(dayHourLength, "minutes");
      return {
        ...h,
        hourEnd,
        hourStart,
      };
    });
    return {
      hourLengthInMinutes: nightHourLength,
      hours: nightHours.concat(dayHours),
    };
  }
  return { hourLengthInMinutes: 0, hours: [] };
}
