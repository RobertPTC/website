import { useEffect, useRef, useState } from "react";

import { Box } from "@mui/material";
import dayjs from "dayjs";

import { PlanetaryHour } from "./types";

const circularPath = "M 50, 50 m -45, 0 a 45,45 0 1,0 90,0 a 45,45 0 1,0 -90,0";

export default function Countdown({ hour }: { hour: PlanetaryHour }) {
  const minuteHandRef = useRef<HTMLElement>();
  const now = dayjs();
  const hourEnd = hour.hourEnd.valueOf();
  const hourStart = hour.hourStart.valueOf();
  const elapsed = +new Date() - hourStart.valueOf();
  const hourLength = hourEnd - hourStart;
  const ratio = elapsed / hourLength;
  const startDash = 283 * ratio;
  const animationDuration = hourLength - elapsed;
  const minuteArc = 360 * ratio;
  const startSecondArc = 360 / now.get("seconds");
  const endSecondArc = 360 + startSecondArc;

  useEffect(() => {
    console.log("hourStart effect ", hourStart, hour.ruler);
  }, [hourStart, hour.ruler]);

  return (
    <Box>
      <Box
        component="svg"
        sx={{ height: "100px", width: "100px" }}
        aria-label="Planetary Hours Clock"
      >
        <Box component="g" sx={{ fill: "none", stroke: "none" }}>
          <Box
            component="circle"
            cx="50"
            cy="50"
            r="45"
            sx={{ stroke: "rgb(var(--elapsed-time-rgb))", strokeWidth: "7px" }}
          />

          <Box
            component="path"
            sx={{
              "@keyframes elapse": {
                "0%": {
                  strokeDashoffset: startDash,
                },
                "100%": {
                  strokeDashoffset: "283",
                },
              },
              animation: `elapse ${animationDuration}ms linear`,
            }}
            strokeWidth="6px"
            strokeDasharray="283"
            stroke={hour.color}
            d={circularPath}
            id="hour-arc"
          />
          <Box
            component="line"
            stroke="rgb(var(--foreground-rgb))"
            x1="7"
            x2="93"
            y1="50"
            y2="50"
          />
          <Box
            component="line"
            stroke="rgb(var(--foreground-rgb))"
            x1="50"
            x2="50"
            y1="7"
            y2="93"
          />
          <Box
            ref={minuteHandRef}
            component="line"
            id="minute-hand"
            stroke={hour.color}
            x1="8"
            y1="50"
            x2="50"
            y2="50"
            strokeWidth="4px"
            // sx={{
            //   "@keyframes minute": {
            //     "0%": {
            //       transform: `rotate(${minuteArc}deg)`,
            //     },
            //     "100%": {
            //       transform: "rotate(360deg)",
            //     },
            //   },
            //   animation: `minute ${animationDuration}ms linear`,
            //   transformOrigin: "50px 50px",
            // }}
          />
          <Box
            component="line"
            id="second-hand-e"
            fill="none"
            stroke={hour.color}
            strokeWidth="2px"
            x1="9"
            y1="50"
            x2="50"
            y2="50"
            sx={{
              "@keyframes secondhande": {
                "0%": {
                  transform: `rotate(${startSecondArc}deg)`,
                },
                "100%": {
                  transform: `rotate(${endSecondArc}deg)`,
                },
              },
              animation: `secondhande ${
                hourLength / 1000 / 60
              }s infinite linear`,
              transformOrigin: "50px 50px",
            }}
          />
          <Box
            component="line"
            id="second-hand-c"
            fill="none"
            stroke="white"
            strokeWidth="2px"
            x1="9"
            y1="50"
            x2="50"
            y2="50"
            sx={{
              "@keyframes secondhandc": {
                "0%": {
                  transform: `rotate(${startSecondArc}deg)`,
                },
                "100%": {
                  transform: `rotate(${endSecondArc}deg)`,
                },
              },
              animation: "secondhandc 60s infinite linear",
              transformOrigin: "50px 50px",
            }}
          />
        </Box>
      </Box>
    </Box>
  );
}
