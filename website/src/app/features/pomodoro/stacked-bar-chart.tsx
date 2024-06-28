import { Box } from "@mui/material";
import { rollup, InternMap, sum, index, union } from "d3-array";
import { scaleLinear, scaleOrdinal } from "d3-scale";
import { schemeRdYlBu } from "d3-scale-chromatic";
import { stack } from "d3-shape";

const d = {
  9: [
    { hour: 9, label: "website", seconds: 1920 },
    { hour: 9, label: "website", seconds: 3840 },
    { hour: 9, label: "learning", seconds: 960 },
    { hour: 9, label: "substack", seconds: 400 },
    { hour: 9, label: "running", seconds: 2500 },
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

function mapRollup(r: InternMap<string, number>, hour: number) {
  const i = r.entries();
  let entry = i.next();
  let result = [];
  while (!entry.done) {
    result.push({ label: entry.value[0], seconds: entry.value[1], hour });
    entry = i.next();
  }
  return result;
}

const r = rollup(
  d["9"],
  (d) => {
    return d.reduce((p, c) => p + c.seconds, 0);
  },
  (d) => d.label
);
const rects = mapRollup(r, 9);
const hourIndex = index(
  rects,
  (d) => d.hour,
  (d) => d.label
);
const series = stack()
  .keys(union(d["9"].map((d) => d.label)))
  // @ts-ignore
  .value(([, group], key) => group.get(key).seconds)(hourIndex);

export default function StackedBarChart() {
  const sumSeconds = sum(r.values());
  const y = scaleLinear().domain([0, sumSeconds]).rangeRound([0, 360]);
  const colorInterpolator = scaleOrdinal()
    .domain(rects.map((r) => r.label))
    .range(schemeRdYlBu[rects.length]);
  return (
    <Box
      component="svg"
      id="stacked-bar-chart"
      width="100%"
      height="360px"
      sx={{ border: "1px solid" }}
    >
      {series.map((d, i) => {
        const element: any = d[0];
        return (
          <Box
            component="rect"
            height={y(element[1]) - y(element[0])}
            y={y(element[0])}
            width={5}
            id={d.key}
            key={d.key}
            fill={colorInterpolator(d.key) as string}
          />
        );
      })}
    </Box>
  );
}
