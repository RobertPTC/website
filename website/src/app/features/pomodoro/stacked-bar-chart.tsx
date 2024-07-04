import { useEffect, useRef, useState } from "react";

import { Box, Typography, Grid } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import { index, union } from "d3-array";
import { scaleBand, scaleLinear, scaleOrdinal } from "d3-scale";
import { schemeRdYlBu } from "d3-scale-chromatic";
import { stack } from "d3-shape";
import { v4 as uuid } from "uuid";

import { Pomodoro, Rect } from "./types";

const d: { [key: string]: Pomodoro[] } = {
  0: [
    { id: uuid(), label: "learning", seconds: 320 },
    { id: uuid(), label: "poetry", seconds: 480 },
    { id: uuid(), label: "learning", seconds: 640 },
    { id: uuid(), label: "substack", seconds: 400 },
    { id: uuid(), label: "website", seconds: 1920 },
    { id: uuid(), label: "running", seconds: 300 },
  ],
  1: [
    { id: uuid(), label: "website", seconds: 1920 },
    { id: uuid(), label: "learning", seconds: 960 },
    { id: uuid(), label: "substack", seconds: 400 },
    { id: uuid(), label: "running", seconds: 2500 },
  ],
  9: [
    { id: uuid(), label: "website", seconds: 1920 },
    { id: uuid(), label: "learning", seconds: 960 },
    { id: uuid(), label: "substack", seconds: 400 },
    { id: uuid(), label: "running", seconds: 2500 },
  ],
  10: [
    { id: uuid(), label: "website", seconds: 1920 },
    { id: uuid(), label: "poetry", seconds: 1440 },
    { id: uuid(), label: "learning", seconds: 960 },
    { id: uuid(), label: "poetry", seconds: 400 },
  ],
  11: [
    { id: uuid(), label: "website", seconds: 1920 },
    { id: uuid(), label: "poetry", seconds: 960 },
    { id: uuid(), label: "substack", seconds: 640 },
    { id: uuid(), label: "substack", seconds: 400 },
  ],
  12: [
    { id: uuid(), label: "learning", seconds: 320 },
    { id: uuid(), label: "poetry", seconds: 480 },
    { id: uuid(), label: "learning", seconds: 640 },
    { id: uuid(), label: "substack", seconds: 400 },
  ],
  22: [],
  23: [
    { id: uuid(), label: "website", seconds: 1920 },
    { id: uuid(), label: "poetry", seconds: 960 },
    { id: uuid(), label: "substack", seconds: 640 },
    { id: uuid(), label: "substack", seconds: 400 },
  ],
};

function rollup(pomodoros: Pomodoro[], hour: string): Rect[] {
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
    hour,
  }));
}

const svgHeight = 360;
const marginBottom = 20;
const marginLeft = 80;
const numberOfHours = 24;

function hourBars(d: { [key: string]: Pomodoro[] }) {
  const allLabels: { [key: string]: string } = {};
  const hourBars = Object.entries(d).map(([hour, pomodoros]) => {
    if (!pomodoros.length) return { hour };
    const rects = rollup(pomodoros, hour);
    const hourIndex = index(
      rects,
      (r) => r.hour,
      (r) => r.label
    );
    const labels = union(
      d[hour].map((d) => {
        allLabels[d.label] = d.label;
        return d.label;
      })
    );
    const series = stack()
      .keys(labels)
      // @ts-ignore
      .value(([, group], key) => group.get(key).seconds)(hourIndex);
    const barHeight = series?.[series.length - 1]?.[0]?.[1];

    return {
      rects,
      hourIndex,
      series,
      barHeight,
      hour,
    };
  });
  return { hourBars, allLabels: Object.keys(allLabels) };
}

const bars = hourBars(d);

const maxSeconds = bars.hourBars
  .filter((h) => !!h.barHeight)
  .map((h) => h.barHeight)
  .sort();
const max = maxSeconds[maxSeconds.length - 1];

export default function StackedBarChart() {
  const svgRef = useRef<HTMLDivElement | null>(null);
  const [svgWidth, setSVGWidth] = useState(0);
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
  }, []);
  const theme = useTheme();
  if (!max) return <></>;
  const bands = scaleBand(
    new Array(24).fill(0).map((_, i) => i),
    [marginLeft, svgWidth]
  );
  const x = scaleLinear(
    [0, numberOfHours - 1],
    [marginLeft, svgWidth - bands.bandwidth()]
  );
  const y = scaleLinear()
    .domain([0, max])
    .rangeRound([0, svgHeight - marginBottom]);
  const colorInterpolator = scaleOrdinal()
    .domain(bars.allLabels)
    .range(schemeRdYlBu[bars.allLabels.length]);
  return (
    <Box>
      <Grid container ml={`${marginLeft}px`} mb={2}>
        {bars.allLabels.map((l) => {
          return (
            <Grid item key={l} display="flex" mr="4px">
              <Box
                bgcolor={colorInterpolator(l) as string}
                height="21px"
                width="21px"
                mr="4px"
              />
              <Typography lineHeight="21px">{l}</Typography>
            </Grid>
          );
        })}
      </Grid>
      <Box
        component="svg"
        id="stacked-bar-chart"
        width="100%"
        height={`${svgHeight}px`}
        ref={svgRef}
      >
        {bars.hourBars.map((b, i) => {
          if (!b.barHeight) return <Box component="g" key={b.hour} />;
          const { series, hour } = b;
          const barHeight = series[series.length - 1][0][1];

          return (
            <Box
              component="g"
              key={hour}
              transform={`translate(${x(Number(hour))}, ${
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
          {y.ticks().map((t) => {
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
                {t}
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
          {new Array(numberOfHours).fill(0).map((_, i) => {
            return (
              <Box component="g" key={i} transform={`translate(${x(i)},15)`}>
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
              </Box>
            );
          })}
        </Box>
      </Box>
    </Box>
  );
}
