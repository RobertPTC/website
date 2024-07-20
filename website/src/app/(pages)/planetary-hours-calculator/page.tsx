import { Box } from "@mui/material";
import { Metadata } from "next";

import MainLayoutWithPadding from "app/components/main-layout-with-padding";

import PlanetaryHours from "./";

export const metadata: Metadata = {
  description: "Created by Robert P. Cunningham",
  title: "Planetary Hours Calculator",
};

export default function PlanetaryHoursCalculator() {
  return (
    <MainLayoutWithPadding>
      <PlanetaryHours />
    </MainLayoutWithPadding>
  );
}
