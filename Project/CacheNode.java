
class CacheNode {

    String key;
    String value;
    CacheNode prev;
    CacheNode next;

    public CacheNode(String key, String value) {
        this.key = key;
        this.value = value;
        this.prev = null;
        this.next = null;
    }

}
