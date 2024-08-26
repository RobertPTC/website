/**
 * @jest-environment node
 */

import { NextRequest } from "next/server";

import EmailService from "@app/email";
import MemoryCache from "@app/memory-cache";

import { requestVerificationCode } from ".";

describe("requestVerificationCode", () => {
  it("responds with 400 status code if email is not valid", async () => {
    const mockEmailService: EmailService = {
      sendVerificationToken: function (
        email: string,
        verificationToken: string
      ): Promise<string | null> {
        throw new Error("Function not implemented.");
      },
    };
    const mockMemoryCache: MemoryCache = {
      setVerificationToken: function (
        email: string,
        token: string,
        ttl: number
      ): Promise<null | string> {
        throw new Error("Function not implemented.");
      },
    };
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
});
