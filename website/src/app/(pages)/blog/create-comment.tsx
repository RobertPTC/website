"use client";

import { ErrorBoundary } from "react-error-boundary";

import { Box, Button, TextField } from "@mui/material";

import createCommentAction from "./create-comment-action";

export default function CreateComment({ respondsTo }: { respondsTo: string }) {
  return (
    <ErrorBoundary fallback={<div>Something went wrong</div>}>
      <Box component="form" action={createCommentAction}>
        <Box component="input" type="hidden" value={respondsTo} />
        <TextField multiline name="text" />
        <Button type="submit">Submit</Button>
      </Box>
    </ErrorBoundary>
  );
}
