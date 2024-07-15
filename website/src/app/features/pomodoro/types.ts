import Pomodoro from "app/pomodoro/page";

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
