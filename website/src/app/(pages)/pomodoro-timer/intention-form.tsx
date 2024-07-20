"use client";
import { FormEvent, useRef } from "react";

import { Box, Button, TextField } from "@mui/material";

import { pomodoroDispatch } from "app/dispatch";
import Storage from "app/storage";

export default function PomIntentionForm() {
  const formRef = useRef<HTMLFormElement>(null);
  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!window || !formRef.current) return;
    const storage = Storage["localStorage"](localStorage);
    const formValues = new FormData(formRef.current);
    const intention = formValues.get("intention") as string;
    if (!intention) {
      throw new Error("intention not set");
    }
    formRef.current.reset();
    await storage.set({
      uri: "/api/pomodoro-intention",
      data: { intention },
    });
    pomodoroDispatch.publish("setPomodoroIntentions");
  };
  return (
    <Box component="form" onSubmit={onSubmit} ref={formRef} display="flex">
      <TextField label="New Intention" name="intention" sx={{ mr: 2 }} />
      <Button type="submit" variant="outlined">
        Create Intention
      </Button>
    </Box>
  );
}
