import {
  bracketValidator,
  nthFibonnaci,
  maxDuffelBagValue,
  merge,
  twoSum,
  lengthOfLongestSubstring,
  removeElement,
  isSubsequence,
  removeDuplicates,
  canJump,
  jump,
  maxProfit,
  hIndex,
  longestCommonPrefix,
  lastWord,
  isIsomorphic,
  minDistance,
} from "./algorithms";
describe("algorithms", () => {
  it("bracketsValidator", () => {
    expect(bracketValidator("{ [ ] ( ) }")).toBe(true);
    expect(bracketValidator("{ [ ( ] ) }")).toBe(false);
    expect(bracketValidator("{ [ }")).toBe(false);
    expect(bracketValidator("((")).toBe(false);
  });
  it("nthFibonacci", () => {
    expect(nthFibonnaci(0)).toBe(0);
    expect(nthFibonnaci(1)).toBe(1);
    expect(nthFibonnaci(2)).toBe(1);
    expect(nthFibonnaci(3)).toBe(2);
    expect(nthFibonnaci(14)).toBe(377);
  });
  it("maxDuffelBag", () => {
    const itemTypes = [
      { weight: 7, value: 160 },
      { weight: 3, value: 90 },
      { weight: 2, value: 15 },
    ];
    expect(maxDuffelBagValue(itemTypes, 20)).toBe(555);
    expect(maxDuffelBagValue(itemTypes, 0)).toBe(0);
    expect(maxDuffelBagValue(itemTypes, 3)).toBe(90);
    expect(maxDuffelBagValue(itemTypes, 2)).toBe(15);
    expect(maxDuffelBagValue(itemTypes, 6)).toBe(180);
    expect(maxDuffelBagValue(itemTypes, 21)).toBe(630);
  });
  it("merge", () => {
    expect(
      merge([
        [1, 3],
        [2, 6],
        [8, 10],
        [15, 18],
        [18, 34],
      ])
    ).toStrictEqual([
      [1, 6],
      [8, 10],
      [15, 34],
    ]);
    expect(
      merge([
        [1, 4],
        [0, 4],
      ])
    ).toStrictEqual([[0, 4]]);
    expect(
      merge([
        [1, 4],
        [0, 5],
      ])
    ).toStrictEqual([[0, 5]]);
    expect(
      merge([
        [1, 4],
        [0, 0],
      ])
    ).toStrictEqual([
      [0, 0],
      [1, 4],
    ]);
  });
  it("two sum", () => {
    expect(twoSum([2, 7, 11, 15], 9)).toStrictEqual([1, 0]);
    expect(twoSum([3, 2, 4], 6)).toStrictEqual([2, 1]);
    expect(twoSum([-3, 4, 3, 90], 0)).toStrictEqual([2, 0]);
  });
  it("lengthOfLongestSubstring", () => {
    expect(lengthOfLongestSubstring("abcabcbb")).toEqual(3);
    expect(lengthOfLongestSubstring("bbbbb")).toEqual(1);
    expect(lengthOfLongestSubstring("pwwkew")).toEqual(3);
    expect(lengthOfLongestSubstring("au")).toEqual(2);
    expect(lengthOfLongestSubstring(" ")).toEqual(1);
    expect(lengthOfLongestSubstring("")).toEqual(0);
    expect(lengthOfLongestSubstring("dvdf")).toEqual(3);
    expect(lengthOfLongestSubstring("anviaj")).toEqual(5);
  });

  it("removeElement", () => {
    let nums = [3, 2, 2, 3];
    expect(removeElement(nums, 3)).toEqual(2);
    let nums2 = [0, 1, 2, 2, 3, 0, 4, 2];
    expect(removeElement(nums2, 2)).toEqual(5);
  });
  it("isSubsequence", () => {
    expect(isSubsequence("abc", "ahbgdc")).toBe(true);
    expect(isSubsequence("axc", "ahbgdc")).toBe(false);
  });
  it("removeDuplicates", () => {
    expect(removeDuplicates([1, 1, 2])).toBe(2);
    expect(removeDuplicates([0, 0, 1, 1, 1, 2, 2, 3, 3, 4])).toBe(5);
  });
  it("canJump", () => {
    expect(canJump([2, 3, 1, 1, 4])).toBe(true);
    expect(canJump([3, 2, 1, 0, 4])).toBe(false);
    expect(canJump([0, 2, 3])).toBe(false);
    expect(canJump([3, 0, 8, 2, 0, 0, 1])).toBe(true);
    expect(canJump([1, 0, 1, 0])).toBe(false);
    expect(canJump([2, 3, 1, 1, 4])).toBe(true);
    expect(canJump([2, 0, 0])).toBe(true);
    expect(canJump([2, 1, 0, 0])).toBe(false);
  });
  it("jump", () => {
    expect(jump([2, 3, 1, 1, 4])).toBe(2);
    expect(jump([2, 0, 1, 1, 4])).toBe(3);
    expect(jump([1, 2, 1, 1, 1])).toBe(3);
  });
  it("maxProfit", () => {
    expect(maxProfit([7, 1, 5, 3, 6, 4])).toBe(5);
    expect(maxProfit([7, 6, 4, 3, 1])).toBe(0);
  });
  it("hIndex", () => {
    // expect(hIndex([3, 0, 6, 1, 5])).toBe(3);
    // expect(hIndex([3, 0, 1, 1, 5])).toBe(1);
    // expect(hIndex([3, 0, 1, 2, 5])).toBe(2);
    // expect(hIndex([0, 0, 0, 0, 5])).toBe(1);
    // expect(hIndex([1, 3, 1])).toBe(1);
    // expect(hIndex([1])).toBe(1);
    // expect(hIndex([100])).toBe(1);
    // expect(hIndex([11, 15])).toBe(2);
    // expect(hIndex([0, 0, 0])).toBe(0);
  });
  it("longestCommonPrefix", () => {
    expect(longestCommonPrefix(["care", "dog", "cat"])).toBe("");
    expect(longestCommonPrefix(["flower", "flow", "flight"])).toBe("fl");
    expect(longestCommonPrefix(["dog", "racecar", "car"])).toBe("");
    expect(longestCommonPrefix(["glimmer", "glim", "glitch"])).toBe("gli");
  });
  it("lastWord", () => {
    expect(lastWord("a a b a b b c d e", 1)).toBe("e");
    expect(lastWord("a b b a a c d d c c e f f e e g g", 3)).toBe("e");
  });
  it("isIsomorphic", () => {
    expect(isIsomorphic("egg", "add")).toBe(true);
    expect(isIsomorphic("foo", "bar")).toBe(false);
    expect(isIsomorphic("paper", "title")).toBe(true);
    expect(isIsomorphic("badc", "baba")).toBe(false);
  });
  it("minDistance", () => {
    expect(minDistance("jrok", "trek")).toBe(2);
    expect(minDistance("horse", "ros")).toBe(3);
    expect(minDistance("intention", "execution")).toBe(5);
  });
});
