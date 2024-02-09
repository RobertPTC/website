import { Box } from "@mui/material";
import { Metadata } from "next";

import PlanetaryHours from "./planetary-hours";

export const metadata: Metadata = {
  title: "Planetary Hours Calculator",
  description: "Created by Robert P. Cunningham",
};

export default function PlanetaryHoursCalculator() {
  return (
    <Box>
      <Box>
        <PlanetaryHours />
      </Box>
    </Box>
  );
}
