"use client";

import { useEffect, useState } from "react";

import { scaleBand, scaleLinear } from "d3-scale";
import dayjs from "dayjs";

import { pomodoroDispatch } from "app/dispatch";
import Storage, { PomodorosForMonthRequest } from "app/storage";
const s = Storage.localStorage;

import StackedBarChart from "./stacked-bar-chart";
import { makeMonthBars } from "./stacked-bar-chart-utils";
import { Bars } from "./types";

const svgHeight = 360;
const marginBottom = 20;
const marginLeft = 80;
const bandWidthModifer = 80;

export default function StackedBarChartMonth() {
  const [svgWidth, setSVGWidth] = useState(0);
  const [max, setMax] = useState(0);
  const [bars, setBars] = useState<Bars>();

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
          if (!v) {
            setMax(0);
            setBars(undefined);
            return;
          }
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
        })
        .catch((e) => {
          setMax(0);
          setBars(undefined);
        });
    }
    getPomodorosForMonth();
    pomodoroDispatch.subscribe("deletePomodoroIntention", getPomodorosForMonth);
    pomodoroDispatch.subscribe("setPomodoro", getPomodorosForMonth);
  }, []);

  if (!max || !bars) return <></>;
  const now = dayjs();
  const xScaleRange = now.daysInMonth();
  const chartHeading = `${now.format("MMMM YYYY")}`;
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

  return (
    <StackedBarChart
      chartHeading={chartHeading}
      bars={bars}
      x={x}
      y={y}
      xScaleRange={xScaleRange}
      type="month"
      svgWidth={svgWidth}
      setSVGWidth={setSVGWidth}
    />
  );
}
