import Trie from "./index";
describe("trie", () => {
  it("finds words", () => {
    const t = Trie();
    t.addWord("apple");
    t.addWord("ash");
    t.addWord("ashley");
    t.addWord("bear");
    t.addWord("abracadbra");
    console.log("test ", t.findWords("a"));
    console.log("test2", t.findWords("ash"));
    console.log("test3", t.findWords("beryllium"));
    console.log("test4", t.findWords("ashl"));
  });
});
