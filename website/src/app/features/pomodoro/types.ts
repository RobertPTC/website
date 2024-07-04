export type TimerPrimaryButtonText = "Start" | "Stop";

export type TimerAction = "start" | "stop" | "restart" | "reset" | null;

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
