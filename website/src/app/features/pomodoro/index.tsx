"use client";
import { useState, useRef, useEffect } from "react";

import { Box, TextField, Typography } from "@mui/material";

import Timer from "./timer";
import TimerControls from "./timer-controls";
import { TimerAction, TimerPrimaryButtonText } from "./types";

export default function DayView() {
  // Timer controls
  const [seconds, setSeconds] = useState(3600);
  const [timerAction, setTimerAction] = useState<TimerAction>(0);
  const [primaryButtonText, setPrimaryButtonText] =
    useState<TimerPrimaryButtonText>("Start");
  const countdownRef = useRef<null | NodeJS.Timeout>(null);
  // Create pomodoro modal
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    if (timerAction) {
      setPrimaryButtonText("Stop");
      countdownRef.current = setInterval(() => {
        setSeconds((prev) => {
          return prev - 1;
        });
      }, 1000);
    }
    if (countdownRef.current && !timerAction) {
      clearInterval(countdownRef.current);
    }
    if (!timerAction) {
      setPrimaryButtonText("Start");
    }
  }, [timerAction]);
  return (
    <Box display="flex" flexDirection="column">
      {seconds}
      <Box>
        <Typography variant="h2" sx={{ fontSize: "16px" }}>
          Set an Intention and Duration for this Pomodoro
        </Typography>
        <Box>
          <TextField label="Intention" variant="standard" />
          <TextField label="Duration" variant="standard" />
        </Box>
        <Timer />
        <TimerControls
          setTimerAction={setTimerAction}
          timerAction={timerAction}
          buttonText={primaryButtonText}
        />
      </Box>
    </Box>
  );
}
