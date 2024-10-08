"use client";

import { Box, Grid, Typography } from "@mui/material";
import { scaleSequential } from "d3-scale";
import { interpolateBlues, interpolateInferno } from "d3-scale-chromatic";
import Link from "next/link";

import { Loading } from "components/loading";

import MomentsSearch from "./moments-search";
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

export default function MomentsCalendar({ year }: { year: string }) {
  const moments = useMoments({ year, month: undefined, date: undefined });

  if (!moments) return <Loading loadingText="Loading moments" />;
  const entries = Object.entries(moments);
  const timeFormat = Intl.DateTimeFormat("en", { month: "long" });

  return (
    <>
      <Box sx={{ maxWidth: "calc(50% - 8px)", display: "flex" }}>
        <Box sx={{ width: "20%" }}>
          <Typography sx={{ fontSize: "24px", mb: 2 }}>{year}</Typography>
        </Box>
        <Box sx={{ width: "80%", position: "relative" }}>
          <MomentsSearch moments={moments} />
        </Box>
      </Box>
      <Grid container>
        {entries.map(([month, v]) => {
          const days = daysArray(daysInMonth(Number(month) + 1, Number(year)));
          const firstDay = new Date(Number(year), Number(month)).getDay();
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
          const dateColorInterpolator = scaleSequential(
            [v.minScore, v.maxScore],
            interpolateBlues
          );
          const dateTextColorInterpolator = scaleSequential(
            [v.minScore, v.maxScore],
            interpolateInferno
          );
          return (
            <Box
              key={month}
              sx={{
                maxWidth: ["100%", "calc(50% - 8px)"],
                border: "1px solid",
                borderColor: "var(--accent)",
                p: 2,
                ml: [0, 1],
                mb: [1, 1],
                ":nth-of-type(2n + 1)": { ml: 0 },
              }}
            >
              <Typography sx={{ mb: 1 }}>
                Month:{" "}
                {timeFormat.format(new Date(Number(year), Number(month)))}
              </Typography>
              <Grid item container columns={7}>
                {["S", "M", "T", "W", "T", "F", "S"].map((day, i) => {
                  return (
                    <Grid item key={`${day}${i}`} xs={1}>
                      <Typography
                        sx={{
                          textAlign: "center",
                          fontWeight: "300",
                          color: "var(--accent)",
                        }}
                      >
                        {day}
                      </Typography>
                    </Grid>
                  );
                })}
              </Grid>
              <Grid item container mb={1}>
                {daysGrid.map((w, i) => {
                  return (
                    <Grid item container key={i} columns={7}>
                      {w.map((d, i) => {
                        if (!d)
                          return <Grid item xs={1} key={`${Date.now()}${i}`} />;
                        const momentsForDate = moments[d];
                        if (momentsForDate) {
                          const score = momentsForDate.reduce((p, c, i, a) => {
                            return p + Number(a[i].score);
                          }, 0);

                          const color = dateColorInterpolator(score);
                          const textColor = dateTextColorInterpolator(score);
                          return (
                            <Grid
                              item
                              key={d}
                              xs={1}
                              sx={{
                                display: "flex",
                                justifyContent: "center",
                                alignItems: "center",
                                height: "30px",
                              }}
                            >
                              <Link
                                href={`/moments-of-being/moments/${year}/${month}/${d}`}
                              >
                                <Box
                                  sx={{
                                    backgroundColor: color,
                                    height: "25px",
                                    width: "25px",
                                    display: "flex",
                                    justifyContent: "center",
                                    alignItems: "center",
                                    borderRadius: "15px",
                                  }}
                                >
                                  <Typography sx={{ color: textColor }}>
                                    {d}
                                  </Typography>
                                </Box>
                              </Link>
                            </Grid>
                          );
                        }
                        return (
                          <Grid
                            item
                            key={d}
                            xs={1}
                            sx={{ display: "flex", justifyContent: "center" }}
                          >
                            <Box
                              sx={{
                                height: "30px",
                                width: "30px",
                                display: "flex",
                                justifyContent: "center",
                                alignItems: "center",
                                borderRadius: "15px",
                              }}
                            >
                              <Typography>{d}</Typography>
                            </Box>
                          </Grid>
                        );
                      })}
                    </Grid>
                  );
                })}
              </Grid>

              <Typography sx={{ color: "var(--accent)" }}>
                Keywords: {v.mostImportantWords.join(", ")}
              </Typography>
            </Box>
          );
        })}
      </Grid>
    </>
  );
}
