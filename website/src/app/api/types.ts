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

export type Moment = {
  moment: string;
  date_string: string;
  month: number;
  year: number;
  date: number;
  score?: number;
};

export type UpdateMoment = {
  moment: string;
  id: string;
};

export type MomentNav = number[];

export type MonthMoment = {
  moments: { all: string[]; [key: number]: Moment[] | undefined };
  mostImportantWords: string[];
  minScore: number;
  maxScore: number;
};

export type Moments = {
  [key: string]: MonthMoment;
};

export type MomentEntries = [string, MonthMoment][];
