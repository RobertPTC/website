import { index, union } from "d3-array";
import { stack } from "d3-shape";
import { Dayjs } from "dayjs";

import Storage, {
  PomodorosForMonth,
  PomodorosForDate,
  PomodorosForMonthRequest,
} from "app/storage";

import { Pomodoro, MonthRect, GetPomodorosForTimeWrapper } from "./types";

export function rollup(pomodoros: Pomodoro[], date: string): MonthRect[] {
  const labelsToSeconds: { [key: string]: number } = {};
  pomodoros.forEach((p) => {
    const currentSeconds = labelsToSeconds[p.label];
    if (currentSeconds) {
      labelsToSeconds[p.label] += p.seconds;
      return;
    }
    labelsToSeconds[p.label] = p.seconds;
  });
  return Object.entries(labelsToSeconds).map(([label, seconds]) => ({
    label,
    seconds,
    date,
  }));
}

export function makeMonthBars(d: PomodorosForMonth) {
  const allLabels: { [key: string]: string } = {};
  let pomodorosForDates: PomodorosForDate = {};
  Object.entries(d).forEach(([date, hourPomodoros]) => {
    Object.entries(hourPomodoros).forEach(([hour, pomodorosForHour]) => {
      const currentPomodorosForHour = pomodorosForDates[date] || [];
      const newPomodorosForHour =
        currentPomodorosForHour.concat(pomodorosForHour);
      pomodorosForDates[date] = newPomodorosForHour;
    });
  });
  const bars = Object.entries(pomodorosForDates).map(
    ([timeUnit, pomodoros]) => {
      if (!pomodoros.length) return { timeUnit };
      const rects = rollup(pomodoros, timeUnit);
      const dateIndex = index(
        rects,
        (r) => r.date,
        (r) => r.label
      );
      const labels = union(
        pomodorosForDates[timeUnit].map((d) => {
          allLabels[d.label] = d.label;
          return d.label;
        })
      );
      const series = stack()
        .keys(labels)
        // @ts-ignore
        .value(([, group], key) => group.get(key).seconds)(dateIndex);
      const barHeight = series?.[series.length - 1]?.[0]?.[1];

      return {
        rects,
        dateIndex,
        series,
        barHeight,
        timeUnit,
      };
    }
  );
  return { bars, allLabels: Object.keys(allLabels) };
}

export function makeDateBars(d: PomodorosForDate) {
  const allLabels: { [key: string]: string } = {};
  const pomodorosForDates = { ...d };
  const bars = Object.entries(pomodorosForDates).map(
    ([timeUnit, pomodoros]) => {
      if (!pomodoros.length) return { timeUnit };
      const rects = rollup(pomodoros, timeUnit);
      const dateIndex = index(
        rects,
        (r) => r.date,
        (r) => r.label
      );
      const labels = union(
        pomodorosForDates[timeUnit].map((d) => {
          allLabels[d.label] = d.label;
          return d.label;
        })
      );
      const series = stack()
        .keys(labels)
        // @ts-ignore
        .value(([, group], key) => group.get(key).seconds)(dateIndex);
      const barHeight = series?.[series.length - 1]?.[0]?.[1];

      return {
        rects,
        dateIndex,
        series,
        barHeight,
        timeUnit,
      };
    }
  );
  return { bars, allLabels: Object.keys(allLabels) };
}

export const svgHeight = 360;
export const marginBottom = 20;
export const marginLeft = 110;
export const bandWidthModifer = 80;
export const numberOfHours = 23;
export const yAxisLegendOffset = 30;
