import { index, union } from "d3-array";
import { stack } from "d3-shape";

import {
  PomodorosForMonth,
  PomodorosForDate,
  PomodorosForHour,
} from "requests";

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

function makeBarsOutput(
  // PomodorosForDate is a map of date to Pomodoro, which is an object with properties id, seconds (length of interval), and intention
  pomodorosForDates: PomodorosForDate,
  allLabels: { [key: string]: string }
) {
  const mapFn = ([timeUnit, pomodoros]: [string, PomodorosForHour]) => {
    if (!pomodoros.length) return { timeUnit };
    // Helper function to add up all seconds associated with an intention
    const rects = rollup(pomodoros, timeUnit);
    // Index the data based on date and intention - this way d3 knows how to build the pieces of the stacked bar
    const dateIndex = index(
      rects,
      (r) => r.date,
      (r) => r.label
    );
    // Make a set of labels
    const labels = union(
      pomodorosForDates[timeUnit].map((d) => {
        allLabels[d.label] = d.label;
        return d.label;
      })
    );
    // d3 magic function that builds the pieces of the stacked bar
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
  const bars = Object.entries(pomodorosForDates).map(mapFn);
  return { bars, allLabels: Object.keys(allLabels) };
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
  return makeBarsOutput(pomodorosForDates, allLabels);
}

export function makeDateBars(d: PomodorosForDate) {
  const allLabels: { [key: string]: string } = {};
  const pomodorosForDates = { ...d };
  return makeBarsOutput(pomodorosForDates, allLabels);
}

export const svgHeight = 360;
export const marginBottom = 20;
export const marginLeft = 140;
export const bandWidthModifer = 80;
export const numberOfHours = 24;
export const yAxisLegendOffset = 40;
