const FileScanner = require('./FileScanner');
const path = require('path');

class SpatialLoader {
    constructor(folderPath, index) {
        this.folderPath = folderPath;
        this.index = index;
    }

    getOrderedTerms(fileName) {
        const filePath = path.join(this.folderPath, fileName);
        const scanner = new FileScanner();
        const termsMap = scanner.parseFile(filePath);
        return Array.from(termsMap.values());
    }

    getNeighbors(word, fileName) {
        const terms = this.getOrderedTerms(fileName);
        let targetIndex = -1;

        for (let i = 0; i < terms.length; i++) {
            if (terms[i].word === word) {
                targetIndex = i;
                break;
            }
        }

        if (targetIndex === -1) {
            return [];
        }

        const start = Math.max(0, targetIndex - 3);
        const end = Math.min(terms.length - 1, targetIndex + 3);

        const neighbors = [];
        for (let i = start; i <= end; i++) {
            neighbors.push(terms[i]);
        }

        return neighbors;
    }

    loadNeighborsIntoCache(word, fileName, cache) {
        const neighbors = this.getNeighbors(word, fileName);
        console.log(`[SPATIAL LOAD] ${neighbors.length} neighbors for: ${word}`);

        for (const term of neighbors) {
            if (term.word === word) continue;

            if (!cache.contains(term.word)) {
                cache.put(term.word, term.definition);
                console.log('  Loaded neighbor:', term.word);
            } else {
                console.log('  Skipped (already cached):', term.word);
            }
        }

        for (const term of neighbors) {
            if (term.word === word) {
                cache.put(term.word, term.definition);
                console.log('  Loaded searched word (MRU):', term.word);
                break;
            }
        }
    }
}

module.exports = SpatialLoader;
