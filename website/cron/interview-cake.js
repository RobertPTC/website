/**
 *
 * @param {string} s
 * @returns {boolean}
 */
export function bracketValidator(s) {
  const openers = new Set(["{", "[", "("]);
  const closers = new Set(["}", "]", ")"]);
  const openersToClosers = {
    "{": "}",
    "[": "]",
    "(": ")",
  };
  let stack = [];
  let isValid = true;
  s.split("").forEach((v) => {
    if (!isValid) return;
    if (openers.has(v)) {
      stack = [...stack, v];
    }
    if (closers.has(v)) {
      const latestOpener = stack[stack.length - 1];
      stack = stack.slice(0, stack.length - 1);
      isValid = openersToClosers[latestOpener] === v;
    }
  });
  return isValid;
}
