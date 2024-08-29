import { createHmac } from "crypto";

export default function generateJWT(sessionID: string, exp: number, iat: Date) {
  try {
    const secret = process.env.JWT_SECRET_KEY;
    if (!secret) {
      throw new Error("JWT secret not set");
    }
    const header = Buffer.from(
      JSON.stringify({ alg: "HS256", typ: "JWT" })
    ).toString("base64url");
    const payload = Buffer.from(
      JSON.stringify({
        sub: sessionID,
        exp,
        iat: iat.getTime(),
      })
    ).toString("base64url");
    const hmac = createHmac("sha256", secret);
    hmac.update(`${header}.${payload}`);
    const signature = hmac.digest("base64url");
    return `${header}.${payload}.${signature}`;
  } catch (error) {
    console.log("error ", error);
    return "";
  }
}
