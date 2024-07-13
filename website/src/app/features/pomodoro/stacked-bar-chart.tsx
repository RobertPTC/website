"use client";

import { useEffect, useRef, useState } from "react";

import { Box, Typography } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import { index, InternMap, union } from "d3-array";
import { scaleBand, scaleLinear, scaleOrdinal } from "d3-scale";
import { schemeRdYlBu } from "d3-scale-chromatic";
import { Series, stack } from "d3-shape";
import dayjs from "dayjs";

import { pomodoroDispatch } from "app/dispatch";
import Storage, { PomodorosForMonthRequest } from "app/storage";
const s = Storage.localStorage;

import { Pomodoro, MonthRect } from "./types";

type Bars = {
  bars: (
    | {
        timeUnit: string;
        rects?: undefined;
        dateIndex?: undefined;
        series?: undefined;
        barHeight?: undefined;
      }
    | {
        rects: MonthRect[];
        dateIndex: InternMap<string, InternMap<string, MonthRect>>;
        series: Series<{ [key: string]: number }, string>[];
        barHeight: number;
        timeUnit: string;
      }
  )[];
  allLabels: string[];
};

function rollup(pomodoros: Pomodoro[], date: string): MonthRect[] {
  const labelsToSeconds: { [key: string]: number } = {};
  pomodoros.forEach((p) => {
    const currentSeconds = labelsToSeconds[p.label];
    if (currentSeconds) {
      labelsToSeconds[p.label] += p.seconds;
      return;
    }
    labelsToSeconds[p.label] = p.seconds;
  });
  return Object.entries(labelsToSeconds).map(([label, seconds]) => ({
    label,
    seconds,
    date,
  }));
}

const svgHeight = 360;
const marginBottom = 20;
const marginLeft = 80;
const bandWidthModifer = 80;

