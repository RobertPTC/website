"use client";

import { FormEvent, useRef, useState } from "react";

import { Box, Button, TextField, Snackbar, Alert } from "@mui/material";

import { FormMoment } from "app/api/types";
import Storage, { CreateMomentRequest } from "requests";

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

const storage = Storage["api"](fetch);

export default function MomentForm() {
  const formRef = useRef<HTMLFormElement>(null);

  const [snackbarMeta, setSnackbarMeta] = useState<SnackbarMetadata>(null);
  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    if (formRef.current) {
      const formValues = new FormData(formRef.current);

      const date = new Date();
      let values: FormMoment = {
        date_string: date.toLocaleDateString(),
        month: `${date.getMonth()}`,
        year: `${date.getFullYear()}`,
        date: `${date.getDate()}`,
        // TODO
        journalist_id: "c3e3bc64-e05e-439a-9159-24f8bf06bd3a",
        moment: (formValues.get("moment") || "") as string,
      };
      try {
        const json = await storage.set<CreateMomentRequest>({
          uri: "/api/moments-of-being/create-moment",
          data: values,
        });
        setSnackbarMeta({
          message: "Your moment was saved successfully",
          severity: "success",
        });
        storage.clearCache();
      } catch (e) {
        setSnackbarMeta({
          message: "Something went wrong saving your moment",
          severity: "error",
        });
      }
      return;
    }
  }
  function handleSnackbarClose() {
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
              borderColor: "var(--accent)",
            },
            "&:hover fieldset": {
              borderColor: "var(--accent)",
            },
            "&.Mui-focused fieldset": {
              borderColor: "var(--accent)",
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
          borderColor: "var(--accent)",
          "&:hover": { borderColor: "var(--accent)" },
        }}
      >
        Submit
      </Button>
      <SB
        snackbarMeta={snackbarMeta}
        handleSnackbarClose={handleSnackbarClose}
      />
    </Box>
  );
}
