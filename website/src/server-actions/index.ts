"use server";

import { emailService } from "@app/email/service";
import { memoryCache } from "@app/memory-cache";

import dependencyInjector from "./dependency-injector";
import requestVerificationCode from "./request-verification-code";

export const withServiceRequestVerificationCode = dependencyInjector(
  memoryCache,
  emailService,
  requestVerificationCode
);
