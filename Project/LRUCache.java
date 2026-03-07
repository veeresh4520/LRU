
import java.util.HashMap;

/*
    The HashMap maps a String key to a CacheNode reference. 
    The DLL tracks the order. 
    Both are always kept in sync — every put and get must update both.
 */
class LRUCache {

    private int capacity;
    private DoubleLinkedList dll;
    private HashMap<String, CacheNode> hashMap;

    // constructor
    LRUCache(int capacity) {
        this.capacity = capacity;
        this.dll = new DoubleLinkedList();
        this.hashMap = new HashMap<>();
    }

    // method to look for the word in cache
    public String get(String key) {
        key = key.toLowerCase().trim();
        // if word not found in cache return null
        if (!hashMap.containsKey(key)) {
            return null;
        }
        // if word found in cache, move it to the front (recently used)
        CacheNode node = hashMap.get(key);
        dll.moveToFront(node);
        return node.value;
    }

    /* method to upda   
    it handles 3 major tasks
        1. update existing cache terms 
        2. inserting a new term when cache is not full
        3. inserting new terms when cache is full
     */
    public boolean put(String key, String value) {
        key = key.toLowerCase().trim();
        boolean evictionOccurred = false; // flag to track if eviction happened

        // if already in cache, move to front
        if (hashMap.containsKey(key)) {
            CacheNode node = hashMap.get(key);
            node.value = value;
            dll.moveToFront(node);
            return evictionOccurred; // false - no eviction, just update
        }

        // if cache capacity is full - remove least recently used nodes
        if (hashMap.size() >= capacity) {
            CacheNode evicted = dll.removeTail();
            if (evicted != null) {
                hashMap.remove(evicted.key);
                System.out.println("[EVICTED]: " + evicted.key);
                evictionOccurred = true; // eviction happened
            }
        }

        // else if term not in cache and there is space in cache
        CacheNode newNode = new CacheNode(key, value);
        dll.addToFront(newNode);
        hashMap.put(key, newNode);

        return evictionOccurred; // return whether eviction happened
    }

    // helper method to check if the word is there in the cache
    // used by the search engine first
    // if word is present then get that word, or else go to index
    // return true if word is present in cache else return false
    public boolean contains(String key) {
        return hashMap.containsKey(key.toLowerCase().trim());
    }

    // method to print cache status
    public void printCacheState() {
        System.out.println("Cache State (" + hashMap.size() + "/" + capacity + ")");
        dll.printList();
        System.out.println("HashMap keys: " + hashMap.keySet());
    }

}
