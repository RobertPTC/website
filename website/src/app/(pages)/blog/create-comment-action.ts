"use server";

import { cookies } from "next/headers";

import verifyJWT from "@app/authentication/verify-jwt";
import { jwtSession } from "@app/cookies";
import Database, { db } from "@app/db";
import dependencyInjector from "@app/dependency-injector";

async function createCommentAction(db: Database, formData: FormData) {
  const jwt = cookies().get(jwtSession);
  if (!jwt?.value) {
    throw new Error("no jwt");
  }
  const isValid = verifyJWT(jwt?.value);
  if (!isValid) {
    throw new Error("jwt is not valid");
  }
}

export default dependencyInjector(createCommentAction, db);
