"use client";
import { useState, useEffect, SetStateAction, Dispatch } from "react";

import { scaleBand, scaleLinear } from "d3-scale";

import { pomodoroDispatch } from "app/dispatch";

import StackedBarChart from "./stacked-bar-chart";
import {
  marginLeft,
  bandWidthModifer,
  svgHeight,
  marginBottom,
} from "./stacked-bar-chart-utils";
import { Bars } from "./types";

export default function StackedBarChartContainer({
  getPomodorosForTimeWrapper,
  chartHeading,
  xScaleRange,
}: {
  getPomodorosForTimeWrapper: (
    setMax: Dispatch<SetStateAction<number>>,
    setBars: Dispatch<SetStateAction<Bars | undefined>>
  ) => Function;
  chartHeading: string;
  xScaleRange: number;
}) {
  const [svgWidth, setSVGWidth] = useState(0);
  const [max, setMax] = useState(0);
  const [bars, setBars] = useState<Bars>();

  useEffect(() => {
    if (!window) return;
    const getPomodorosForTime = getPomodorosForTimeWrapper(setMax, setBars);
    pomodoroDispatch.subscribe("deletePomodoroIntention", getPomodorosForTime);
    pomodoroDispatch.subscribe("setPomodoro", getPomodorosForTime);
    return () => {
      pomodoroDispatch.unsubscribe(
        "deletePomodoroIntention",
        getPomodorosForTime
      );
      pomodoroDispatch.unsubscribe("setPomodoro", getPomodorosForTime);
    };
  }, [getPomodorosForTimeWrapper]);

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
