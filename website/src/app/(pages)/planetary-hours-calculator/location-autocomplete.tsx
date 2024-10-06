import { SyntheticEvent, useEffect, useState } from "react";

import { Autocomplete, TextField, Paper } from "@mui/material";

import { LocationAutocompleteOption, PositionSuccess } from "./types";
import useGetClosestCity from "./use-get-closest-city";
import { debounce } from "./utils";

export default function LocationAutocomplete({
  searchParam,
  pos,
  onOptionSelect,
}: {
  pos?: PositionSuccess;
  searchParam: string | null;
  onOptionSelect: (o: LocationAutocompleteOption | null) => void;
}) {
  const [options, setOptions] = useState<LocationAutocompleteOption[]>([]);
  const [selectedOption, setSelectedOption] = useState("");
  const closestCity = useGetClosestCity(pos?.latitude, pos?.longitude);
  useEffect(() => {
    if (closestCity && !searchParam) {
      setOptions([closestCity]);
      setSelectedOption(closestCity.value);
    }
  }, [closestCity, searchParam]);

  useEffect(() => {
    if (searchParam) {
      fetch(`/api/search-cities?q=${searchParam}`).then(async (r) => {
        const json = await r.json();
        const c = (json.cities as LocationAutocompleteOption[]).find(
          (c) => c.value === searchParam
        );
        if (c) {
          setSelectedOption(c.value);
          setOptions(json.cities);
          onOptionSelect(c);
        }
        return;
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParam]);

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
      onOptionSelect(v);
      return;
    }
    if (v === null) {
      onOptionSelect(v);
    }
  };
  return (
    <Autocomplete
      freeSolo
      sx={{
        maxWidth: { md: "500px" },
      }}
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
      PaperComponent={(props) => {
        return <Paper>{props.children}</Paper>;
      }}
    />
  );
}
