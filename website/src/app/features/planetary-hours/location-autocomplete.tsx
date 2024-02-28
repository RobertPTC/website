import { useEffect, useState } from "react";

import { Autocomplete, TextField } from "@mui/material";

import { LocationAutocompleteOption, Position } from "./types";
import useGetClosestCity from "./use-get-closest-city";
import { debounce } from "./utils";

export default function LocationAutocomplete({ pos }: { pos: Position }) {
  const [options, setOptions] = useState<LocationAutocompleteOption[]>([]);
  const closestCity = useGetClosestCity(pos?.latitude, pos?.longitude);
  useEffect(() => {
    if (closestCity) {
      setOptions([closestCity]);
    }
  }, [closestCity]);

  const onInputChange = debounce((v: string) => {
    console.log("v ", v);
    fetch(`/api/search-cities?q=${v}`).then(async (r) => {
      const json = await r.json();
      setOptions(json.cities);
      return;
    });
  }, 1000);
  return (
    <Autocomplete
      freeSolo
      sx={{ maxWidth: { md: "500px" } }}
      options={options}
      getOptionLabel={(o) => {
        if (typeof o === "string") return o;
        return (o as LocationAutocompleteOption).value;
      }}
      value={closestCity ? closestCity.value : ""}
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
