"use client";

import { Box } from "@mui/material";
import { DatePicker } from "@mui/x-date-pickers";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";

import useDate from "app/components/planetary-hours/use-date";
import usePosition from "app/components/planetary-hours/use-position";

import useGetPlanetaryHours from "./use-get-planetary-hours";

export default function PlanetaryHours() {
  const [pos] = usePosition();
  const [date] = useDate();
  useGetPlanetaryHours(pos, date);
  return (
    <Box>
      <Box>Planetary Hours</Box>
      <Box>Latitude: {pos?.latitude}</Box>
      <Box>Longitude: {pos?.longitude}</Box>
      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <DatePicker label="Date" value={date} />
      </LocalizationProvider>
    </Box>
  );
}
