import { useEffect, useState } from "react";

import { City } from "./types";

export default function useGetClosestCity(lat?: number, lng?: number) {
  const [city, setCity] = useState<City | undefined>();
  useEffect(() => {
    if (lat && lng) {
      fetch(`/api/locate-closest-city?lat=${lat}&lng=${lng}`).then(
        async (res) => {
          const json = await res.json();
          console.log("json ", json);
          setCity(json);
          return json;
        }
      );
    }
  }, [lat, lng]);
  return city;
}
