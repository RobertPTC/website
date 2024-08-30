import { Box, Button, TextField } from "@mui/material";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

import { withServiceRequestVerificationCode } from "@app/authentication";
import {
  loginSessionID,
  loginSessionIDMaxAge,
  loginReferrer,
} from "@app/cookies";

export default function Login({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined };
}) {
  async function formAction(formData: FormData) {
    "use server";
    try {
      const sessionID = await withServiceRequestVerificationCode(formData);
      if (!sessionID) {
        throw new Error("no session id");
      }
      const res = cookies().set(loginSessionID, sessionID, {
        httpOnly: true,
        // secure: true,
        maxAge: loginSessionIDMaxAge,
        sameSite: "strict",
      });
      if (searchParams.referrer) {
        cookies().set(loginReferrer, searchParams.referrer as string);
      }
    } catch (error) {
      console.log("error ", error);
      redirect("/oops");
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
