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
    console.log(
      "merge ",
      merge([
        [1, 3],
        [4, 6],
        [6, 10],
        [11, 18],
        [19, 130],
        [130, 145],
        [148, 190],
      ])
    );
  });
});
