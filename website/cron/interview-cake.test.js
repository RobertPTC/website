import { bracketValidator } from "./interview-cake";
describe("interview cake", () => {
  it("bracketsValidator", () => {
    expect(bracketValidator("{ [ ] ( ) }")).toBe(true);
    expect(bracketValidator("{ [ ( ] ) }")).toBe(false);
    expect(bracketValidator("{ [ }")).toBe(false);
  });
});
