"use client";

import { Dispatch, SetStateAction } from "react";

import { Box, Button } from "@mui/material";

import { TimerAction, TimerPrimaryButtonText } from "./types";

export default function TimerControls({
  setTimerAction,
  timerAction,
  buttonText,
}: {
  setTimerAction: Dispatch<SetStateAction<TimerAction>>;
  timerAction: TimerAction;
  buttonText: TimerPrimaryButtonText;
}) {
  return (
    <Box>
      <Button
        onClick={() => {
          if (!timerAction) {
            setTimerAction(1);
            return;
          }
          setTimerAction(0);
        }}
        variant="contained"
      >
        {buttonText}
      </Button>
      <Button onClick={() => setTimerAction(0)}>Reset</Button>
    </Box>
  );
}
