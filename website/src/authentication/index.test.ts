import generateJWT from "./generate-jwt";
import verifyJWT from "./verify-jwt";

describe("authentication", () => {
  it("generates and verifies valid JWT", () => {
    const jwt = generateJWT("1234", 500, new Date(1724887994573));
    expect(verifyJWT(jwt)).toBeTruthy();
  });
  it("does not verify tampered jwt", () => {
    const jwt = generateJWT("1234", 500, new Date(1724887994573));
    const [h, p, s] = jwt.split(".");
    const payload = JSON.parse(Buffer.from(p, "base64url").toString());
    payload.exp = 10000;
    const tamperedPayload = Buffer.from(JSON.stringify(payload)).toString(
      "base64url"
    );
    expect(verifyJWT(`${h}.${tamperedPayload}.${s}`)).toBeFalsy();
  });
});
