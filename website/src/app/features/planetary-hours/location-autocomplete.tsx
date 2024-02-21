import { useEffect, useState } from "react";

import { Autocomplete, TextField } from "@mui/material";

import { Position } from "./types";
import useGetClosestCity from "./use-get-closest-city";

export default function LocationAutocomplete({ pos }: { pos: Position }) {
  const [options, setOptions] = useState<string[]>([]);
  const closestCity = useGetClosestCity(pos?.latitude, pos?.longitude);
  useEffect(() => {
    if (closestCity) {
      console.log("closestCity ", closestCity);
      setOptions([closestCity.city]);
    }
  }, [closestCity]);
  return (
    <Autocomplete
      freeSolo
      options={options}
      value={closestCity?.city || ""}
      renderInput={(params) => (
        <TextField
          {...params}
          label="City"
          InputLabelProps={{ shrink: true }}
        />
      )}
    />
  );
}
