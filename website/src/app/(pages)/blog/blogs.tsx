import { ReactNode } from "react";

import { BuildingTheGoogleTimer } from "./building-the-google-timer";

export type Blog = {
  title: string;
  date: string;
  previewText: string;
  imgURL: string;
  Component(): ReactNode;
};

export type PostNames =
  | "building-the-google-timer.post"
  | "building-the-blog-file-directory.post"
  | "prayer-meeting.post";

export const blogPosts: { [K in PostNames]: () => ReactNode } = {
  "building-the-blog-file-directory.post": () => (
    <>Building the Blog File Directory Component</>
  ),
  "building-the-google-timer.post": () => <BuildingTheGoogleTimer />,
  "prayer-meeting.post": () => <>Learning System Design from Prayer Meeting</>,
};

export const blogStyles = {
  h2: {
    fontSize: "2rem",
  },
  h3: {
    fontSize: "1.5rem",
  },
} as const;