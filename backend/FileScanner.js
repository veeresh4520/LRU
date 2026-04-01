const fs = require('fs');
const path = require('path');

class FileScanner {
    getAllFiles(folderPath) {
        const result = new Map();

        if (!fs.existsSync(folderPath)) {
            console.log('data_files folder not found or empty');
            return result;
        }

        const allFiles = fs.readdirSync(folderPath);

        for (const fileName of allFiles) {
            const filePath = path.join(folderPath, fileName);
            const stats = fs.statSync(filePath);

            if (stats.isFile() && fileName.toLowerCase().endsWith('.txt')) {
                result.set(fileName, filePath);
            }
        }

        return result;
    }

    parseFile(filePath) {
        const terms = new Map();

        try {
            const content = fs.readFileSync(filePath, 'utf-8');
            const lines = content.split('\n');
            const fileName = path.basename(filePath);

            for (const line of lines) {
                if (line.trim() === '') continue;

                const parts = line.split('=');
                if (parts.length !== 2) continue;

                const word = parts[0].trim().toLowerCase();
                const definition = parts[1].trim();

                terms.set(word, {
                    word,
                    definition,
                    sourceFile: fileName
                });
            }
        } catch (error) {
            console.error('Error reading file:', filePath, error);
        }

        return terms;
    }
}

module.exports = FileScanner;
