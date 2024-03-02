import { SyntheticEvent, useEffect, useState } from "react";

import { Autocomplete, TextField } from "@mui/material";

import { LocationAutocompleteOption, Position } from "./types";
import useGetClosestCity from "./use-get-closest-city";
import { debounce } from "./utils";

export default function LocationAutocomplete({
  pos,
  onOptionSelect,
}: {
  pos: Position;
  onOptionSelect: (pos: Position) => void;
}) {
  const [options, setOptions] = useState<LocationAutocompleteOption[]>([]);
  const [selectedOption, setSelectedOption] = useState("");
  const closestCity = useGetClosestCity(pos?.latitude, pos?.longitude);
  useEffect(() => {
    if (closestCity) {
      setOptions([closestCity]);
      setSelectedOption(closestCity.value);
    }
  }, [closestCity]);

  const onInputChange = debounce((v: string) => {
    fetch(`/api/search-cities?q=${v}`).then(async (r) => {
      const json = await r.json();
      setOptions(json.cities);
      return;
    });
  }, 1000);

  const onChange = (
    e: SyntheticEvent<Element, Event>,
    v: string | LocationAutocompleteOption | null
  ) => {
    if (typeof v === "object" && v !== null && v.data) {
      setSelectedOption(v.value);
      onOptionSelect({
        latitude: Number(v.data.lat),
        longitude: Number(v.data.lng),
        state: "success",
      });
    }
  };
  return (
    <Autocomplete
      freeSolo
      sx={{ maxWidth: { md: "500px" } }}
      options={options}
      getOptionLabel={(o) => {
        if (typeof o === "string") return o;
        return (o as LocationAutocompleteOption).value;
      }}
      value={selectedOption}
      renderInput={(params) => (
        <TextField
          {...params}
          label="City"
          InputLabelProps={{ shrink: true }}
        />
      )}
      onChange={onChange}
      onInputChange={(_, v) => {
        onInputChange(v);
      }}
    />
  );
}
