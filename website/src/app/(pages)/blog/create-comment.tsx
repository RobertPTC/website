import { ErrorBoundary } from "react-error-boundary";

import { Box, Button, TextField } from "@mui/material";

import createCommentAction from "./create-comment-action";

export default function CreateComment({
  respondsTo,
  blogID,
}: {
  respondsTo: string;
  blogID: string;
}) {
  return (
    <ErrorBoundary
      fallback={<div>Something went wrong. Please try again later!</div>}
    >
      <Box component="form" action={createCommentAction}>
        <Box
          component="input"
          type="hidden"
          name="respondsTo"
          value={respondsTo}
        />
        <Box component="input" type="hidden" name="blogID" value={blogID} />
        <TextField multiline name="text" variant="standard" />
        <Button type="submit">Add a comment</Button>
      </Box>
    </ErrorBoundary>
  );
}
