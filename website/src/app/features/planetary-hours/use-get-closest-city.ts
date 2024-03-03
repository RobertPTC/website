import { useEffect, useState } from "react";

import { LocationAutocompleteOption } from "./types";

export default function useGetClosestCity(lat?: number, lng?: number) {
  const [city, setCity] = useState<LocationAutocompleteOption | undefined>();
  useEffect(() => {
    if (lat && lng) {
      fetch(`/api/locate-closest-city?lat=${lat}&lng=${lng}`).then(
        async (res) => {
          const json = await res.json();
          setCity(json);
          return json;
        }
      );
    }
  }, [lat, lng]);
  return city;
}
