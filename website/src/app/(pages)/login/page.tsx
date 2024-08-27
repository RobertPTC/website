import { Box, Button, TextField } from "@mui/material";

import { withServiceRequestVerificationCode } from "@app/server-actions";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export default function Login({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined };
}) {
  async function formAction(formData: FormData) {
    "use server";
    const sessionID = await withServiceRequestVerificationCode(formData);
    if (sessionID) {
      cookies().set("loginSessionID", sessionID, {
        httpOnly: true,
        maxAge: 60 * 5,
      });
    }
    if (searchParams.referrer) {
      cookies().set("loginReferrer", searchParams.referrer as string);
    }
    redirect("/verify-token");
  }
  return (
    <Box component="form" action={formAction}>
      <TextField name="email" />
      <Button type="submit">Submit</Button>
    </Box>
  );
}
