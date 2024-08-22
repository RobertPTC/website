import { index, union } from "d3-array";
import { stack } from "d3-shape";

import {
  PomodorosForMonth,
  PomodorosForDate,
  PomodorosForHour,
} from "app/storage";

import { Pomodoro, MonthRect } from "./types";

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

function mapFnFactory(
  pomodorosForDates: PomodorosForDate,
  allLabels: { [key: string]: string }
) {
  return ([timeUnit, pomodoros]: [string, PomodorosForHour]) => {
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
  };
}

export function makeMonthBars(d: PomodorosForMonth) {
  const allLabels: { [key: string]: string } = {};
  let pomodorosForDates: PomodorosForDate = {};
  Object.entries(d).forEach(([date, hourPomodoros]) => {
    Object.entries(hourPomodoros).forEach(([_, pomodorosForHour]) => {
      const currentPomodorosForHour = pomodorosForDates[date] || [];
      const newPomodorosForHour =
        currentPomodorosForHour.concat(pomodorosForHour);
      pomodorosForDates[date] = newPomodorosForHour;
    });
  });
  const mapFn = mapFnFactory(pomodorosForDates, allLabels);
  const bars = Object.entries(pomodorosForDates).map(mapFn);
  return { bars, allLabels: Object.keys(allLabels) };
}

export function makeDateBars(d: PomodorosForDate) {
  const allLabels: { [key: string]: string } = {};
  const pomodorosForDates = { ...d };
  const mapFn = mapFnFactory(pomodorosForDates, allLabels);
  const bars = Object.entries(pomodorosForDates).map(mapFn);
  return { bars, allLabels: Object.keys(allLabels) };
}

export const svgHeight = 360;
export const marginBottom = 20;
export const marginLeft = 140;
export const bandWidthModifer = 80;
export const numberOfHours = 24;
export const yAxisLegendOffset = 40;
