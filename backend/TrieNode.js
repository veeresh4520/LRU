class TrieNode {
    constructor() {
        this.children = new Map();
        this.isEndOfWord = false;
        this.word = null;
    }
}

class Trie {
    constructor() {
        this.root = new TrieNode();
    }

    insert(word) {
        let node = this.root;
        for (const char of word.toLowerCase()) {
            if (!node.children.has(char)) {
                node.children.set(char, new TrieNode());
            }
            node = node.children.get(char);
        }
        node.isEndOfWord = true;
        node.word = word;
    }

    search(prefix) {
        let node = this.root;
        prefix = prefix.toLowerCase();

        for (const char of prefix) {
            if (!node.children.has(char)) {
                return [];
            }
            node = node.children.get(char);
        }

        return this._collectWords(node, prefix);
    }

    _collectWords(node, prefix, results = []) {
        if (results.length >= 10) return results;

        if (node.isEndOfWord) {
            results.push(node.word);
        }

        for (const [char, childNode] of node.children) {
            if (results.length >= 10) break;
            this._collectWords(childNode, prefix + char, results);
        }

        return results;
    }
}

module.exports = Trie;
