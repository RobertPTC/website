import { Dispatch, SetStateAction, useState } from "react";

import { Position } from "app/features/planetary-hours/types";

export default function usePosition(): [
  Position | undefined,
  Dispatch<SetStateAction<Position | undefined>>
] {
  const [pos, setPos] = useState<Position>();
  if (typeof window !== "undefined") {
    navigator.geolocation.watchPosition((pos) => {
      setPos({
        latitude: pos.coords.latitude,
        longitude: pos.coords.longitude,
        state: "success",
      });
    });
  }
  return [pos, setPos];
}
