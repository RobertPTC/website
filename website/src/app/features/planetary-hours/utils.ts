import dayjs, { Dayjs } from "dayjs";

export const calculatePlanetaryHourLength = (
  d1: Date | Dayjs,
  d2: Date | Dayjs
) => dayjs(d1).diff(dayjs(d2), "minutes") / 12;

export const debounce = (f: Function, d: number) => {
  let timeout: NodeJS.Timeout | undefined;
  return function debounced(...args: any[]) {
    if (timeout) clearTimeout(timeout);
    timeout = setTimeout(() => {
      f(...args);
    }, d);
  };
};
