import { v4 as uuid } from "uuid";

import EmailService, { validEmailRegex } from "@app/email";
import MemoryCache from "@app/memory-cache";

export default async function requestVerificationCode(
  memoryCache: MemoryCache,
  emailService: EmailService,
  formData: FormData
) {
  console.log("formData ", formData);
  try {
    const email = formData.get("email") as string;
    if (!email) {
      throw new Error("no email");
    }
    if (!validEmailRegex.test(email)) {
      throw new Error("invalid email");
    }
    const token = uuid();
    const sessionID = uuid();
    const res = await memoryCache.setVerificationToken(
      sessionID,
      JSON.stringify({ token, email }),
      5 * 60
    );
    if (!res) {
      throw new Error("error setting verification token");
    }
    const success = await emailService.sendVerificationToken(email, token);
    if (!success) {
      // delete token?
      throw new Error("error sending verification token email ");
    }
    return sessionID;
  } catch (e) {
    // abstract into log service
    console.error("requestVerificationCode", e);
    return "";
  }
}
