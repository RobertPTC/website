import { Dispatch, SetStateAction, useState } from "react";

import dayjs from "dayjs";

import { DateInput } from "./types";

export default function useDate(): [
  DateInput,
  Dispatch<SetStateAction<DateInput>>
] {
  return useState<DateInput>({ date: dayjs(), isCurrent: true });
}
