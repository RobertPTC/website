import { Dispatch, SetStateAction, useEffect, useState } from "react";

import { Position } from "app/features/planetary-hours/types";

import { SessionStorageKeys } from "./constants";

function getSessionStorage(key: string) {
  if (typeof window !== "undefined") {
    return window.sessionStorage.getItem(key);
  }
}

function setSessionStorage(key: string, value: string) {
  if (typeof window !== "undefined") {
    window.sessionStorage.setItem(key, value);
  }
}

export default function usePosition(
  location: string | null
): [Position | undefined, Dispatch<SetStateAction<Position | undefined>>] {
  const [pos, setPos] = useState<Position>();
  if (typeof window !== "undefined") {
    navigator.geolocation.watchPosition((pos) => {
      if (location) return;
      setSessionStorage(
        SessionStorageKeys.POSITION,
        JSON.stringify({
          latitude: pos.coords.latitude,
          longitude: pos.coords.longitude,
        })
      );
      setPos({
        latitude: pos.coords.latitude,
        longitude: pos.coords.longitude,
        state: "success",
      });
    });
  }
  useEffect(() => {
    if (typeof window !== "undefined") {
      const coords = getSessionStorage(SessionStorageKeys.POSITION);
      if (coords) {
        const parsedCoords = JSON.parse(coords);
        setPos({
          latitude: parsedCoords.latitude,
          longitude: parsedCoords.longitude,
          state: "success",
        });
      }
      navigator.geolocation.getCurrentPosition((pos) => {
        if (location) return;
        setPos({
          latitude: pos.coords.latitude,
          longitude: pos.coords.longitude,
          state: "success",
        });
      });
    }
  }, [location]);
  return [pos, setPos];
}