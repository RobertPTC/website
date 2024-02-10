"use client";
import { Box } from "@mui/material";

import usePosition from "app/planetary-hours-calculator/planetary-hours/use-position";

export default function PlanetaryHours() {
  const [pos] = usePosition();
  return (
    <Box>
      <Box>Planetary Hours</Box>
      <Box>Latitude: {pos?.latitude}</Box>
      <Box>Longitude: {pos?.longitude}</Box>
    </Box>
  );
}
