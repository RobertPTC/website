import { emailService } from "@app/email/service";
import { memoryCache } from "@app/memory-cache";

import isValidCode from "./is-valid-code";
import requestVerificationCode from "./request-verification-code";
import setJWTInCache from "./set-jwt-in-cache";

import dependencyInjector from "../dependency-injector";

export const withServiceRequestVerificationCode = dependencyInjector(
  requestVerificationCode,
  memoryCache,
  emailService
);

export const withServiceIsValidCode = dependencyInjector(
  isValidCode,
  memoryCache
);

export const withServiceSetJWTInCache = dependencyInjector(
  setJWTInCache,
  memoryCache
);
