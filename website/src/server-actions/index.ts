import { emailService } from "@app/email/service";
import { memoryCache } from "@app/memory-cache";

import dependencyInjector from "./dependency-injector";
import requestVerificationCode from "./request-verification-code";
import verifyCode from "./verify-code";

export const withServiceRequestVerificationCode = dependencyInjector(
  requestVerificationCode,
  memoryCache,
  emailService
);

export const withServiceVerifyCode = dependencyInjector(
  verifyCode,
  memoryCache
);
