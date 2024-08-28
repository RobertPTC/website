import generateJWT from "./generate-jwt";

export default function verifyJWT(jwt: string) {
  try {
    const payload = JSON.parse(
      Buffer.from(jwt.split(".")[1], "base64url").toString()
    );
    const generatedJWT = generateJWT(
      payload.sub,
      payload.exp,
      new Date(payload.iat)
    );
    return jwt === generatedJWT;
  } catch (error) {
    console.log("error ", error);
  }
}
