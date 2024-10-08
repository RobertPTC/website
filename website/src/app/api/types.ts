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

export type BaseMoment = {
  moment: string;
  date_string: string;
  month: string;
  year: string;
  date: string;
};

export type FormMoment = BaseMoment & {
  journalist_id: string;
};

export type Moment = BaseMoment & {
  moment_id: string;
  score: number;
};

export type UpdateMoment = {
  moment: string;
  id: string;
};

export type MomentNav = number[];

export type MonthMoment = {
  moments: {
    all: Pick<Moment, "moment_id" | "moment" | "date_string">[];
    [key: number]: Moment[] | undefined;
  };
  mostImportantWords: string[];
  minScore: number;
  maxScore: number;
};

export type MomentOption = {
  label: string;
  momentPreviewText: string;
  url: string;
  id: string;
};

export type Moments = {
  [key: string]: MonthMoment;
};

export type BlogComment = {
  blog_comment_id: string;
  responds_to: string;
  date: string;
  text: string;
  journalist_id: string;
};

export type BlogCommentTree = BlogComment & {
  reply_count: number;
};
