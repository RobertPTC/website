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
      max = Math.max(counter, max);
      seen = {};
      counter = 0;
    }
    seen[stringToSearch[counter]] = counter;
    counter++;
  }
  return Math.max(max, Object.keys(seen).length);
}

/**
 * @param {number[]} nums
 * @param {number} val
 * @return {number}
 */
export function removeElement(nums, val) {
  let count = 0;
  for (let index = 0; index < nums.length; index++) {
    const element = nums[index];
    if (element === val) {
      continue;
    }
    nums[count] = element;
    count += 1;
  }
  return count;
}

/**
 * @param {string} s
 * @param {string} t
 * @return {boolean}
 */
export function isSubsequence(s, t) {
  let pointer = 0;
  for (let index = 0; index < t.length; index++) {
    const element = t[index];
    if (element === s[pointer]) {
      pointer += 1;
    }
  }
  return pointer === s.length;
}

/**
 * @param {number[]} nums
 * @return {number}
 */
export function removeDuplicates(nums) {
  let uniquePos = 1;
  let seen = nums[0];
  for (let index = 1; index < nums.length; index++) {
    const element = nums[index];
    if (element !== seen) {
      nums[uniquePos] = element;
      uniquePos += 1;
      seen = element;
      continue;
    }
  }
  return uniquePos;
}

/**
 * @param {number[]} nums
 * @return {boolean}
 */
export function canJump(nums) {
  if (nums.length === 1) return true;
  let maxRange = 0;
  if (maxRange >= nums.length) return true;
  let canJump = true;
  for (let i = 0; i < nums.length; i++) {
    const element = nums[i];
    if (!element && i !== nums.length - 1 && maxRange <= i) return false;
    maxRange = maxRange < element + i ? element + i : maxRange;
  }

  return canJump;
}

/**
 * @param {number[]} nums
 * @return {number}
 */
export function jump(nums) {
  let table = Array(nums.length).fill(null);
  table[0] = 0;
  for (let i = 0; i < nums.length; i++) {
    const e = nums[i];
    if (!e) continue;
    for (let j = 1; j <= e; j++) {
      const c = table[i];
      const n = table[i + j];
      if (!n) {
        table[i + j] = c + 1;
      }
    }
  }
  return table[nums.length - 1];
}

/**
 * @param {number[]} prices
 * @return {number}
 */
export function maxProfit(prices) {
  let lowestPrice = prices[0];
  let profit = 0;
  prices.forEach((p) => {
    let newProfit = p - lowestPrice;
    if (newProfit > profit) {
      profit = newProfit;
    }
    if (p < lowestPrice) {
      lowestPrice = p;
    }
  });
  return profit;
}

/**
 * @param {number[]} citations
 * @return {number}
 */
export function hIndex(citations) {
  const l = citations.length;
  let citationCount = [];
  for (let i = 0; i < l; i++) {
    const citation = citations[i];
    for (let j = 0; j < citation; j++) {
      const element = citationCount[j];
      if (!element) {
        citationCount[j] = 0;
      }
      citationCount[j] += 1;
    }
  }
  let maxCitation = 0;
  for (let i = 0; i < citationCount.length; i++) {
    const numberOfCitations = citationCount[i];
    if (numberOfCitations > maxCitation) {
      maxCitation = i + 1;
    }
    if (numberOfCitations >= i + 1) {
      maxCitation = i + 1;
    }
  }
  return maxCitation;
}

/**
 * @param {string[]} strs
 * @return {string}
 */
export function longestCommonPrefix(strs) {
  const s = strs[0];
  let prefix = "";
  for (let i = 0; i < s.length; i++) {
    const c = s[i];
    for (let j = 1; j < strs.length; j++) {
      const str = strs[j];
      if (c !== str[i]) {
        return prefix;
      }
    }
    prefix = `${prefix}${c}`;
  }
  return prefix;
}

/**
 * @param {string} s
 * @param {string} t
 * @return {boolean}
 */
export function isIsomorphic(s, t) {
  let sIndex = {};
  let tIndex = {};
  for (let i = 0; i < s.length; i++) {
    const sChar = s[i];
    const tChar = t[i];
    if (!sIndex[sChar] && tIndex[tChar]) return false;
    if (!tIndex[tChar] && sIndex[sChar]) return false;
    if (!sIndex[sChar]) {
      sIndex[sChar] = tChar;
    }
    if (!tIndex[tChar]) {
      tIndex[tChar] = sChar;
    }
    if (sIndex[sChar] !== tChar) return false;
    if (tIndex[tChar] !== sChar) return false;
  }
  return true;
}

/**
 * @param {number[]} prices
 * @return {number}
 */
function maxProfit2(prices) {
  if (prices.length === 2) {
    return Math.max(prices[0] - prices[0], prices[1] - prices[0]);
  }
}

/**
 * @param {string} word1
 * @param {string} word2
 * @return {number}
 */
export function minDistance(word1, word2) {
  let matrix = [];
  for (let i = 0; i < word1.length + 1; i++) {
    let row = [];
    for (let j = 0; j < word2.length + 1; j++) {
      row.push(j);
    }
    row[0] = i;
    matrix.push(row);
  }

  for (let i = 1; i < word1.length + 1; i++) {
    for (let j = 1; j < word2.length + 1; j++) {
      if (word1[i - 1] === word2[j - 1]) {
        matrix[i][j] = matrix[i - 1][j - 1];
        continue;
      }
      matrix[i][j] =
        1 + Math.min(matrix[i][j - 1], matrix[i - 1][j - 1], matrix[i - 1][j]);
    }
  }
  return matrix[word1.length][word2.length];
}

/**
 *
 * @param {string} s
 * @returns boolean
 */

export function isPalindrome(s) {
  if (!s) return true;
  if (s[0] !== s[s.length - 1]) return false;
  return isPalindrome(s.slice(1, s.length - 1));
}

function l(i, cache, nums) {
  if (cache[i]) return cache[i];
  let result = 1;
  for (let j = i; j < nums.length; j++) {
    if (nums[i] < nums[j]) {
      result = Math.max(result, 1 + l(j, cache));
    }
  }
  cache[i] = result;
  return result;
}
/**
 * @param {number[]} nums
 * @return {number}
 */
export function lengthOfLIS(nums) {
  if (nums.length === 1) return 1;
  let max = 0;
  let cache = {};
  for (let i = nums.length - 1; i > -1; i--) {
    max = Math.max(max, l(i, cache, nums));
  }
  return max;
}
