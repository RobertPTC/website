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
/**
 * @param {number} n
 * @returns {number}
 */
export function nthFibonnaci(n) {
  let memo = { 0: 0, 1: 1, 2: 1 };
  for (let i = 3; i <= n; i++) {
    memo[i] = memo[i - 1] + memo[i - 2];
  }
  return memo[n];
}
/**
 *
 * @param {[number, number]} currentPosition
 * @param {[number, number]} endingPosition
 * @returns {[number, number][]}
 */
export function shortestPathGridOfSquares(currentPosition, endingPosition) {}
/**
 *
 * @param {{weight: number; value: number}[]} itemTypes
 * @param {number} capacity
 * @returns {number}
 */
export function maxDuffelBagValue(itemTypes, capacity) {
  const copy = [...itemTypes];
  const withRatio = copy
    .map(({ weight, value }) => ({
      weight,
      value,
      ratio: value / weight,
    }))
    .sort((a, b) => b.ratio - a.ratio);
  let capacityRemaining = capacity;
  let total = 0;
  withRatio.forEach((item) => {
    while (capacityRemaining >= item.weight) {
      capacityRemaining -= item.weight;
      total += item.value;
    }
  });
  return total;
}

/**
 * @param {number[][]} intervals
 * @return {number[][]}
 */
export function merge(intervals) {
  if (intervals.length === 1) return intervals;
  intervals.sort((a, b) => {
    return a[0] - b[0];
  });

  let result = [];

  let current = intervals[0];

  intervals.forEach((interval) => {
    if (interval[0] > current[1]) {
      result.push(current);
      current = interval;
      return;
    }
    current[1] = Math.max(interval[1], current[1]);
  });
  result.push(current);
  return result;
}
