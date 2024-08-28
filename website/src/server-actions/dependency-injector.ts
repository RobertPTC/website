import EmailService from "@app/email";
import MemoryCache from "@app/memory-cache";

export default function dependencyInjector(fn: Function, ...rest: any[]) {
  return fn.bind(null, ...rest);
}
