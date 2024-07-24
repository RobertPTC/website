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
  let openersCount = 0;
  let closersCount = 0;
  s.split("").forEach((v) => {
    if (!isValid) return;
    if (openers.has(v)) {
      stack.push(v);
      openersCount++;
    }
    if (closers.has(v)) {
      const latestOpener = stack.pop();
      isValid = openersToClosers[latestOpener] === v;
      closersCount++;
    }
  });
  if (isValid) {
    return openersCount === closersCount;
  }
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

/**
 * @param {number[]} nums
 * @param {number} target
 * @return {number[]}
 */
export function twoSum(nums, target) {
  let result = [];
  let numbers = {};
  for (let i = 0; i < nums.length; i++) {
    const element = nums[i];
    const difference = target - element;
    if (numbers.hasOwnProperty(element)) {
      return [i, numbers[element]];
    }
    numbers[difference] = i;
  }
  return result;
}

/**
 * @param {string} s
 * @return {number}
 */
export function lengthOfLongestSubstring(s) {
  if (!s.length) return 0;
  let seen = {};
  let max = 1;
  let stringToSearch = s;
  let counter = 0;
  while (stringToSearch[counter]) {
    if (stringToSearch[counter] in seen) {
      stringToSearch = stringToSearch.slice(
        seen[stringToSearch[counter]] + 1,
        stringToSearch.length
      );
      // console.log("stringToSearch ", stringToSearch);
      // console.log("counter ", counter);
      // console.log("stringToSearch[counter] ", stringToSearch[counter]);
      max = Math.max(counter, max);
      seen = {};
      counter = 0;
    }
    seen[stringToSearch[counter]] = counter;
    counter++;
  }
  return Math.max(max, Object.keys(seen).length);
}
