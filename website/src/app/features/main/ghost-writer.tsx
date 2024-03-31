"use client";

import { useEffect, useState } from "react";

import { Box, Typography } from "@mui/material";

let interval: NodeJS.Timeout;

let actionsCounter = 0;

let counter = 0;

let goBack = false;

const actions = [
  "cooking",
  "jogging",
  "napping",
  "painting",
  "praying",
  "programming",
  "reading",
  "trolling",
  "writing",
];

export function GhostWriter() {
  const [c, setC] = useState(0);
  useEffect(() => {
    clearInterval(interval);
    interval = setInterval(() => {
      if (counter < actions[actionsCounter].length && !goBack) {
        counter += 1;
        setC(counter);
        return;
      }
      if (!goBack && counter < actions[actionsCounter].length + 5) {
        counter += 1;
        return;
      }
      if (counter > 0) {
        goBack = true;
        counter -= 1;
        setC(counter);
        return;
      }
      if (!counter) {
        actionsCounter += 1;
        if (actionsCounter >= actions.length) {
          actionsCounter = 0;
        }
        goBack = false;
      }
    }, 300);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return (
    <Box
      sx={{
        "@keyframes cursor": {
          "0%": {
            opacity: 0,
          },
          "100%": {
            opacity: 1,
          },
        },
        display: "flex",
        px: 3,
      }}
    >
      {actions[actionsCounter]
        .slice(0, c)
        .split("")
        .map((v, i) => (
          <Typography
            key={`${v}}${i}`}
            sx={{
              color: "white",
              fontSize: "2.5rem",
            }}
          >
            {v}
          </Typography>
        ))}
      <Typography variant="body1" sx={{ color: "white", fontSize: "2.5rem" }}>
        <Box
          component="span"
          sx={{
            animation: "500ms linear infinite alternate cursor",
          }}
        >
          |
        </Box>
      </Typography>
    </Box>
  );
}
