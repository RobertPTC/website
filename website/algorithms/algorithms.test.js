import {
  bracketValidator,
  nthFibonnaci,
  maxDuffelBagValue,
  merge,
  twoSum,
  lengthOfLongestSubstring,
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
});
