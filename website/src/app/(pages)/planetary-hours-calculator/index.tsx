"use client";

import { Box, Grid } from "@mui/material";
import { DatePicker } from "@mui/x-date-pickers";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs from "dayjs";

import { Loading } from "components/loading";

import Countdown from "./countdown";
import CurrentHour from "./current-hour";
import LocationAutocomplete from "./location-autocomplete";
import PlanetaryHourCard from "./planetary-hour-card";
import { LocationAutocompleteOption, SearchParams } from "./types";
import useDate from "./use-date";
import useGetPlanetaryHours from "./use-get-planetary-hours";
import usePosition from "./use-position";
import useSearchParams from "./use-search-params";

export default function PlanetaryHours() {
  const searchParams = useSearchParams();
  const [pos, setPos] = usePosition(searchParams.location);
  const [dateInput, setDate] = useDate(searchParams.date, pos);
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
  const onDateChange = (d: dayjs.Dayjs | null) => {
    if (!d?.isValid()) return;
    if (d) {
      setDate({ date: d, isCurrent: false });
      searchParams.set(SearchParams.DATE, d.toString());
      return;
    }
    searchParams.delete(SearchParams.DATE);
  };
  if (!planetaryHours)
    return <Loading loadingText="Loading Planetary Hours Calculator" />;
  if (pos && pos.state !== "success") return <>No Position</>;
  const currentHour = planetaryHours.hours.find((h) => h.isCurrent);
  return (
    <Box>
      {dateInput && dateInput.isCurrent && currentHour && (
        <Box mb={3}>
          <Box mb={3}>
            <CurrentHour hours={planetaryHours.hours} />
          </Box>
          <Box display="flex" justifyContent="center">
            <Countdown hour={currentHour} />
          </Box>
        </Box>
      )}
      <Grid container spacing={2} mb={5}>
        <Grid item xs={12} md={6} display="flex" justifyContent="flex-end">
          {dateInput?.date && (
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <DatePicker
                label="Date"
                value={dateInput?.date}
                slotProps={{
                  textField: {
                    fullWidth: true,
                    sx: { maxWidth: { md: "500px" } },
                  },
                }}
                onChange={onDateChange}
              />
            </LocalizationProvider>
          )}
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
            <Grid key={h.hourStart.toISOString()} item xs={12} md={6} lg={3}>
              <PlanetaryHourCard h={h} />
            </Grid>
          ))}
        </Grid>
      )}
    </Box>
  );
}
