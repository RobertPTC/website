import { RequestCookie } from "next/dist/compiled/@edge-runtime/cookies";

import MemoryCache from "@app/memory-cache";

export default async function isValidCode(
  memoryCache: MemoryCache,
  loginSessionID: RequestCookie | undefined,
  formData: FormData
) {
  try {
    if (!loginSessionID) throw new Error("no login session id");
    const session = await memoryCache.getLoginSession(loginSessionID.value);
    if (!session) {
      throw new Error("no session for id");
    }
    const json = JSON.parse(session);
    if (
      json.email !== formData.get("email") ||
      json.token !== formData.get("verification-code")
    ) {
      throw new Error("email and token do not match");
    }
    return true;
  } catch (error) {
    console.error("verify code error ", error);
    return false;
  }
}
