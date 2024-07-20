"use client";

import { useState } from "react";

import { SearchParams } from "./types";

export default function useSearchParams() {
  const [_, setSearchParams] = useState("");
  if (typeof window !== "undefined") {
    const searchParams = new URLSearchParams(window.location.search);
    return {
      date: searchParams.get(SearchParams.DATE),
      delete: (key: SearchParams) => {
        searchParams.delete(key);
        const newUrl = `${window.location.pathname}?${searchParams.toString()}`;
        window.history.pushState({ key }, "", newUrl);
        setSearchParams(searchParams.toString());
      },
      location: searchParams.get(SearchParams.LOCATION),
      set: (key: SearchParams, value: string) => {
        searchParams.set(key, value);
        const newUrl = `${window.location.pathname}?${searchParams.toString()}`;
        window.history.pushState({ key, value }, "", newUrl);
        setSearchParams(searchParams.toString());
      },
    };
  }
  return {
    date: null,
    delete: (key: SearchParams) => undefined,
    location: null,
    set: (key: SearchParams, value: string) => undefined,
  };
}
