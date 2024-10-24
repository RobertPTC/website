"use client";
import { Box } from "@mui/material";

import useDarkMode from "./use-dark-mode";

export default function GoogleTimerSchematic() {
  const isDarkMode = useDarkMode();
  if (isDarkMode) {
    return (
      <Box
        component="img"
        src="/pomodoro-schematic-dark.svg"
        width="100%"
        alt="schematic of google timer"
      />
    );
  }
  return (
    <Box
      component="img"
      src="/pomodoro-schematic.svg"
      width="100%"
      alt="schematic of google timer"
    />
  );
}