function makeMonthBars(d: { [key: string]: Pomodoro[] }) {
  const allLabels: { [key: string]: string } = {};
  const bars = Object.entries(d).map(([timeUnit, pomodoros]) => {
    if (!pomodoros.length) return { timeUnit };
    const rects = rollup(pomodoros, timeUnit);
    const dateIndex = index(
      rects,
      (r) => r.date,
      (r) => r.label
    );
    const labels = union(
      d[timeUnit].map((d) => {
        allLabels[d.label] = d.label;
        return d.label;
      })
    );
    const series = stack()
      .keys(labels)
      // @ts-ignore
      .value(([, group], key) => group.get(key).seconds)(dateIndex);
    const barHeight = series?.[series.length - 1]?.[0]?.[1];

    return {
      rects,
      dateIndex,
      series,
      barHeight,
      timeUnit,
    };
  });
  return { bars, allLabels: Object.keys(allLabels) };
}
const numberOfHours = 24;
export default function StackedBarChart({ type }: { type: "date" | "month" }) {
  const svgRef = useRef<HTMLDivElement | null>(null);
  const [svgWidth, setSVGWidth] = useState(0);
  const [max, setMax] = useState(0);
  const [bars, setBars] = useState<Bars>();
  const xScaleRange = type === "date" ? numberOfHours : dayjs().daysInMonth();
  useEffect(() => {
    function onWindowResize() {
      if (svgRef.current) {
        setSVGWidth(svgRef.current.getBoundingClientRect().width);
      }
    }
    window.addEventListener("resize", onWindowResize);
    onWindowResize();
    return () => {
      window.removeEventListener("resize", onWindowResize);
    };
  }, [bars]);
  useEffect(() => {
    if (!window) return;
    const storage = s(localStorage);
    const date = dayjs();
    function getPomodorosForMonth() {
      storage
        .get<PomodorosForMonthRequest>({
          uri: `/api/pomodoro?year=${date.year()}&month=${date.month()}`,
        })
        .then((v) => {
          const barsData = makeMonthBars(v);
          const maxSeconds = barsData.bars
            .filter((h) => !!h.barHeight)
            .map((h) => h.barHeight)
            .sort((a, b) => {
              if (a && b) {
                return a - b;
              }
              return 0;
            });
          const max = maxSeconds[maxSeconds.length - 1];
          if (max) {
            setMax(max);
          }
          setBars(barsData);
        });
    }
    getPomodorosForMonth();
    pomodoroDispatch.subscribe("deletePomodoroIntention", getPomodorosForMonth);
    pomodoroDispatch.subscribe("setPomodoro", getPomodorosForMonth);
  }, []);
  const theme = useTheme();
  if (!max || !bars) return <></>;

  const bands = scaleBand(
    new Array(xScaleRange).fill(0).map((_, i) => i),
    [marginLeft, svgWidth - bandWidthModifer]
  );
  const x = scaleLinear(
    [0, xScaleRange - 1],
    [marginLeft, svgWidth - bands.bandwidth()]
  );
  const y = scaleLinear()
    .domain([0, max])
    .rangeRound([0, svgHeight - marginBottom * 2]);

  const colorInterpolator = scaleOrdinal()
    .domain(bars.allLabels)
    .range(schemeRdYlBu[3]);
  return (
    <Box>
      <Box ml={`${marginLeft}px`} mb={2} display="flex">
        {bars.allLabels.map((l) => {
          return (
            <Box key={l} display="flex" mr={1}>
              <Box
                bgcolor={colorInterpolator(l) as string}
                height="21px"
                width="21px"
                mr="4px"
              />
              <Typography lineHeight="21px">{l}</Typography>
            </Box>
          );
        })}
      </Box>
      <Box
        component="svg"
        id="stacked-bar-chart"
        width="100%"
        height={`${svgHeight}px`}
        ref={svgRef}
      >
        {bars.bars.map((b, i) => {
          if (!b.barHeight) return <Box component="g" key={b.timeUnit} />;
          const { series, timeUnit } = b;
          const barHeight = series[series.length - 1][0][1];

          return (
            <Box
              component="g"
              key={timeUnit}
              transform={`translate(${x(Number(timeUnit))}, ${
                svgHeight - y(barHeight) - marginBottom
              })`}
            >
              {series.map((d, i) => {
                const element = d[0];
                return (
                  <Box
                    component="rect"
                    height={y(element[1]) - y(element[0])}
                    y={y(element[0])}
                    width={bands.bandwidth()}
                    id={d.key}
                    key={d.key}
                    fill={colorInterpolator(d.key) as string}
                  />
                );
              })}
            </Box>
          );
        })}
        <Box
          component="g"
          id="y-axis"
          transform={`translate(${marginLeft}, 0)`}
        >
          <Box
            component="line"
            x1="0"
            y1="0"
            x2="0"
            y2={svgHeight - marginBottom}
            stroke="var(--accent)"
            strokeWidth="1"
          />
          <Box
            component="text"
            transform={`translate(${-marginLeft + 25}, ${
              (svgHeight - marginBottom) / 2
            }) rotate(270)`}
            fill="var(--accent)"
            sx={{ fontFamily: theme.typography.fontFamily, fontSize: "18px" }}
          >
            Minutes
          </Box>
          {y.ticks(9).map((t) => {
            return (
              <Box
                key={t}
                component="text"
                fill="var(--accent)"
                transform={`translate(${-marginLeft / 2}, ${
                  svgHeight - marginBottom - y(t)
                })`}
                sx={{
                  fontFamily: theme.typography.fontFamily,
                  display: t ? "block" : "none",
                  fontSize: "14px",
                }}
              >
                {Math.floor(t / 60)}
              </Box>
            );
          })}
        </Box>
        <Box
          component="g"
          id="x-axis"
          textAnchor="middle"
          transform={`translate(0, ${svgHeight - marginBottom})`}
        >
          <Box
            component="line"
            x1={marginLeft}
            y1="0"
            x2={svgWidth}
            y2="0"
            stroke="var(--accent)"
            strokeWidth="1"
          />
          {new Array(xScaleRange).fill(0).map((_, i) => {
            return (
              <Box component="g" key={i} transform={`translate(${x(i)},15)`}>
                {type === "date" && (
                  <Box
                    component="text"
                    fill="var(--accent)"
                    sx={{
                      fontFamily: theme.typography.fontFamily,
                      display: i ? "block" : "none",
                    }}
                  >
                    {i === 12 ? i : i % 12}
                    <Box
                      component="tspan"
                      sx={{
                        fontFamily: theme.typography.fontFamily,
                        display: i ? "block" : "none",
                        fontSize: "10px",
                      }}
                    >
                      {i >= 12 ? "pm" : "am"}
                    </Box>
                  </Box>
                )}
                {type === "month" && (
                  <Box
                    component="text"
                    fill="var(--accent)"
                    sx={{
                      fontFamily: theme.typography.fontFamily,
                      display: i ? "block" : "none",
                    }}
                  >
                    {i}
                  </Box>
                )}
              </Box>
            );
          })}
        </Box>
      </Box>
    </Box>
  );
}
