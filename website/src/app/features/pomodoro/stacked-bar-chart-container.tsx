"use client";
import { useState, useEffect } from "react";

import {
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  SelectChangeEvent,
} from "@mui/material";
import { scaleBand, scaleLinear } from "d3-scale";
import dayjs, { Dayjs } from "dayjs";

import { pomodoroDispatch } from "app/dispatch";
import Storage, { PomodorosForDate, PomodorosForMonth } from "app/storage";

import StackedBarChart from "./stacked-bar-chart";
import {
  marginLeft,
  bandWidthModifer,
  svgHeight,
  marginBottom,
  makeMonthBars,
  makeDateBars,
  numberOfHours,
} from "./stacked-bar-chart-utils";
import { Bars, ChartTypes } from "./types";

const s = Storage.localStorage;

function getMaxSeconds(barsData: Bars) {
  const maxSeconds = barsData.bars
    .filter((h) => !!h.barHeight)
    .map((h) => h.barHeight)
    .sort((a, b) => {
      if (a && b) {
        return a - b;
      }
      return 0;
    });
  return maxSeconds[maxSeconds.length - 1];
}

export default function StackedBarChartWidget() {
  const [svgWidth, setSVGWidth] = useState(0);
  const [max, setMax] = useState(0);
  const [bars, setBars] = useState<Bars>();
  const [chartHeading, setChartHeading] = useState("Container");
  const [xScaleRange, setXScaleRange] = useState(0);
  const [type, setType] = useState<ChartTypes>("month");
  const [date, setDate] = useState<Dayjs>(dayjs());
  useEffect(() => {
    if (!window) return;
    const storage = s(localStorage);
    function responseHandler(v: any) {
      return new Promise((resolve, reject) => {
        if (!v) {
          setMax(0);
          setBars(undefined);
          resolve(undefined);
          return;
        }
        resolve(v);
      });
    }
    function getPomodorosForTimeFrame() {
      if (type === "month") {
        storage
          .get({
            uri: `/api/pomodoro?year=${date.year()}&month=${date.month()}`,
          })
          .then(responseHandler)
          .then((v) => {
            const barsData = makeMonthBars(v as PomodorosForMonth);
            const maxSeconds = getMaxSeconds(barsData);
            if (maxSeconds) {
              setMax(maxSeconds);
            }
            setBars(barsData);
          })
          .catch((e) => {
            setMax(0);
            setBars(undefined);
          });
      }
      if (type === "date") {
        storage
          .get({
            uri: `/api/pomodoro?year=${date.year()}&month=${date.month()}&date=${date.date()}`,
          })
          .then(responseHandler)
          .then((v) => {
            const barsData = makeDateBars(v as PomodorosForDate);
            const maxSeconds = getMaxSeconds(barsData);
            if (maxSeconds) {
              setMax(maxSeconds);
            }
            setBars(barsData);
          })
          .catch((e) => {
            setMax(0);
            setBars(undefined);
          });
      }
    }
    getPomodorosForTimeFrame();
    pomodoroDispatch.subscribe(
      "deletePomodoroIntention",
      getPomodorosForTimeFrame
    );
    pomodoroDispatch.subscribe("setPomodoro", getPomodorosForTimeFrame);
  }, [type, date]);
  useEffect(() => {
    if (type === "month") {
      setXScaleRange(date.daysInMonth());
    }
    if (type === "date") {
      setXScaleRange(numberOfHours);
    }
  }, [type, date]);
  if (!max || !bars) return <></>;
  const bands = scaleBand(
    new Array(xScaleRange).fill(0).map((_, i) => i),
    [marginLeft, svgWidth - bandWidthModifer]
  );
  const x = scaleLinear(
    [0, xScaleRange],
    [marginLeft, svgWidth - bands.bandwidth()]
  );
  const y = scaleLinear()
    .domain([0, max])
    .rangeRound([0, svgHeight - marginBottom * 2]);
  const onChangeChartType: (
    event: SelectChangeEvent<ChartTypes>,
    child: React.ReactNode
  ) => void = (e) => {
    setType(e.target.value as ChartTypes);
  };
  return (
    <>
      <FormControl sx={{ width: "411px" }}>
        <InputLabel id="chart-type-select-label">Chart Type</InputLabel>
        <Select<ChartTypes>
          fullWidth
          labelId="chart-type-select-label"
          value={type}
          onChange={onChangeChartType}
          label="Chart Type"
          MenuProps={{ disableScrollLock: true }}
        >
          <MenuItem value="month">Month</MenuItem>
          <MenuItem value="date">Date</MenuItem>
        </Select>
      </FormControl>
      <StackedBarChart
        chartHeading={chartHeading}
        bars={bars}
        x={x}
        y={y}
        xScaleRange={xScaleRange}
        type={type}
        svgWidth={svgWidth}
        setSVGWidth={setSVGWidth}
      />
    </>
  );
}
