import { Dayjs } from "dayjs";
import { v4 as uuid } from "uuid";

import { CreatePomodoroRequest, IRequests } from "requests";

import { PomodoroInput } from "./types";

export const secondsInMinute = 60;
export const secondsInHour = secondsInMinute * 60;

type TimerArray = [number, number, number, number, number, number];

export function secondsToTimerArray(s: number): TimerArray {
  if (s <= 0)
    return new Array(6).fill(0) as [
      number,
      number,
      number,
      number,
      number,
      number
    ];
  const minutes = (s / 60) | 0;
  const seconds = s - minutes * 60;
  const hours = (minutes / 60) | 0;
  const secondsString = seconds.toString().padStart(2, "0").split("");
  const minuteString = (minutes % 60).toString().padStart(2, "0").split("");
  const hoursString = hours.toString().padStart(2, "0").split("");

  return [
    Number(hoursString[0]),
    Number(hoursString[1]),
    Number(minuteString[0]),
    Number(minuteString[1]),
    Number(secondsString[0]),
    Number(secondsString[1]),
  ];
}

export function renderInactiveTimer(seconds: number) {
  const [hh, h, mm, m, ss, s] = secondsToTimerArray(seconds);
  return `${hh}${h}h${mm}${m}m${ss}${s}s`;
}

export function renderActiveTimer(seconds: number) {
  if (seconds <= 59) return `${seconds}s`;
  const timeString = renderInactiveTimer(seconds);
  const firstDigitIndex = timeString.search(/[1-9]/);
  return timeString.slice(firstDigitIndex);
}

export function timerArrayToSeconds(timer: TimerArray) {
  const [hh, h, mm, m, ss, s] = timer;
  return (
    hh * secondsInHour * 10 +
    h * secondsInHour +
    mm * secondsInMinute * 10 +
    m * secondsInMinute +
    ss * 10 +
    s
  );
}

export function parseTimerInput(input: string): string {
  const replaced = input.replace(/\D/g, "");
  return replaced
    .substring(replaced.length - 6, replaced.length)
    .padStart(6, "0");
}

export function timerInputToTimerArray(input: string): TimerArray {
  const p = parseTimerInput(input);
  return p.split("").map((n) => Number(n)) as TimerArray;
}

export function interpolateTimeDivisions(input: string): string {
  const [hh, h, mm, m, ss, s] = timerInputToTimerArray(input);
  return `${hh}${h}h${mm}${m}m${ss}${s}s`;
}

export function secondsToInputValue(seconds: number): string {
  return parseTimerInput(renderInactiveTimer(seconds));
}

export function determinePomodoroTimeSegments(
  seconds: number,
  startDate: Dayjs,
  intention: string
): PomodoroInput[] {
  const secondsToEndOfStartHour =
    60 * 60 - startDate.minute() * 60 - (60 - startDate.second());
  if (seconds <= secondsToEndOfStartHour) {
    return [
      {
        label: intention,
        seconds,
        id: uuid(),
        hour: startDate.hour(),
        month: startDate.month(),
        year: startDate.year(),
        date: startDate.date(),
      },
    ];
  }
  let date = startDate;
  let incrementedDate = startDate;
  let counter = 0;
  let p: PomodoroInput[] = [];
  while (seconds) {
    seconds -= 1;
    counter += 1;
    incrementedDate = incrementedDate.add(1, "second");
    if (incrementedDate.hour() !== date.hour()) {
      p = [
        ...p,
        {
          label: intention,
          seconds: counter,
          id: uuid(),
          hour: date.hour(),
          month: date.month(),
          year: date.year(),
          date: date.date(),
        },
      ];
      counter = 0;
      date = incrementedDate;
    }
  }
  p = [
    ...p,
    {
      label: intention,
      seconds: counter,
      id: uuid(),
      hour: date.hour(),
      month: date.month(),
      year: date.year(),
      date: date.date(),
    },
  ];
  return p;
}

export const timeGroups = ["h", "m", "s"];

export function createPomodoroRequest({
  label,
  activeDuration,
  duration,
  pomodoroSpans,
  requests,
  startDate,
}: {
  label: string;
  duration: number;
  activeDuration: number;
  pomodoroSpans: number[];
  requests: IRequests;
  startDate: Dayjs;
}): Promise<{ elapsedTime: number; timeSegments: PomodoroInput[] }> {
  const elapsedTime =
    duration - pomodoroSpans.reduce((p, c) => p + c, activeDuration);
  const timeSegments = determinePomodoroTimeSegments(
    elapsedTime,
    startDate,
    label
  );
  if (elapsedTime < 0) {
    throw new Error(`elapsed time cannot be negative ${elapsedTime}`);
  }
  const request: CreatePomodoroRequest = {
    uri: "/api/pomodoro",
    data: {
      pomodoros: timeSegments,
    },
  };
  return requests
    .set<CreatePomodoroRequest>(request)
    .then(() => ({ elapsedTime, timeSegments }));
}
