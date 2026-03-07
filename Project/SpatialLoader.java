
import java.io.File;

class SpatialLoader {

    private String folderPath;
    private Invertedindex index;

    SpatialLoader(String folderPath, Invertedindex index) {
        this.folderPath = folderPath;
        this.index = index;
    }

    /*
    A HashMap stores data in pairs (Key,Value). 
    When you ask for an array, Java needs to know if you want an array of the Keys, the Entries, or the Values.
    Method                          Returns
        scanner.parseFile(file)         The entire HashMap object (No toArray here).
        .values()                       A Collection of all Term objects.
        .toArray(new Term[0])           Converts that collection into the specific Term[] array you need.
     */
    // Returns all terms from a file in their original line order. 
    public Term[] getOrderedTerms(String fileName) {
        File file = new File(folderPath + "/" + fileName);
        FileScanner scanner = new FileScanner();
        return scanner.parseFile(file).values().toArray(new Term[0]);
    }

    // Find index of term, then terms from 3 positions above and below
    public Term[] getNeighbors(String word, String fileName) {
        Term[] terms = getOrderedTerms(fileName);
        int targetIndex = -1;
        // finding index of the key
        for (int i = 0; i < terms.length; i++) {
            if (terms[i].getWord().equals(word)) {
                targetIndex = i;
                break;
            }
        }
        // if word not found 
        if (targetIndex == -1) {
            return new Term[0];  // Return empty array
        }
        // set boundaries 
        int start = Math.max(0, targetIndex - 3);
        int end = Math.min(terms.length - 1, targetIndex + 3);
        // Collect neighbors
        int neighborCount = end - start + 1;
        Term[] neighbors = new Term[neighborCount];
        for (int i = 0; i < neighborCount; i++) {
            neighbors[i] = terms[start + i];
        }
        return neighbors;
    }

    // load neighbours and the key into cache
    public void loadNeighborsIntoCache(String word, String fileName, LRUCache cache) {
        Term[] neighbors = getNeighbors(word, fileName);  // Now returns array
        System.out.println("[SPATIAL LOAD] " + neighbors.length + " neighbors for: " + word);
        // Load all neighbors except the searched word first
        for (Term term : neighbors) {
            if (term.getWord().equals(word)) {
                continue;  // skip the searched word for now - it's most recently used
            }
            if (!cache.contains(term.getWord())) {
                cache.put(term.getWord(), term.getDefinition());
                System.out.println("  Loaded neighbor: " + term.getWord());
            } else {
                System.out.println("  Skipped (already cached): " + term.getWord());
            }
        }
        // Load the searched word last so it sits at HEAD (MRU)
        for (Term term : neighbors) {
            if (term.getWord().equals(word)) {
                cache.put(term.getWord(), term.getDefinition());
                // print confirmation for the searched word
                System.out.println("  Loaded searched word (MRU): " + term.getWord());
                break;
            }
        }
    }
}
