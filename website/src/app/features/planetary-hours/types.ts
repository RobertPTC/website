import { Dayjs } from "dayjs";

export type Position = {
  latitude: number;
  longitude: number;
  state: "success" | "error";
};

export type HourMetadata = {
  angel: string;
  orisha: string;
  color: string;
  ruler: string;
  Icon: () => JSX.Element;
  action: string;
};

export type City = {
  city: string;
};

export interface PlanetaryHour extends HourMetadata {
  hourStart: Dayjs;
  hourEnd: Dayjs;
  isCurrent: boolean;
}

export interface DateInput {
  date: Dayjs;
  isCurrent: boolean;
}
