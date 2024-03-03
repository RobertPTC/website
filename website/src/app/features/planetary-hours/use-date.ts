import { Dispatch, SetStateAction, useEffect, useState } from "react";

import dayjs from "dayjs";

import { DateInput } from "./types";

export default function useDate(
  searchDate: string | null
): [DateInput | undefined, Dispatch<SetStateAction<DateInput | undefined>>] {
  const [date, setDate] = useState<DateInput | undefined>();
  useEffect(() => {
    setDate({
      date: dayjs(searchDate || undefined),
      isCurrent: !searchDate,
    });
  }, [searchDate]);
  return [date, setDate];
}
