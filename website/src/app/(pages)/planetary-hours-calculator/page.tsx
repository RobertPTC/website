import { Box, Typography } from "@mui/material";
import { Metadata } from "next";

import { Nav } from "@app/components/nav";
import MainLayoutWithPadding from "components/main-layout-with-padding";

import PlanetaryHours from "./";

export const metadata: Metadata = {
  description: "Created by Robert P. Cunningham",
  title: "Planetary Hours Calculator",
};

export default function PlanetaryHoursCalculator() {
  return (
    <>
      <MainLayoutWithPadding>
        <Box mb={2}>
          <Typography
            variant="h1"
            sx={{ fontSize: "2rem", textAlign: "center" }}
          >
            Planetary Hours Calculator
          </Typography>
        </Box>
        <PlanetaryHours />
      </MainLayoutWithPadding>
    </>
  );
}
