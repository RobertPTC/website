"use client";
import { useEffect, useState } from "react";

import { Box } from "@mui/material";

import { pomodoroDispatch } from "app/dispatch";
import Storage, { PomodoroIntentionRequest } from "app/storage";

import Intention from "./intention";

export default function Intentions() {
  const [intentions, setIntentions] = useState<string[] | null>([]);
  useEffect(() => {
    if (!window) return;
    const storage = Storage["localStorage"](localStorage);
    const getPomodoroIntentions = () => {
      storage
        .get<PomodoroIntentionRequest>({ uri: "/api/pomodoro-intention" })
        .then((res) => {
          setIntentions(res);
        });
    };
    getPomodoroIntentions();
    pomodoroDispatch.subscribe("setPomodoroIntentions", () => {
      getPomodoroIntentions();
    });
  }, []);
  if (!intentions) return <></>;
  return (
    <>
      {intentions.map((i) => {
        return (
          <Box key={i} mb={1}>
            <Intention intention={i} />
          </Box>
        );
      })}
    </>
  );
}
