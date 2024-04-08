"use client";

import { FormEvent, useRef } from "react";

import { Box, Button, TextField } from "@mui/material";

export default function MomentForm() {
  const formRef = useRef<HTMLFormElement>(null);
  function onSubmit(e: FormEvent) {
    e.preventDefault();
    if (formRef.current) {
      const formValues = new FormData(formRef.current);
      for (const entry of formValues.entries()) {
        console.log("entry ", entry);
      }
    }
  }
  return (
    <Box component="form" onSubmit={onSubmit} ref={formRef}>
      <TextField label="Moment" name="moment" fullWidth multiline minRows={3} />
      <Button type="submit" variant="outlined" fullWidth>
        Submit
      </Button>
    </Box>
  );
}
