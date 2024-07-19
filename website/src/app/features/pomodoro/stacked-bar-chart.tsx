"use client";

import { Dispatch, SetStateAction, useEffect, useRef } from "react";

import { Box, Tooltip, Typography } from "@mui/material";
import { scaleBand, ScaleLinear, scaleOrdinal } from "d3-scale";
import { schemeRdYlBu } from "d3-scale-chromatic";

import theme from "app/theme";

import { renderActiveTimer, secondsToInputValue } from "./intention-utils";
import {
  marginLeft,
  bandWidthModifer,
  svgHeight,
  marginBottom,
  yAxisLegendOffset,
} from "./stacked-bar-chart-utils";
import { Bars, ChartTypes } from "./types";

interface StackedBarChartProps {
  chartHeading: string;
  bars: Bars;
  x: ScaleLinear<number, number, never>;
  y: ScaleLinear<number, number, never>;
  xScaleRange: number;
  type: ChartTypes;
  svgWidth: number;
  setSVGWidth: Dispatch<SetStateAction<number>>;
}

export default function StackedBarChart({
  chartHeading,
  bars,
  x,
  y,
  xScaleRange,
  type,
  svgWidth,
  setSVGWidth,
}: StackedBarChartProps) {
  const svgRef = useRef<HTMLDivElement | null>(null);
  const colorInterpolator = scaleOrdinal()
    .domain(bars.allLabels)
    .range(schemeRdYlBu[11]);
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
  }, [bars, setSVGWidth]);
  const bands = scaleBand(
    new Array(xScaleRange).fill(0).map((_, i) => i),
    [marginLeft, svgWidth - bandWidthModifer]
  );
  return (
    <Box>
      <Typography variant="h2" textAlign="center" sx={{ fontSize: "3rem" }}>
        {chartHeading}
      </Typography>
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
                  <Tooltip
                    key={d.key}
                    title={
                      <>
                        {d.key} {renderActiveTimer(element[1] - element[0])}
                      </>
                    }
                    placement="right"
                    arrow
                  >
                    <Box
                      component="rect"
                      height={`${y(element[1]) - y(element[0])}px`}
                      y={y(element[0])}
                      width={bands.bandwidth()}
                      id={d.key}
                      fill={colorInterpolator(d.key) as string}
                    />
                  </Tooltip>
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
            transform={`translate(${-marginLeft + yAxisLegendOffset}, ${
              (svgHeight - marginBottom) / 2
            }) rotate(270)`}
            fill="var(--accent)"
            sx={{ fontFamily: theme.typography.fontFamily, fontSize: "18px" }}
          >
            Minutes
          </Box>
          {y.ticks(9).map((t) => {
            const value = t / 60;
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
                  display: value ? "block" : "none",
                  fontSize: "14px",
                }}
              >
                {renderActiveTimer(t)}
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
