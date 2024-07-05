"use client";
import { FormEvent, useRef } from "react";

import { Box, Button, TextField } from "@mui/material";

import { pomodoroDispatch } from "app/dispatch";
import Storage from "app/storage";

export default function PomIntentionForm() {
  const formRef = useRef(null);
  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!window) return;
    const storage = Storage["localStorage"](localStorage);
    if (!formRef.current) return;
    const formValues = new FormData(formRef.current);
    const intention = formValues.get("intention") as string;
    if (!intention) {
      throw new Error("intention not set");
    }
    storage.set({
      uri: "/api/pomodoro-intention",
      data: { intention },
    });
    pomodoroDispatch.publish("setPomodoroIntentions");
  };
  return (
    <Box component="form" onSubmit={onSubmit} ref={formRef}>
      <TextField label="Create New Intention" name="intention" />
      <Button type="submit">Create Intention</Button>
    </Box>
  );
}
