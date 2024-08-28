export default function generateJWT(sessionID: string, exp: number) {
  const header = JSON.stringify({ alg: "HS256", typ: "JWT" });
  const payload = JSON.stringify({ id: sessionID, exp });
}
