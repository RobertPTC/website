import { Box } from "@mui/material";
import { Metadata } from "next";

import PlanetaryHours from "./planetary-hours";

export const metadata: Metadata = {
  description: "Created by Robert P. Cunningham",
  title: "Planetary Hours Calculator",
};

export default function PlanetaryHoursCalculator() {
  return (
    <Box>
      <PlanetaryHours />
    </Box>
  );
}
