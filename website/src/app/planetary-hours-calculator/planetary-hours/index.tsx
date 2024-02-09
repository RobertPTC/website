"use client";
import { Box } from "@mui/material";
import { getSunrise, getSunset } from "sunrise-sunset-js";

import { calculatePlanetaryHourLength } from "app/planetary-hours-calculator/utils";

export default function PlanetaryHours() {
  const now = new Date();
  const sunrise = getSunrise(40.654367384881525, -73.94701971291698);
  const sunset = getSunset(40.654367384881525, -73.94701971291698);
  return (
    <Box>Day hour length: {calculatePlanetaryHourLength(sunset, sunrise)}</Box>
  );
}
