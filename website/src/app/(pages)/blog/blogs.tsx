import { ReactNode } from "react";

import { Metadata } from "next";

import { BuildingTheGoogleTimer } from "./building-the-google-timer";

export type Blog = {
  title: string;
  date: string;
  previewText: string;
  imgURL: string;
  Component(): ReactNode;
};

export type PostNames =
  | "building-the-google-timer"
  | "building-the-blog-file-directory.post"
  | "prayer-meeting.post";

export const blogPosts: { [K in PostNames]: () => ReactNode } = {
  "building-the-blog-file-directory.post": () => (
    <>Building the Blog File Directory Component</>
  ),
  "building-the-google-timer": () => <BuildingTheGoogleTimer />,
  "prayer-meeting.post": () => <>Learning System Design from Prayer Meeting</>,
};

export const blogIndexes: { [K in PostNames]: string[] } = {
  "building-the-google-timer": [
    "motivation",
    "webworkers",
    "timeintervals",
    "schematic",
    "alert",
    "datavisualization",
  ],
  "building-the-blog-file-directory.post": [],
  "prayer-meeting.post": [],
};

export const blogMetadata: { [K in PostNames]: Metadata } = {
  "building-the-google-timer": {
    title: "Building the Google Timer",
    description:
      "Tutorial on building the Google timer using Webworkers, d3.js, and React.",
  },
  "building-the-blog-file-directory.post": {},
  "prayer-meeting.post": {},
};

export const blogStyles = {
  h2: {
    fontSize: "2rem",
  },
  h3: {
    fontSize: "1.5rem",
  },
} as const;
