import { useEffect, useState } from "react";

import { Autocomplete, TextField } from "@mui/material";

import { Position } from "./types";
import useGetClosestCity from "./use-get-closest-city";
import { debounce } from "./utils";

export default function LocationAutocomplete({ pos }: { pos: Position }) {
  const [options, setOptions] = useState<string[]>([]);
  const closestCity = useGetClosestCity(pos?.latitude, pos?.longitude);
  useEffect(() => {
    if (closestCity) {
      setOptions([closestCity.city]);
    }
  }, [closestCity]);

  const onInputChange = debounce((v: string) => {
    console.log("v ", v);
    fetch(`/api/search-cities?q=${v}`).then(async (r) => {
      const json = await r.json();
      console.log("json ", json);
    });
  }, 1000);
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
      onInputChange={(_, v) => {
        onInputChange(v);
      }}
    />
  );
}
