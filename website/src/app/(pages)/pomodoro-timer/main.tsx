"use client";

import { Box, Typography } from "@mui/material";

import IntentionForm from "./intention-form";
import Intentions from "./intentions";
import StackedBarChartWidget from "./stacked-bar-chart-widget";

export default function Main() {
  return (
    <>
      <Box mb={2}>
        <Typography variant="h1" fontSize="3.25rem" textAlign="center">
          Pomodoro Timer
        </Typography>
      </Box>
      <Box mb={3}>
        <IntentionForm />
      </Box>
      <Box mb={5}>
        <Intentions />
      </Box>
      <Box sx={{ display: ["none", "none", "block", "block", "block"] }}>
        <StackedBarChartWidget />
      </Box>
    </>
  );
}
