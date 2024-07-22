import {
  bracketValidator,
  nthFibonnaci,
  maxDuffelBagValue,
  merge,
} from "./algorithms";
describe("interview cake", () => {
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
});
