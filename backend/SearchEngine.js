const InvertedIndex = require('./InvertedIndex');
const LRUCache = require('./LRUCache');
const SpatialLoader = require('./SpatialLoader');
const SessionStats = require('./SessionStats');
const Trie = require('./TrieNode');

class SearchEngine {
    constructor() {
        this.index = null;
        this.cache = null;
        this.loader = null;
        this.stats = new SessionStats();
        this.trie = new Trie();
        this.folderPath = '';
    }

    initialize(folderPath) {
        this.folderPath = folderPath;
        this.index = new InvertedIndex();
        this.index.buildIndex(folderPath);
        this.cache = new LRUCache(100);
        this.loader = new SpatialLoader(folderPath, this.index);

        const allWords = this.index.getAllWords();
        for (const word of allWords) {
            this.trie.insert(word);
        }

        console.log(`Ready. ${this.index.size()} terms indexed.`);
    }

    search(word) {
        word = word.trim().toLowerCase();
        console.log(`Searching '${word}'`);

        if (this.cache.contains(word)) {
            this.stats.recordHit();
            console.log('[CACHE HIT]');
            return {
                definition: this.cache.get(word),
                source: this.index.getFileName(word),
                cacheHit: true
            };
        }

        this.stats.recordMiss();
        console.log('[CACHE MISS]');

        const fileName = this.index.getFileName(word);
        if (!fileName) {
            console.log('Not found in any file');
            return {
                definition: null,
                source: null,
                cacheHit: false
            };
        }

        console.log('Found in file', fileName);
        this.loader.loadNeighborsIntoCache(word, fileName, this.cache);

        const definition = this.cache.get(word);
        if (!definition) {
            console.log('Failed to load:', word);
            return {
                definition: null,
                source: fileName,
                cacheHit: false
            };
        }

        return {
            definition,
            source: fileName,
            cacheHit: false
        };
    }

    getIndexSize() {
        return this.index.size();
    }

    getCacheState() {
        return this.cache.getCacheState();
    }

    getStats() {
        return this.stats.getStats();
    }

    getSourceFile(word) {
        return this.index.getFileName(word.toLowerCase().trim());
    }

    autocomplete(prefix) {
        return this.trie.search(prefix);
    }

    addWord(word, definition, category) {
        const result = this.index.addWord(word, definition, category);
        if (result) {
            this.trie.insert(word);
        }
        return result;
    }

    getAllWords() {
        return this.index.getAllWords();
    }

    rebuildIndex() {
        this.initialize(this.folderPath);
    }
}

module.exports = SearchEngine;
