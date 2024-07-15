"use client";
import { useEffect, useState } from "react";

import { Grid } from "@mui/material";

import { pomodoroDispatch } from "app/dispatch";
import Storage, { PomodoroIntentionRequest } from "app/storage";

import Intention from "./intention";

export default function Intentions() {
  const [intentions, setIntentions] = useState<string[] | null>(null);
  const [worker, setWorker] = useState<Worker>();
  useEffect(() => {
    if (!window) return;
    const storage = Storage["localStorage"](localStorage);
    function getPomodoroIntentions() {
      storage
        .get<PomodoroIntentionRequest>({ uri: "/api/pomodoro-intention" })
        .then((res) => {
          setIntentions(res);
        })
        .catch((e) => {
          console.error("error getting pomodoro intentions", e);
        });
    }
    getPomodoroIntentions();
    pomodoroDispatch.subscribe("setPomodoroIntentions", getPomodoroIntentions);
    pomodoroDispatch.subscribe(
      "deletePomodoroIntention",
      getPomodoroIntentions
    );
    const worker = new Worker("/pomodoro-webworker.js");
    setWorker(worker);
  }, []);
  if (!intentions || !worker) return <></>;
  return (
    <Grid container columns={4} spacing={1}>
      {intentions.map((i) => {
        return (
          <Grid key={i} mb={1} item xs={1}>
            <Intention intention={i} worker={worker} />
          </Grid>
        );
      })}
    </Grid>
  );
}
