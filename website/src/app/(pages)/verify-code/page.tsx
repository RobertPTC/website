import { Box, Button, TextField } from "@mui/material";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { v4 as uuid } from "uuid";

import generateJWT from "@app/authentication/generate-jwt";
import {
  loginSessionID,
  loginReferrer,
  jwtExp,
  jwtSession,
  jwtMaxAge,
} from "@app/cookies";
import { withServiceVerifyCode } from "@app/server-actions";

export default function VerifyToken() {
  async function action(formData: FormData) {
    "use server";
    const sessionID = cookies().get(loginSessionID);
    const referrer = cookies().get(loginReferrer);
    const isValid = await withServiceVerifyCode(sessionID, formData);
    if (!isValid) {
      redirect("/login?prompt=invalid");
    }
    cookies().delete(loginReferrer);
    const jwtID = uuid();
    const jwt = generateJWT(jwtID, jwtExp, new Date());
    cookies().set(jwtSession, jwt, { httpOnly: true, maxAge: jwtMaxAge });
  }
  return (
    <Box component="form" action={action}>
      <TextField label="Email" name="email" />
      <TextField label="Verification Code" name="verification-code" />
      <Button type="submit">Submit</Button>
    </Box>
  );
}
