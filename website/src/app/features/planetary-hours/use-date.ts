import { Dispatch, SetStateAction, useEffect, useState } from "react";

import dayjs from "dayjs";
import timezone from "dayjs/plugin/timezone";
import utc from "dayjs/plugin/utc";

import { DateInput, Position } from "./types";

dayjs.extend(timezone);
dayjs.extend(utc);

export default function useDate(
  searchDate: string | null,
  pos?: Position
): [DateInput | undefined, Dispatch<SetStateAction<DateInput | undefined>>] {
  const [date, setDate] = useState<DateInput | undefined>();
  useEffect(() => {
    if (pos) {
      fetch(
        `/api/timezone-from-pos?lat=${pos.latitude}&lng=${pos.longitude}`
      ).then(async (r) => {
        const json = await r.json();
        const { tz } = json;
        if (tz[0]) {
          const d = dayjs.tz(searchDate || undefined, tz[0]);
          setDate({
            date: d,
            isCurrent: !searchDate,
            tz: tz[0],
          });
        }
      });
    }
  }, [searchDate, pos]);
  return [date, setDate];
}
