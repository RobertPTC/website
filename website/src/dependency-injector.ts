export default function dependencyInjector(fn: Function, ...rest: any[]) {
  return fn.bind(null, ...rest);
}
