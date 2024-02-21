interface Node {
  children: { [key: string]: Node };
  parentNode: null | Node;
  capitalizedLetters: string[];
  letter: string;
  wordEnd: boolean;
}

export default function Trie() {
  let searchResults: string[] = [];

  const rootNode: Node = {
    capitalizedLetters: [],
    children: {},
    letter: "",
    parentNode: null,
    wordEnd: false,
  };

  function _isCapitalLetter(letter: string) {
    return letter.charCodeAt(0) >= 65 && letter.charCodeAt(0) <= 90;
  }

  function _createNewNode(
    parentNode: Node,
    letter: string,
    wordEnd: boolean,
    capitalizedLetters: string[]
  ) {
    const n: Node = {
      capitalizedLetters,
      children: {},
      letter,
      parentNode,
      wordEnd,
    };
    parentNode.children[letter] = n;
    return n;
  }

  function addWord(word: string) {
    let c: Node = rootNode;
    const letters = word.split("");
    const capitalizedLetters: string[] = [];
    letters.forEach((l, i) => {
      const lowerCaseLetter = l.toLowerCase();
      const child = c.children[lowerCaseLetter];
      if (_isCapitalLetter(l)) {
        capitalizedLetters.push(l);
      }
      if (typeof child === "undefined") {
        if (i === letters.length - 1) {
          return _createNewNode(c, lowerCaseLetter, true, capitalizedLetters);
        }
        c = _createNewNode(c, lowerCaseLetter, false, capitalizedLetters);
      } else {
        c = child;
      }
    });
  }

  function findWords(s: string, c: { [key: string]: Node }) {
    const n = c[s];
    if (!n || !Object.keys(n.children)) return;
    if (n.wordEnd) {
      const letters = [];
      let p: Node = n;
      while (p.parentNode) {
        letters.unshift(p.letter);
        p = p.parentNode;
      }
      searchResults.push(letters.join(""));
    }
    for (let child in n.children) {
      findWords(child, n.children);
    }
  }

  return {
    addWord,
    findWords: (s: string) => {
      searchResults = [];
      let children = rootNode.children;
      const normalized = s.toLowerCase();
      normalized.split("").forEach((l, i) => {
        if (children[l] && i !== s.length - 1) {
          children = children[l].children;
        }
      });
      findWords(normalized[normalized.length - 1], children);
      return searchResults;
    },
  };
}
