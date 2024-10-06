"use client";
import { useState, useEffect } from "react";

import {
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  SelectChangeEvent,
  Grid,
} from "@mui/material";
import {
  DatePicker,
  DateValidationError,
  PickerChangeHandlerContext,
} from "@mui/x-date-pickers";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { scaleBand, scaleLinear } from "d3-scale";
import dayjs, { Dayjs } from "dayjs";

import { pomodoroDispatch } from "dispatch";
import Requests, { PomodorosForDate, PomodorosForMonth } from "requests";

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

const s = Requests.localStorage;

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
  const [date, setDate] = useState<Dayjs | null>(dayjs());
  const [hasPomodoros, setHasPomodoros] = useState(false);

  useEffect(() => {
    if (!window) return;
    const storage = s(localStorage);
    function responseHandler(v: any) {
      return new Promise((resolve, reject) => {
        if (!v) {
          reject();
          return;
        }
        resolve(v);
      });
    }
    function getPomodorosForTimeFrame() {
      if (type === "month" && date) {
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
      if (type === "date" && date) {
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
      storage
        .get({
          uri: `/api/pomodoro`,
        })
        .then(responseHandler)
        .then((v) => {
          setHasPomodoros(!!Object.keys(v as any).length);
        })
        .catch((e) => {
          setHasPomodoros(false);
        });
    }
    getPomodorosForTimeFrame();
    pomodoroDispatch.subscribe(
      "deletePomodoroIntention",
      getPomodorosForTimeFrame
    );
    pomodoroDispatch.subscribe("setPomodoro", getPomodorosForTimeFrame);

    return () => {
      pomodoroDispatch.unsubscribe(
        "deletePomodoroIntention",
        getPomodorosForTimeFrame
      );
      pomodoroDispatch.unsubscribe("setPomodoro", getPomodorosForTimeFrame);
    };
  }, [type, date]);
  useEffect(() => {
    if (type === "month" && date) {
      setXScaleRange(date.daysInMonth() + 1);
      setChartHeading(date.format("MMMM YYYY"));
    }
    if (type === "date" && date) {
      setXScaleRange(numberOfHours);
      setChartHeading(date.format("MMMM DD, YYYY"));
    }
  }, [type, date]);

  const bands = scaleBand(
    new Array(xScaleRange).fill(0).map((_, i) => i),
    [marginLeft, svgWidth - bandWidthModifer]
  );
  const x = scaleLinear(
    [type === "month" ? 1 : 0, xScaleRange],
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
  const onDateChange: (
    value: dayjs.Dayjs | null,
    context: PickerChangeHandlerContext<DateValidationError>
  ) => void = (v) => {
    setDate(v);
  };
  if (!hasPomodoros) return <></>;
  return (
    <>
      <Grid mb={2} container spacing={2}>
        <Grid item md={6} lg={3}>
          <FormControl sx={{ mr: 2, width: "100%" }}>
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
        </Grid>
        <Grid item md={6} lg={3}>
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <DatePicker
              label="Date"
              value={date}
              slotProps={{
                textField: {
                  fullWidth: true,
                },
              }}
              onChange={onDateChange}
            />
          </LocalizationProvider>
        </Grid>
      </Grid>

      {!!(max && bars) && (
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
      )}
    </>
  );
}
