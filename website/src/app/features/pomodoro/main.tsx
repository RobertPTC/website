"use client";
import { useState } from "react";

import {
  Box,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  SelectChangeEvent,
  Typography,
} from "@mui/material";

import IntentionForm from "./intention-form";
import Intentions from "./intentions";
import StackedBarChartDate from "./stacked-bar-chart-date";
import StackedBarChartMonth from "./stacked-bar-chart-month";
import { ChartTypes } from "./types";

export default function Main() {
  const [chartType, setChartType] = useState<ChartTypes>("month");
  const onChangeChartType: (
    event: SelectChangeEvent<ChartTypes>,
    child: React.ReactNode
  ) => void = (e) => {
    setChartType(e.target.value as ChartTypes);
  };

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
      <FormControl>
        <InputLabel id="chart-type-select-label">Chart Type</InputLabel>
        <Select<ChartTypes>
          labelId="chart-type-select-label"
          value={chartType}
          onChange={onChangeChartType}
          label="Chart Type"
          MenuProps={{ disableScrollLock: true }}
        >
          <MenuItem value="month">Month</MenuItem>
          <MenuItem value="date">Date</MenuItem>
        </Select>
      </FormControl>
      {chartType === "month" && <StackedBarChartMonth />}
      {chartType === "date" && <StackedBarChartDate />}
    </>
  );
}
