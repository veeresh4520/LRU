
public class SearchEngine {

    private Invertedindex index;
    private LRUCache cache;
    private SpatialLoader loader;
    private String folderPath;
    private SessionStats stats = new SessionStats();

    public void initialize(String folderPath) {
        this.folderPath = folderPath;
        index = new Invertedindex(); // this creeating object of invertedIndex class
        index.buildIndex(folderPath); // this calling to build the index from invertedindex claass
        cache = new LRUCache(100);
        loader = new SpatialLoader(folderPath, index);
        System.out.println("Ready. " + index.size() + " terms indexed.");
    }

    public String search(String word) {
        word = word.trim().toLowerCase(); // this convert to lowercase and remove spaces
        System.out.println("Searching \n" + word + " ' ");
        if (cache.contains(word)) { // search in cache
            stats.recordHit();
            System.out.println("[CACHE HIT]");
            return cache.get(word);
        }
        stats.recordMiss();
        System.out.println("[CACHE MISS]");
        String fileName = index.getFileName(word);//this will get the file name in where the topic is present
        if (fileName == null) {
            System.out.println("Not found in any file");
            return null;
        }
        System.out.println("Found in file " + fileName);
        loader.loadNeighborsIntoCache(word, fileName, cache);
        // loader.loadNeighborsIntoCache(word, fileName, cache);

        String definition = cache.get(word);
        if (definition == null) {
            System.out.println("Failed to load: " + word);
            return null;
        }
        return definition;

    }

    public int getIndexSize() {
        return index.size();
    }

    public void printCacheState() {
        cache.printCacheState();
    }

    public SessionStats getStats() {
        return stats;
    }

    public String getSourceFile(String word) {
        return index.getFileName(word.toLowerCase().trim());
    }
}
