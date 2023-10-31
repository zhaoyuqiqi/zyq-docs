const WORD = Symbol('word');
const TIMES = Symbol('times');
interface Trie {
  [key: string]: Trie;
  [WORD]?: string;
  [TIMES]?: number;
}
class TrieTree {
  root: Trie;
  constructor() {
    this.root = Object.create(null);
  }

  insert(word) {
    let node = this.root;
    for (const char of word) {
      if (!node[char]) {
        node[char] = {};
      }
      node = node[char];
    }
    if (!(WORD in node)) {
      node[TIMES] = 0;
      node[WORD] = word;
    }
    node[TIMES]!++;
  }

  get(word) {
    let node = this.root;
    const ret: string[] = [];

    function visit(root: Trie) {
      for (const key in root) {
        if (root[key][WORD]) {
          ret.push(root[key][WORD]!);
        }
        visit(root[key]);
      }
    }

    for (const char of word) {
      if (!node[char]) {
        return ret;
      }
      node = node[char];
      if (node[WORD]) {
        ret.push(node[WORD]);
      }
    }
    visit(node);
    return ret;
  }
  most() {
    let max = 0;
    let word = '';
    const visit = (root, s) => {
      if (root[TIMES] && root[TIMES] > max) {
        max = root[TIMES];
        word = root[WORD];
      }
      for (const key in root) {
        visit(root[key], s + key);
      }
    };
    visit(this.root, '');
    return [max, word];
  }
}

function randomString(len) {
  let s = '';
  for (let i = 0; i < len; i++) {
    s += String.fromCharCode(Math.random() * 10 + 'a'.charCodeAt(0));
  }
  return s;
}

const trie = new TrieTree();
for (let i = 0; i < 100000; i++) {
  trie.insert(randomString(4 + Math.floor(Math.random() * 7)));
}
