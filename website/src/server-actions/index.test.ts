/**
 * @jest-environment node
 */

import EmailService from "@app/email";
import MemoryCache from "@app/memory-cache";

import dependencyInjector from "./dependency-injector";
import requestVerificationCode from "./request-verification-code";

describe("serverActions", () => {
  it("sends verification token for valid email", async () => {
    const mockSendVerificationToken = jest.fn(async () => true);
    const mockSetVerificationToken = jest.fn(async () => "abc");
    const mockEmailService: EmailService = {
      sendVerificationToken: mockSendVerificationToken,
    };
    const mockMemoryCache: MemoryCache = {
      setVerificationToken: mockSetVerificationToken,
    };
    const withService = dependencyInjector(
      mockMemoryCache,
      mockEmailService,
      requestVerificationCode
    );
    const formData = new FormData();
    formData.append("email", "test@test.com");
    const res = await withService(formData);
    expect(res).toBe(true);
  });
  it("does not send verification token for invalid email", async () => {
    const mockSendVerificationToken = jest.fn(async () => true);
    const mockSetVerificationToken = jest.fn(async () => "abc");
    const mockEmailService: EmailService = {
      sendVerificationToken: mockSendVerificationToken,
    };
    const mockMemoryCache: MemoryCache = {
      setVerificationToken: mockSetVerificationToken,
    };
    const withService = dependencyInjector(
      mockMemoryCache,
      mockEmailService,
      requestVerificationCode
    );
    const formData = new FormData();
    formData.append("email", "invalid email");
    const res = await withService(formData);
    expect(res).toBe(false);
  });
});
