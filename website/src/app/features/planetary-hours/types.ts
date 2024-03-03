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

export interface DateInput {
  date: Dayjs;
  isCurrent: boolean;
}

export type LocationAutocompleteOption = {
  value: string;
  data?: City;
};

export enum SearchParams {
  DATE = "date",
  LOCATION = "location",
}
