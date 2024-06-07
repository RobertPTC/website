import TFIDF from ".";

const document1 =
  "Air quality in the sunny island improved gradually throughout Wednesday..";
const document2 =
  "Air quality in Singapore on Wednesday continued to get worse as haze hit the island.";
const document3 =
  "The air quality in Singapore is monitored through a network of air monitoring stations located in different parts of the island";
const document4 = "The air quality in Singapore got worse on Wednesday.";

describe("TFIDF", () => {
  it("determines term frequency", () => {
    const tfidf = TFIDF();
    const f = tfidf.termFrequency(document1);
    expect(f["air"]).toBe(0.1);
    expect(f["sunny"]).toBe(0.1);
    expect(f["island"]).toBe(0.1);
  });
  it("determines inverse document frequency", () => {
    const tfidf = TFIDF();
    const idf = tfidf.idf([document1, document2, document3, document4]);
    expect(idf["air"]).toBe(0);
    expect(idf["sunny"]).toBe(0.602);
    expect(idf["island"]).toBe(0.125);
  });
  it("determines tfidf", () => {
    const t = TFIDF();
    const tfidf = t.tfidf([document1, document2, document3, document4]);
    expect(tfidf["air"]).toStrictEqual([0, 0, 0, 0]);
    expect(tfidf["quality"]).toStrictEqual([0, 0, 0, 0]);
    expect(tfidf["sunny"]).toStrictEqual([0.06, 0, 0, 0]);
    expect(tfidf["island"]).toStrictEqual([0.013, 0.008, 0.006, 0]);
    expect(tfidf["improved"]).toStrictEqual([0.06, 0, 0, 0]);
    expect(tfidf["singapore"]).toStrictEqual([0, 0.008, 0.006, 0.014]);
  });
  it("throws error on only 1 document", () => {
    const t = TFIDF();
    expect(t.tfidf).toThrow();
  });
});
