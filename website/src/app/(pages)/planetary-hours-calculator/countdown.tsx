import { useEffect, useState } from "react";

import { Box } from "@mui/material";

import { PlanetaryHour } from "./types";

const circularPath = "M 50, 50 m -45, 0 a 45,45 0 1,0 90,0 a 45,45 0 1,0 -90,0";

export default function Countdown({ hour }: { hour: PlanetaryHour }) {
  const hourEnd = hour.hourEnd.valueOf();
  const hourStart = hour.hourStart.valueOf();
  const elapsed = +new Date() - hourStart.valueOf();
  const hourLength = hourEnd - hourStart;
  const ratio = elapsed / hourLength;
  const startDash = 283 * ratio;
  const animationDuration = hourLength - elapsed;
  const minuteArc = 360 * ratio;

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
                "100%": {
                  strokeDashoffset: "283",
                },
              },
              animation: `elapse ${animationDuration}ms linear`,
            }}
            strokeWidth="6px"
            strokeDashoffset={startDash}
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
            component="line"
            id="minute-hand"
            stroke={hour.color}
            x1="8"
            y1="50"
            x2="50"
            y2="50"
            strokeWidth="4px"
            sx={{
              "@keyframes minute": {
                "0%": {
                  transform: `rotate(${minuteArc}deg)`,
                },
                "100%": {
                  transform: "rotate(360deg)",
                },
              },
              animation: `minute ${animationDuration}ms linear`,
              transformOrigin: "50px 50px",
            }}
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
          />
          <Box
            component="animateTransform"
            type="rotate"
            accumulate="none"
            additive="sum"
            xlinkHref="#second-hand-e"
            repeatCount="indefinite"
            dur={hourLength / 1000 / 60}
            to="360 50 50"
            from="0 50 50"
            attributeName="transform"
            attributeType="xml"
          />
          <Box
            component="animateTransform"
            type="rotate"
            accumulate="none"
            additive="sum"
            xlinkHref="#second-hand-c"
            repeatCount="indefinite"
            dur="60"
            to="360 50 50"
            from="0 50 50"
            attributeName="transform"
            attributeType="xml"
          />
        </Box>
      </Box>
    </Box>
  );
}
