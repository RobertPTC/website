"use client";

import { Dispatch, FormEvent, SetStateAction, useRef, useState } from "react";

import { Box, Button, TextField, Snackbar, Alert } from "@mui/material";

type SnackbarMetadata = {
  message: string;
  severity: "success" | "error";
} | null;

function SB({
  snackbarMeta,
  handleSnackbarClose,
}: {
  snackbarMeta: SnackbarMetadata;
  handleSnackbarClose: (
    event?: React.SyntheticEvent | Event,
    reason?: string
  ) => void;
}) {
  if (!snackbarMeta) return <></>;
  return (
    <Snackbar
      open={!!snackbarMeta}
      autoHideDuration={6000}
      onClose={handleSnackbarClose}
    >
      <Alert severity={snackbarMeta.severity} variant="filled">
        {snackbarMeta.message}
      </Alert>
    </Snackbar>
  );
}

export default function MomentForm() {
  const formRef = useRef<HTMLFormElement>(null);
  const momentID = useRef<string | null>(null);
  const [snackbarMeta, setSnackbarMeta] = useState<SnackbarMetadata>(null);
  async function onSubmit(e: FormEvent) {
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
      if (!momentID.current) {
        try {
          const res = await fetch("/api/moments-of-being/create-moment", {
            method: "POST",
            body: JSON.stringify(values),
          });
          if (!res.ok) {
            throw new Error(res.statusText);
          }
          const json = await res.json();
          setSnackbarMeta({
            message: "Your moment was saved successfully",
            severity: "success",
          });
          momentID.current = json.id;
        } catch (e) {
          setSnackbarMeta({
            message: "Something went wrong saving your moment",
            severity: "error",
          });
        }
        return;
      }
      try {
        const res = await fetch("/api/moments-of-being/update-moment", {
          method: "PUT",
          body: JSON.stringify({ id: momentID.current, moment: values.moment }),
        });
        if (!res.ok) {
          throw new Error(res.statusText);
        }
        setSnackbarMeta({
          message: "Your moment was updated successfully",
          severity: "success",
        });
      } catch (error) {
        setSnackbarMeta({
          message: "Something went wrong saving your moment",
          severity: "error",
        });
      }
    }
  }
  function handleSnackbarClose(
    event?: React.SyntheticEvent | Event,
    reason?: string
  ) {
    setSnackbarMeta(null);
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
        {momentID.current ? "Update" : "Submit"}
      </Button>
      <SB
        snackbarMeta={snackbarMeta}
        handleSnackbarClose={handleSnackbarClose}
      />
    </Box>
  );
}
