"use server";

import dayjs from "dayjs";
import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";
import { v4 as uuid } from "uuid";

import { BlogComment } from "@app/app/api/types";
import getJWTPayload from "@app/authentication/get-jwt-payload";
import verifyJWT from "@app/authentication/verify-jwt";
import { jwtSession } from "@app/cookies";
import Database, { db } from "@app/db";
import dependencyInjector from "@app/dependency-injector";
import MemoryCache, { memoryCache } from "@app/memory-cache";

async function createCommentAction(
  db: Database,
  memoryCache: MemoryCache,
  formData: FormData
) {
  const jwt = cookies().get(jwtSession);
  if (!jwt?.value) {
    throw new Error("You are not logged in.");
  }
  const isValid = verifyJWT(jwt?.value);
  if (!isValid) {
    throw new Error("You are not logged in.");
  }
  const jwtPayload = getJWTPayload(jwt?.value || "");
  const email = await memoryCache.getEmailForSessionID(jwtPayload?.sub || "");
  if (!email) {
    throw new Error("Who are you?");
  }
  if (
    !formData.get("respondsTo") ||
    !formData.get("text") ||
    !formData.get("respondsTo") ||
    !formData.get("blogID")
  ) {
    throw new Error("Form is invalid");
  }
  const journalistID = await db.getJournalistIDForEmail(email);
  if (!journalistID) {
    throw new Error("Something went wrong.");
  }
  const blogComment: BlogComment = {
    responds_to: formData.get("respondsTo") as string,
    text: formData.get("text") as string,
    date: dayjs().format("MM/DD/YYYY"),
    blog_comment_id: uuid(),
    journalist_id: journalistID,
  };
  const res = await db.setComment(blogComment);
  if (!res) {
    throw new Error("Something went wrong");
  }
  revalidatePath(`/api/comments/${formData.get("blogID")}`);
}

export default dependencyInjector(createCommentAction, db, memoryCache);
