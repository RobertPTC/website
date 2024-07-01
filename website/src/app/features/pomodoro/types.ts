export type TimerPrimaryButtonText = "Start" | "Stop";

export type TimerAction = 0 | 1 | null;

export type Pomodoro = {
  label: string;
  seconds: number;
  id: string;
};

export type Rect = {
  label: string;
  seconds: number;
  hour: string;
};
