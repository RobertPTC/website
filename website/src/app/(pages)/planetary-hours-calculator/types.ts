import { Dayjs } from "dayjs";

export type PositionSuccess = {
  state: "success";
  latitude: number;
  longitude: number;
};

type PositionError = {
  state: "error";
  message: string;
  code: number;
};

export type Position = PositionSuccess | PositionError;

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
  city_ascii: string;
  lat: string;
  lng: string;
  country: string;
  iso2: string;
  iso3: string;
  admin_name: string;
  capital: string;
  population: string;
  id: string;
};

export interface PlanetaryHour extends HourMetadata {
  hourStart: Dayjs;
  hourEnd: Dayjs;
  isCurrent: boolean;
}

export type DateInput = {
  date: Dayjs;
  isCurrent: boolean;
  tz?: string;
};

export type LocationAutocompleteOption = {
  value: string;
  data?: City;
};

export enum SearchParams {
  DATE = "date",
  LOCATION = "location",
}
