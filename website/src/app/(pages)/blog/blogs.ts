export type Tags = "Application Development";

export type BlogPreview = {
  title: string;
  date: string;
  previewText: string;
  imgURL: string;
};

export type Blog = {
  html: string;
  tags: Tags[];
};

export const blogPreviews: BlogPreview[] = [
  {
    title: "How I Built the Google Timer",
    date: "July 21st, 2024",
    previewText: "Because time is an elusive animal and must be tracked",
    imgURL: "",
  },
];
