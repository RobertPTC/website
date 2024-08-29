import { Box, Button, TextField } from "@mui/material";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

import {
  loginSessionID,
  loginSessionIDMaxAge,
  loginReferrer,
} from "@app/cookies";
import { withServiceRequestVerificationCode } from "@app/server-actions";

export default function Login({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined };
}) {
  async function formAction(formData: FormData) {
    "use server";
    const sessionID = await withServiceRequestVerificationCode(formData);
    if (sessionID) {
      cookies().set(loginSessionID, sessionID, {
        httpOnly: true,
        secure: true,
        maxAge: loginSessionIDMaxAge,
        sameSite: "strict",
      });
    }
    if (searchParams.referrer) {
      cookies().set(loginReferrer, searchParams.referrer as string);
    }
    redirect("/verify-code");
  }
  return (
    <Box component="form" action={formAction}>
      <TextField name="email" label="email" />
      <Button type="submit">Submit</Button>
    </Box>
  );
}
