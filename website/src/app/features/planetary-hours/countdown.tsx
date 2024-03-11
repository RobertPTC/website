import { Box } from "@mui/material";

import { PlanetaryHour } from "./types";

const circularPath = "M 50, 50 m -45, 0 a 45,45 0 1,0 90,0 a 45,45 0 1,0 -90,0";

export default function Countdown({ hours }: { hours: PlanetaryHour[] }) {
  const currentHour = hours.find((h) => h.isCurrent);
  if (!currentHour) return <></>;

  const hourEnd = currentHour.hourEnd.valueOf();
  const hourStart = currentHour.hourStart.valueOf();
  const elapsed = +new Date() - hourStart.valueOf();
  const hourLength = hourEnd - hourStart;
  const ratio = elapsed / hourLength;
  const startDash = 283 - 283 * ratio;
  const animationDuration = hourLength - elapsed;
  console.log("animationDuration ", animationDuration);
  console.log("startDash ", startDash);
  console.log("second ", hourLength / 1000 / 60);
  return (
    <Box>
      <Box component="svg" sx={{ height: "100px", width: "100px" }}>
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
              "@keyframes elapsed-time": {
                "0%": {
                  strokeDasharray: `${startDash} 283`,
                },
                "100%": {
                  strokeDasharray: "0 283",
                },
              },
              animation: `elapsed-time ${animationDuration}ms linear`,
              stroke: currentHour.color,
              strokeWidth: "6px",
            }}
            d={circularPath}
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
            id="iconic-anim-clock-minute-hand"
            stroke="red"
            x1="50"
            y1="0"
            x2="50"
            y2="50"
          />
          <Box
            component="animateTransform"
            type="rotate"
            fill="remove"
            restart="always"
            calcMode="discrete"
            accumulate="none"
            additive="sum"
            xlinkHref="#iconic-anim-clock-minute-hand"
            repeatCount="indefinite"
            dur="3600s"
            to="360 192 192"
            from="0 192 192"
            attributeName="transform"
            attributeType="xml"
          />
          <Box
            component="line"
            id="second-hand-e"
            fill="none"
            stroke={currentHour.color}
            strokeWidth="2px"
            x1="0"
            y1="50"
            x2="50"
            y2="50"
          />
          <Box
            component="line"
            id="second-hand-c"
            fill="none"
            stroke="yellow"
            strokeWidth="2px"
            x1="0"
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
