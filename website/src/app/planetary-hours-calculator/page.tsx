import { Box } from "@mui/material";
import { getSunrise, getSunset } from "sunrise-sunset-js";
import { Metadata } from "next";
import { calculatePlanetaryHourLength } from "./utils";

export const metadata: Metadata = {
  title: "Planetary Hours Calculator",
  description: "Created by Robert P. Cunningham",
};

export default function PlanetaryHoursCalculator() {
  const now = new Date();
  const sunrise = getSunrise(40.654367384881525, -73.94701971291698);
  const sunset = getSunset(40.654367384881525, -73.94701971291698);
  return (
    <Box>
      <Box>
        Day hour length: {calculatePlanetaryHourLength(sunset, sunrise)}
      </Box>
    </Box>
  );
}
