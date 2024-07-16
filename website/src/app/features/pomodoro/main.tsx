import { Box, Typography } from "@mui/material";
import dayjs from "dayjs";

import IntentionForm from "./intention-form";
import Intentions from "./intentions";
import StackedBarChartMonth from "./stacked-bar-chart-month";

export default function Main() {
  const now = dayjs();

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
      <StackedBarChartMonth />
    </>
  );
}
