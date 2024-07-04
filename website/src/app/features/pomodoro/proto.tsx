"use client";
import { useState, useRef, useEffect } from "react";

import { Box, TextField, Typography } from "@mui/material";

import Timer from "./timer";
import TimerControls from "./timer-controls";
import { TimerAction, TimerPrimaryButtonText } from "./types";

export default function DayView() {
  const formRef = useRef<HTMLFormElement>(null);
  // Timer controls
  const [seconds, setSeconds] = useState(0);
  const [timerAction, setTimerAction] = useState<TimerAction>("stop");
  const [primaryButtonText, setPrimaryButtonText] =
    useState<TimerPrimaryButtonText>("Start");
  const countdownRef = useRef<null | NodeJS.Timeout>(null);
  // Create label modal
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

  const onSubmit = () => {
    if (!seconds) {
    }
  };
  return (
    <Box display="flex" flexDirection="column" sx={{ p: 2 }}>
      {seconds}
      <Box>
        <Typography variant="h2" sx={{ fontSize: "16px" }}>
          Set an Intention and Duration for this Pomodoro
        </Typography>
        <Box component="form" ref={formRef} onSubmit={onSubmit}>
          <TextField label="Intention" variant="standard" name="intention" />
          <TextField label="Duration" variant="standard" name="duration" />
          <TimerControls
            onReset={() => setTimerAction("reset")}
            buttonText={primaryButtonText}
          />
        </Box>
        <Timer />
      </Box>
    </Box>
  );
}
