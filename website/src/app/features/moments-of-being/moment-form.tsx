"use client";

import { FormEvent, useRef } from "react";

import { Box, Button, TextField } from "@mui/material";

export default function MomentForm() {
  const formRef = useRef<HTMLFormElement>(null);
  function onSubmit(e: FormEvent) {
    e.preventDefault();
    if (formRef.current) {
      const formValues = new FormData(formRef.current);
      const date = new Date();
      let values: { [key: string]: FormDataEntryValue } = {
        date_string: date.toLocaleDateString(),
        month: `${date.getMonth()}`,
        year: `${date.getFullYear()}`,
        date: `${date.getDate()}`,
        journalist_id: "c3e3bc64-e05e-439a-9159-24f8bf06bd3a",
      };
      for (const [key, value] of formValues.entries()) {
        values[key] = value;
      }
      fetch("/api/create-moment", {
        method: "POST",
        body: JSON.stringify(values),
      });
    }
  }
  return (
    <Box component="form" onSubmit={onSubmit} ref={formRef}>
      <TextField
        label="Moment"
        name="moment"
        fullWidth
        multiline
        minRows={3}
        sx={{
          "& .MuiOutlinedInput-root": {
            "& fieldset": {
              borderColor: "var(--moments-accent-hex)",
            },
            "&:hover fieldset": {
              borderColor: "var(--moments-accent-hex)",
            },
            "&.Mui-focused fieldset": {
              borderColor: "var(--moments-accent-hex)",
            },
          },
          marginBottom: 2,
        }}
      />
      <Button
        type="submit"
        variant="outlined"
        fullWidth
        sx={{
          borderColor: "var(--moments-accent-hex)",
          "&:hover": { borderColor: "var(--moments-accent-hex)" },
        }}
      >
        Submit
      </Button>
    </Box>
  );
}
