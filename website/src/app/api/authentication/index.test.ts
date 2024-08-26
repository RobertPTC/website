/**
 * @jest-environment node
 */

import { NextRequest } from "next/server";

import EmailService from "@app/email";
import MemoryCache from "@app/memory-cache";

import { requestVerificationCode } from ".";

const mockEmailService: EmailService = {
  sendVerificationToken: function (
    email: string,
    verificationToken: string
  ): Promise<boolean | null> {
    throw new Error("Function not implemented.");
  },
};
const mockMemoryCache: MemoryCache = {
  setVerificationToken: async function (
    email: string,
    token: string,
    ttl: number
  ): Promise<null | string> {
    return token;
  },
};

describe("requestVerificationCode", () => {
  it("responds with 400 status code if email is not valid", async () => {
    const res = await requestVerificationCode(
      {
        async json() {
          return {
            email: "not a valid email",
          };
        },
      } as NextRequest,
      mockMemoryCache,
      mockEmailService
    );
    const json = await res.json();
    expect(json.status).toBe(400);
  });
  it("responds with 200 if email is valid", async () => {
    const res = await requestVerificationCode(
      {
        async json() {
          return {
            email: "example@example.com",
          };
        },
      } as NextRequest,
      mockMemoryCache,
      mockEmailService
    );
    const json = await res.json();
    expect(json.status).toBe(200);
  });
});
