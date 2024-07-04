import { Box, Button } from "@mui/material";

import { TimerPrimaryButtonText } from "./types";

export default function TimerControls({
  buttonText,
  onReset,
}: {
  buttonText: TimerPrimaryButtonText;
  onReset(): void;
}) {
  return (
    <Box>
      <Button>{buttonText}</Button>
      <Button onClick={onReset} variant="outlined">
        Reset
      </Button>
    </Box>
  );
}
