"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { v4 as uuid } from "uuid";

import {
  loginSessionID,
  loginReferrer,
  jwtExp,
  jwtSession,
  jwtMaxAge,
} from "@app/cookies";

import generateJWT from "./generate-jwt";

import { withServiceIsValidCode, withServiceSetJWTInCache } from ".";

export default async function verifyCode(formData: FormData) {
  const sessionID = cookies().get(loginSessionID);
  const referrer = cookies().get(loginReferrer);
  const isValid = await withServiceIsValidCode(sessionID, formData);
  if (!isValid) {
    redirect("/login?prompt=invalid");
  }
  cookies().delete(loginReferrer);
  cookies().delete(loginSessionID);
  const jwtID = uuid();
  const jwt = generateJWT(jwtID, jwtExp, new Date());
  if (!jwt) {
    redirect("/oops");
  }
  cookies().set(jwtSession, jwt, {
    httpOnly: true,
    maxAge: jwtMaxAge,
    // secure: true,
    sameSite: "strict",
  });
  await withServiceSetJWTInCache(jwtID, formData.get("email"));
  if (referrer) {
    redirect(`/${referrer}`);
  }
  redirect("/");
}
