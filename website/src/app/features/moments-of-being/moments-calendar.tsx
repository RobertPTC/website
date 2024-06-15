"use client";

import { useState } from "react";

import {
  Box,
  CircularProgress,
  Grid,
  Popper,
  TextField,
  Typography,
} from "@mui/material";
import { scaleSequential } from "d3-scale";
import { interpolateBlues } from "d3-scale-chromatic";
import Link from "next/link";

import { MomentOption, MonthMoment } from "app/api/types";
import TrieFactory, { Trie } from "app/trie";

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

const sentenceRegex = /[\w\s;\-–,"]+[\?!\.]/gim;

function createMomentSearchTrie(
  moments: [string, MonthMoment][]
): Trie<MomentOption> | null {
  let momentsTrie: Trie<MomentOption> | null = null;
  if (momentsTrie) return momentsTrie;
  const addWords = () => {
    momentsTrie = TrieFactory();
    moments.forEach(([_, moment]) => {
      moment.moments.all.forEach((v) => {
        v.moment.split(" ").forEach((s) => {
          if (momentsTrie) {
            momentsTrie.addWord(s, {
              label: v.date_string,
              url: `/moments-of-being/moment/${v.id}`,
              momentPreviewText:
                v.moment.match(sentenceRegex)?.slice(0, 2).join(" ") || "",
              id: v.id,
            });
          }
        });
      });
    });
  };
  addWords();
  return momentsTrie;
}

export default function MomentsCalendar({ year }: { year: string }) {
  const moments = useMoments({ year, month: undefined, date: undefined });
  const [searchOptions, setSearchOptions] = useState<MomentOption[]>([
    { label: "hello world", id: "1", momentPreviewText: "", url: "" },
  ]);
  const [searchAnchorElement, setSearchAnchorElement] =
    useState<HTMLElement | null>(null);
  if (!moments)
    return (
      <Box>
        <Box
          sx={{
            height: "100%",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            flexDirection: "column",
          }}
        >
          <Typography sx={{ fontSize: "18px", textAlign: "center" }}>
            Loading moments calendar
          </Typography>
          <CircularProgress
            size={40}
            sx={{ ".MuiCircularProgress-circle": { stroke: "var(--accent)" } }}
          />
        </Box>
      </Box>
    );
  const entries = Object.entries(moments);
  const momentsSearchTrie = createMomentSearchTrie(entries);
  const timeFormat = Intl.DateTimeFormat("en", { month: "long" });

  return (
    <>
      <Box sx={{ maxWidth: "calc(50% - 8px)", display: "flex" }}>
        <Box sx={{ width: "20%" }}>
          <Typography sx={{ fontSize: "24px", mb: 2 }}>{year}</Typography>
        </Box>
        <Box sx={{ width: "80%", position: "relative" }}>
          <TextField
            fullWidth
            size="small"
            onChange={(e) => {
              if (momentsSearchTrie) {
                let seenMomentIDs: { [key: string]: string } = {};
                const options = momentsSearchTrie
                  .findWords(e.currentTarget.value)
                  .map((v) => v.data)
                  .filter((v) => {
                    if (seenMomentIDs[v.id]) return false;
                    seenMomentIDs[v.id] = v.id;
                    return true;
                  });
                setSearchOptions(options);
                setSearchAnchorElement(e.currentTarget);
              }
            }}
          />
          <Popper
            open={!!searchAnchorElement}
            anchorEl={searchAnchorElement}
            placement="bottom-start"
            disablePortal
          >
            <Box
              sx={{
                border: 1,
                borderColor: "var(--accent)",
                bgcolor: "rgb(var(--background-start-rgb))",
                width: "100%",
                p: 2,
                maxHeight: "200px",
                overflowY: "scroll",
              }}
            >
              {searchOptions.map((o) => {
                return (
                  <Box key={o.id} sx={{ mb: 2 }}>
                    <Link href={o.url}>
                      <Typography sx={{ mb: 1 }}>{o.label}</Typography>
                    </Link>
                    <Typography sx={{ whiteSpace: "pre-line" }}>
                      {o.momentPreviewText}
                    </Typography>
                  </Box>
                );
              })}
            </Box>
          </Popper>
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
                          const color = colorInterpolator(score);
                          return (
                            <Grid
                              item
                              key={d}
                              xs={1}
                              sx={{
                                display: "flex",
                                justifyContent: "center",
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
                                  <Typography>{d}</Typography>
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
