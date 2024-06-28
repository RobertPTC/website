import { Box } from "@mui/material";
import { rollup, max, InternMap, sum, min } from "d3-array";
import { scaleLinear, scaleOrdinal } from "d3-scale";
import { schemeRdYlBu } from "d3-scale-chromatic";

const d = {
  9: [
    { label: "website", seconds: 1920 },
    { label: "website", seconds: 3840 },
    { label: "learning", seconds: 960 },
    { label: "substack", seconds: 400 },
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
};

function mapRollup(r: InternMap<string, number>) {
  const i = r.entries();
  let entry = i.next();
  let rects = [];
  while (!entry.done) {
    rects.push({ key: entry.value[0], value: entry.value[1] });
    entry = i.next();
  }
  return rects;
}

const r = rollup(
  d["9"],
  (d) => {
    return d.reduce((p, c) => p + c.seconds, 0);
  },
  (d) => d.label
);
const rects = mapRollup(r);

export default function StackedBarChart() {
  const sumSeconds = sum(r.values());
  const minSeconds = min(r.values());
  const maxSeconds = max(r.values());
  if (!maxSeconds || !minSeconds) return <></>;
  const y = scaleLinear().domain([0, sumSeconds]).range([0, 360]);
  const colorInterpolator = scaleOrdinal()
    .domain(rects.map((r) => r.key))
    .range(schemeRdYlBu[rects.length]);
  return (
    <Box component="svg" id="stacked-bar-chart" width="100%" height="360px">
      {rects.map((d, i) => {
        return (
          <Box
            component="rect"
            height={y(d.value)}
            width={5}
            id={d.key}
            key={d.key}
            fill={colorInterpolator(d.key) as string}
            y={y(sumSeconds) - y(d.value)}
          />
        );
      })}
    </Box>
  );
}
