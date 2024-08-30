import dependencyInjector from "@app/dependency-injector";
import EmailService from "@app/email";
import MemoryCache from "@app/memory-cache";

import generateJWT from "./generate-jwt";
import requestVerificationCode from "./request-verification-code";
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
  it("sends verification token for valid email", async () => {
    const mockSendVerificationToken = jest.fn(async () => true);
    const mockSetVerificationToken = jest.fn(async () => "abc");
    const mockEmailService: EmailService = {
      sendVerificationToken: mockSendVerificationToken,
    };
    const mockMemoryCache: MemoryCache = {
      setVerificationToken: mockSetVerificationToken,
      getLoginSession: function (id: string): Promise<string | null> {
        throw new Error("Function not implemented.");
      },
      setSessionID: function (
        email: string,
        id: string,
        ttl: number
      ): Promise<string | null> {
        throw new Error("Function not implemented.");
      },
      getEmailForSessionID: function (id: string): Promise<string | null> {
        throw new Error("Function not implemented.");
      },
    };
    const withService = dependencyInjector(
      requestVerificationCode,
      mockMemoryCache,
      mockEmailService
    );
    const formData = new FormData();
    formData.append("email", "test@test.com");
    const res = await withService(formData);
    expect(typeof res === "string").toBeTruthy();
  });
  it("does not send verification token for invalid email", async () => {
    const mockSendVerificationToken = jest.fn(async () => true);
    const mockSetVerificationToken = jest.fn(async () => "abc");
    const mockEmailService: EmailService = {
      sendVerificationToken: mockSendVerificationToken,
    };
    const mockMemoryCache: MemoryCache = {
      setVerificationToken: mockSetVerificationToken,
      getLoginSession: function (id: string): Promise<string | null> {
        throw new Error("Function not implemented.");
      },
      setSessionID: function (
        email: string,
        id: string,
        ttl: number
      ): Promise<string | null> {
        throw new Error("Function not implemented.");
      },
      getEmailForSessionID: function (id: string): Promise<string | null> {
        throw new Error("Function not implemented.");
      },
    };
    const withService = dependencyInjector(
      requestVerificationCode,
      mockMemoryCache,
      mockEmailService
    );
    const formData = new FormData();
    formData.append("email", "invalid email");
    const res = await withService(formData);
    expect(res).toBe("");
  });
});
