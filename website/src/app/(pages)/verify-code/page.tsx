import { Box, Button, TextField } from "@mui/material";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

import { withServiceVerifyCode } from "@app/server-actions";

export default function VerifyToken() {
  async function action(formData: FormData) {
    "use server";
    const sessionID = cookies().get("loginSessionID");
    const isValid = await withServiceVerifyCode(sessionID, formData);
    if (!isValid) {
      // redirect("/login?prompt=invalid");
    }
    console.log("create JWT ");
  }
  return (
    <Box component="form" action={action}>
      <TextField label="Email" name="email" />
      <TextField label="Verification Code" name="verification-code" />
      <Button type="submit">Submit</Button>
    </Box>
  );
}
