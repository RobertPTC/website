import Trie from "./index";
describe("trie", () => {
  it("finds words", () => {
    const t = Trie();
    t.addWord("apple", { name: "apple" });
    t.addWord("ash", { name: "ash" });
    t.addWord("Ashley", { name: "Ashley" });
    t.addWord("bear", { name: "bear" });
    t.addWord("abracadbra", { name: "abracadabra" });
    t.addWord("Rio de Janeiro", { name: "Rio de Janeiro" });
  });
});
