import { Dispatch, SetStateAction } from "react";

import { InternMap } from "d3-array";
import { Series } from "d3-shape";
import { Dayjs } from "dayjs";

export type TimerPrimaryButtonText = "Start" | "Stop";

export type TimerAction = "start" | "stop" | "restart" | "reset" | null;

export type Pomodoro = {
  label: string;
  seconds: number;
  id: string;
};

export type PomodoroInput = Pomodoro & {
  hour: number;
  date: number;
  year: number;
  month: number;
};

export type MonthRect = {
  label: string;
  seconds: number;
  date: string;
};

export type Bars = {
  bars: (
    | {
        timeUnit: string;
        rects?: undefined;
        dateIndex?: undefined;
        series?: undefined;
        barHeight?: undefined;
      }
    | {
        rects: MonthRect[];
        dateIndex: InternMap<string, InternMap<string, MonthRect>>;
        series: Series<{ [key: string]: number }, string>[];
        barHeight: number;
        timeUnit: string;
      }
  )[];
  allLabels: string[];
};

export type ChartTypes = "date" | "month";

export type GetPomodorosForTimeWrapper = (
  setMax: Dispatch<SetStateAction<number>>,
  setBars: Dispatch<SetStateAction<Bars | undefined>>,
  date: Dayjs
) => Function;
