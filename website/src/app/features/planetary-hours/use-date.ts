import { Dispatch, SetStateAction, useState } from "react";

import dayjs, { Dayjs } from "dayjs";

export default function useDate(): [Dayjs, Dispatch<SetStateAction<Dayjs>>] {
  return useState(dayjs());
}
