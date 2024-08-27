import EmailService from "@app/email";
import MemoryCache from "@app/memory-cache";

export default function dependencyInjector(
  memoryCache: MemoryCache,
  emailService: EmailService,
  fn: Function
) {
  return fn.bind(null, memoryCache, emailService);
}
