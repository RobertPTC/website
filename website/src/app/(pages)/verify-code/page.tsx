import { Box, Button, TextField } from "@mui/material";

import verifyCode from "@app/authentication/verify-code";

export default function VerifyCode() {
  return (
    <Box component="form" action={verifyCode}>
      <TextField label="Email" name="email" />
      <TextField label="Verification Code" name="verification-code" />
      <Button type="submit">Submit</Button>
    </Box>
  );
}
