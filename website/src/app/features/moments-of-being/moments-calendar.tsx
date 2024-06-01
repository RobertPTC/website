"use client";

import { Box, Grid } from "@mui/material";
import { scaleSequential } from "d3-scale";
import { interpolateBlues } from "d3-scale-chromatic";

import useMoments from "./use-moments";

function daysInMonth(month: number, year: number) {
  return new Date(year, month, 0).getDate();
}

function daysArray(daysInMonth: number) {
  let days: number[] = [];
  for (let index = 1; index <= daysInMonth; index++) {
    days = [...days, index];
  }
  return days;
}

const colorInterpolator = scaleSequential([-5, 5], interpolateBlues);

export default function MomentsCalendar({ year }: { year: string }) {
  const moments = useMoments({ year });
  if (!moments) return <></>;
  const entries = Object.entries(moments);
  return (
    <Grid container>
      {entries.map(([k, v]) => {
        const days = daysArray(daysInMonth(Number(k) + 1, Number(year)));
        const firstDay = new Date(Number(year), Number(k)).getDay();
        const daysGrid: Array<Array<number | undefined>> = [];
        let weekCounter = 0;
        for (let index = 0; index < days.length + firstDay; index++) {
          let week = daysGrid[weekCounter] || [];
          if (index < firstDay) {
            daysGrid[weekCounter] = [...week, undefined];
            continue;
          }
          week = [...week, index - firstDay + 1];
          if (index === days.length + firstDay - 1) {
            for (let j = week.length; j < 7; j++) {
              week = [...week, undefined];
            }
          }
          daysGrid[weekCounter] = week;
          if (week.length === 7) {
            weekCounter += 1;
          }
        }
        const moments = v.moments;
        return (
          <Box key={k}>
            Month: {k}{" "}
            <Grid item container columns={7}>
              {days.map((d) => {
                const momentsForDate = moments[d];
                if (momentsForDate) {
                  const score = momentsForDate.reduce((p, c, i, a) => {
                    return p + Number(a[i].score);
                  }, 0);
                  const color = colorInterpolator(score);
                  return (
                    <Grid item key={d} xs={1} sx={{ backgroundColor: color }}>
                      {d}
                    </Grid>
                  );
                }
                return (
                  <Grid item key={d} xs={1}>
                    {d}
                  </Grid>
                );
              })}
            </Grid>
          </Box>
        );
      })}
    </Grid>
  );
}
