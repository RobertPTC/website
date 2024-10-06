import { useEffect, useRef } from "react";

import { Box } from "@mui/material";
import dayjs from "dayjs";

import { PlanetaryHour } from "./types";

const circularPath = "M 50, 50 m -45, 0 a 45,45 0 1,0 90,0 a 45,45 0 1,0 -90,0";

export default function Countdown({ hour }: { hour: PlanetaryHour }) {
  const hourHandRef = useRef<HTMLElement>();
  const minuteHandRef = useRef<HTMLElement>();
  const hourSecondHandRef = useRef<HTMLElement>();
  const base60SecondHandRef = useRef<HTMLElement>();

  useEffect(() => {
    const now = dayjs();
    const hourEnd = hour.hourEnd.valueOf();
    const hourStart = hour.hourStart.valueOf();
    const elapsed = +new Date() - hourStart.valueOf();
    const hourLength = hourEnd - hourStart;
    const ratio = elapsed / hourLength;
    const startDash = 283 * ratio;
    const minuteArc = 360 * ratio;
    const hourAnimationDuration = hourLength - elapsed;
    const startSecondArc = 360 / now.get("seconds");

    if (
      minuteHandRef.current &&
      hourHandRef.current &&
      hourSecondHandRef.current &&
      base60SecondHandRef.current
    ) {
      const minuteAnimation = minuteHandRef.current.animate(
        [
          { transform: `rotate(${minuteArc}deg)` },
          { transform: `rotate(${minuteArc + 360}deg)` },
        ],
        { duration: hourLength, iterations: Infinity }
      );
      const hourHandAnimation = hourHandRef.current.animate(
        [{ strokeDashoffset: startDash }, { strokeDashoffset: 283 }],
        { duration: hourAnimationDuration, iterations: 1 }
      );
      const hourSecondHandAnimation = hourSecondHandRef.current.animate(
        [
          { transform: `rotate(${startSecondArc}deg)` },
          { transform: `rotate(${startSecondArc + 360}deg)` },
        ],
        { duration: hourLength / 60, iterations: Infinity }
      );
      const base60SecondHandAnimation = base60SecondHandRef.current.animate(
        [
          { transform: `rotate(${startSecondArc}deg)` },
          { transform: `rotate(${startSecondArc + 360}deg)` },
        ],
        { duration: 60 * 1000, iterations: Infinity }
      );

      return () => {
        minuteAnimation.cancel();
        hourHandAnimation.cancel();
        hourSecondHandAnimation.cancel();
        base60SecondHandAnimation.cancel();
      };
    }
  }, [hour.hourEnd, hour.hourStart]);

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
            ref={hourHandRef}
            component="path"
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
            sx={{
              transformOrigin: "50px 50px",
            }}
          />
          <Box
            ref={hourSecondHandRef}
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
              transformOrigin: "50px 50px",
            }}
          />
          <Box
            ref={base60SecondHandRef}
            component="line"
            id="second-hand-c"
            fill="none"
            strokeWidth="2px"
            x1="9"
            y1="50"
            x2="50"
            y2="50"
            sx={{
              transformOrigin: "50px 50px",
              stroke: "rgb(var(--foreground-rgb))",
            }}
          />
        </Box>
      </Box>
    </Box>
  );
}
