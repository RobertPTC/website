import { JWTPayload } from ".";

export default function getJWTPayload(jwt: string) {
  try {
    const [h, p, s] = jwt.split(".");
    const payload: JWTPayload = JSON.parse(
      Buffer.from(p, "base64url").toString()
    );
    return payload;
  } catch (error) {
    console.log("error ", error);
    return null;
  }
}
