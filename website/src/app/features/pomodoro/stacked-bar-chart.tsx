import { useEffect, useRef, useState } from "react";

import { Box } from "@mui/material";
import { index, union } from "d3-array";
import { scaleLinear, scaleOrdinal } from "d3-scale";
import { schemeRdYlBu } from "d3-scale-chromatic";
import { stack } from "d3-shape";

import { Pomodoro } from "./types";

const d: { [key: string]: Pomodoro[] } = {
  0: [
    { label: "learning", seconds: 320 },
    { label: "poetry", seconds: 480 },
    { label: "learning", seconds: 640 },
    { label: "substack", seconds: 400 },
  ],
  1: [
    { label: "website", seconds: 1920 },
    { label: "website", seconds: 3840 },
    { label: "learning", seconds: 960 },
    { label: "substack", seconds: 400 },
    { label: "running", seconds: 2500 },
  ],
  9: [
    { label: "website", seconds: 1920 },
    { label: "website", seconds: 3840 },
    { label: "learning", seconds: 960 },
    { label: "substack", seconds: 400 },
    { label: "running", seconds: 2500 },
  ],
  10: [
    { label: "website", seconds: 1600 },
    { label: "poetry", seconds: 1440 },
    { label: "learning", seconds: 960 },
    { label: "poetry", seconds: 400 },
  ],
  11: [
    { label: "website", seconds: 640 },
    { label: "poetry", seconds: 960 },
    { label: "substack", seconds: 640 },
    { label: "substack", seconds: 400 },
  ],
  12: [
    { label: "learning", seconds: 320 },
    { label: "poetry", seconds: 480 },
    { label: "learning", seconds: 640 },
    { label: "substack", seconds: 400 },
  ],
  22: [],
  23: [
    { label: "website", seconds: 640 },
    { label: "poetry", seconds: 960 },
    { label: "substack", seconds: 640 },
    { label: "substack", seconds: 400 },
  ],
};

function rollup(pomodoros: Pomodoro[], hour: string) {
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
const marginLeft = 15;
const numberOfHours = 24;

const hourBars = Object.entries(d).map(([hour, pomodoros]) => {
  if (!pomodoros.length) return null;
  const rects = rollup(pomodoros, hour);
  const hourIndex = index(
    rects,
    (r) => r.hour,
    (r) => r.label
  );
  const series = stack()
    .keys(union(d[hour].map((d) => d.label)))
    // @ts-ignore
    .value(([, group], key) => group.get(key).seconds)(hourIndex);
  const barHeight = series[series.length - 1][0][1];
  return {
    rects,
    hourIndex,
    series,
    barHeight,
  };
});

const maxSeconds = hourBars
  .filter((h) => !!h)
  .map((h) => h?.barHeight)
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
  const x = scaleLinear(
    [0, numberOfHours - 1],
    [marginLeft, svgWidth - svgWidth / numberOfHours]
  );
  if (!max) return <></>;
  return (
    <Box
      component="svg"
      id="stacked-bar-chart"
      width="100%"
      height={`${svgHeight}px`}
      sx={{ border: "1px solid blue" }}
      ref={svgRef}
    >
      {Object.entries(d).map(([hour, pomodoros], i) => {
        if (!pomodoros.length) return <Box key={hour} component="g" />;
        const rects = rollup(pomodoros, hour);
        const hourIndex = index(
          rects,
          (r) => r.hour,
          (r) => r.label
        );
        const series = stack()
          .keys(union(d[hour].map((d) => d.label)))
          // @ts-ignore
          .value(([, group], key) => group.get(key).seconds)(hourIndex);
        const barHeight = series[series.length - 1][0][1];

        const y = scaleLinear()
          .domain([0, max])
          .rangeRound([0, svgHeight - marginBottom]);
        const colorInterpolator = scaleOrdinal()
          .domain(rects.map((r) => r.label))
          .range(schemeRdYlBu[rects.length]);
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
                  width={svgWidth / numberOfHours}
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
        id="x-axis"
        textAnchor="middle"
        transform={`translate(0, ${svgHeight - marginBottom})`}
        strokeWidth="1"
        sx={{ fontFamily: "var(--font-mono)" }}
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
            <Box
              key={i}
              component="text"
              transform={`translate(${x(i)},0)`}
              y={marginBottom - 5}
            >
              {i}
            </Box>
          );
        })}
      </Box>
    </Box>
  );
}
