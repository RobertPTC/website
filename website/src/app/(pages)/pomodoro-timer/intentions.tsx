"use client";
import { useEffect, useState } from "react";

import { Box, Grid, Typography } from "@mui/material";

import { pomodoroDispatch } from "dispatch";
import Requests, { PomodoroIntentionRequest } from "requests";

import Intention from "./intention";

export default function Intentions() {
  const [intentions, setIntentions] = useState<string[] | null>(null);
  const [loaded, setIsLoaded] = useState(false);
  const [worker, setWorker] = useState<Worker>();
  const [activeIntention, setActiveIntention] = useState("");
  useEffect(() => {
    if (!window) return;
    const storage = Requests["localStorage"](localStorage);
    function getPomodoroIntentions() {
      storage
        .get<PomodoroIntentionRequest>({ uri: "/api/pomodoro-intention" })
        .then((res) => {
          setIsLoaded(true);
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
    return () => {
      worker.terminate();
    };
  }, []);
  if (!intentions?.length && loaded)
    return (
      <Box>
        <Typography sx={{ fontSize: "35px", textAlign: "center" }}>
          Create your first intention ⭐
        </Typography>
      </Box>
    );
  if (!worker) return <Box></Box>;
  if (intentions) {
    return (
      <Grid container columns={4} spacing={1}>
        {intentions.map((i) => {
          return (
            <Grid key={i} mb={1} item xs={4} sm={2} lg={1}>
              <Intention
                intention={i}
                activeIntention={activeIntention}
                worker={worker}
                setActiveIntention={setActiveIntention}
              />
            </Grid>
          );
        })}
      </Grid>
    );
  }
  return <></>;
}
