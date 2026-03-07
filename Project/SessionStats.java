
class SessionStats {

    private int totalSearches = 0; // total number of words searched
    private int cacheHits = 0; // terms found in cache
    private int cacheMisses = 0; // terms not found in cache
    private int evictions = 0; // terms removed from cache

    // if term found in cache : hit count ++ 
    public void recordHit() {
        totalSearches++;
        cacheHits++;
    }

    // if term not found in cache : miss count ++
    public void recordMiss() {
        totalSearches++;
        cacheMisses++;
    }

    // if a term is removed from cache : eviction count ++
    public void recordEviction() {
        evictions++;
    }

    // print stats
    public void printStats() {
        // printing hit percentage
        double hitPer, missPer;
        if (totalSearches == 0) {
            hitPer = 0.0;
            missPer = 0.0;
        } else {
            hitPer = (cacheHits * 100) / totalSearches;
            missPer = (cacheMisses * 100) / totalSearches;
        }
        System.out.println("===== Session Statistics =====");
        System.out.printf("Total Searches : %d%n", totalSearches);
        System.out.printf("Cache Hits     : %d   (%.1f%%)%n", cacheHits, hitPer);
        System.out.printf("Cache Misses   : %d   (%.1f%%)%n", cacheMisses, missPer);
        System.out.printf("Evictions      : %d%n", evictions);
        System.out.println("==============================");

    }
}
