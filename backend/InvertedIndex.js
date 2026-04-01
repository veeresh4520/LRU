const FileScanner = require('./FileScanner');
const path = require('path');

class InvertedIndex {
    constructor() {
        this.invertedIndex = new Map();
        this.fileMapCache = new Map();
        this.folderPath = '';
    }

    buildIndex(folderPath) {
        this.folderPath = folderPath;
        const scanner = new FileScanner();
        const filesMap = scanner.getAllFiles(folderPath);

        for (const [fileName, filePath] of filesMap) {
            const terms = scanner.parseFile(filePath);

            for (const [word, term] of terms) {
                this.invertedIndex.set(word, term.sourceFile);
            }

            this.fileMapCache.set(fileName, null);
        }

        console.log(`Index-Built ${this.invertedIndex.size} terms across ${filesMap.size} files`);
    }

    getFileName(word) {
        word = word.toLowerCase().trim();
        const fileName = this.invertedIndex.get(word);
        return fileName || null;
    }

    getFileMap(fileName) {
        if (this.fileMapCache.get(fileName)) {
            console.log('FILE CACHE HIT!!', fileName);
            return this.fileMapCache.get(fileName);
        }

        console.log('FILE CACHE MISS...LOADING', fileName);
        const filePath = path.join(this.folderPath, fileName);
        const scanner = new FileScanner();
        const termsMap = scanner.parseFile(filePath);

        const fileMap = new Map();
        for (const [word, term] of termsMap) {
            fileMap.set(word, term.definition);
        }

        this.fileMapCache.set(fileName, fileMap);
        return fileMap;
    }

    getDefinition(word) {
        word = word.toLowerCase().trim();
        const fileName = this.getFileName(word);

        if (!fileName) {
            return null;
        }

        const fileMap = this.getFileMap(fileName);
        return fileMap.get(word) || null;
    }

    size() {
        return this.invertedIndex.size;
    }

    getAllWords() {
        return Array.from(this.invertedIndex.keys());
    }

    addWord(word, definition, category) {
        word = word.toLowerCase().trim();
        const fileName = `${category}.txt`;
        const filePath = path.join(this.folderPath, fileName);

        const fs = require('fs');
        fs.appendFileSync(filePath, `\n${word}=${definition}`);

        this.invertedIndex.set(word, fileName);

        if (this.fileMapCache.has(fileName)) {
            const fileMap = this.fileMapCache.get(fileName);
            if (fileMap) {
                fileMap.set(word, definition);
            }
        }

        return true;
    }
}

module.exports = InvertedIndex;
