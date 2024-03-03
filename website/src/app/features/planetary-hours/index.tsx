"use client";

import { Box, Grid, Typography } from "@mui/material";
import { DatePicker } from "@mui/x-date-pickers";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";

import useDate from "app/features/planetary-hours/use-date";
import usePosition from "app/features/planetary-hours/use-position";

import CurrentHour from "./current-hour";
import LocationAutocomplete from "./location-autocomplete";
import PlanetaryHourCard from "./planetary-hour-card";
import { LocationAutocompleteOption, SearchParams } from "./types";
import useGetPlanetaryHours from "./use-get-planetary-hours";
import useSearchParams from "./use-search-params";

export default function PlanetaryHours() {
  const searchParams = useSearchParams();
  const [pos, setPos] = usePosition(searchParams.location);
  const [dateInput, setDate] = useDate();
  const planetaryHours = useGetPlanetaryHours(pos, dateInput);
  const onOptionSelect = (o: LocationAutocompleteOption | null) => {
    if (o && o.data) {
      setPos({
        latitude: Number(o.data.lat),
        longitude: Number(o.data.lng),
        state: "success",
      });
      searchParams.set(SearchParams.LOCATION, o.data.city);
      return;
    }
    searchParams.delete(SearchParams.LOCATION);
  };

  return (
    <Box p={3}>
      <Box mb={2}>
        <Typography variant="h1" sx={{ fontSize: "36px", textAlign: "center" }}>
          Planetary Hours Calculator
        </Typography>
      </Box>
      <Box mb={3}>
        {dateInput.isCurrent && <CurrentHour hours={planetaryHours?.hours} />}
      </Box>
      <Grid container spacing={2} mb={5}>
        <Grid item xs={12} md={6} display="flex" justifyContent="flex-end">
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <DatePicker
              label="Date"
              value={dateInput.date}
              slotProps={{
                textField: {
                  fullWidth: true,
                  sx: { maxWidth: { md: "500px" } },
                },
              }}
              onChange={(d) => {
                if (d) {
                  setDate({ date: d, isCurrent: false });
                }
              }}
            />
          </LocalizationProvider>
        </Grid>
        <Grid item xs={12} md={6}>
          <LocationAutocomplete
            pos={pos}
            onOptionSelect={onOptionSelect}
            searchParam={searchParams.location}
          />
        </Grid>
      </Grid>
      {planetaryHours && (
        <Grid container spacing={2}>
          {planetaryHours.hours.map((h) => (
            <Grid key={h.hourStart.toISOString()} item xs={12} sm={4} md={3}>
              <PlanetaryHourCard h={h} />
            </Grid>
          ))}
        </Grid>
      )}
    </Box>
  );
}
