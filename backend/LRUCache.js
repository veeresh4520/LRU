const DoubleLinkedList = require('./DoubleLinkedList');
const CacheNode = require('./CacheNode');

class LRUCache {
    constructor(capacity) {
        this.capacity = capacity;
        this.dll = new DoubleLinkedList();
        this.hashMap = new Map();
    }

    get(key) {
        key = key.toLowerCase().trim();
        if (!this.hashMap.has(key)) {
            return null;
        }
        const node = this.hashMap.get(key);
        this.dll.moveToFront(node);
        return node.value;
    }

    put(key, value) {
        key = key.toLowerCase().trim();
        let evictionOccurred = false;

        if (this.hashMap.has(key)) {
            const node = this.hashMap.get(key);
            node.value = value;
            this.dll.moveToFront(node);
            return evictionOccurred;
        }

        if (this.hashMap.size >= this.capacity) {
            const evicted = this.dll.removeTail();
            if (evicted) {
                this.hashMap.delete(evicted.key);
                console.log('[EVICTED]:', evicted.key);
                evictionOccurred = true;
            }
        }

        const newNode = new CacheNode(key, value);
        this.dll.addToFront(newNode);
        this.hashMap.set(key, newNode);

        return evictionOccurred;
    }

    contains(key) {
        return this.hashMap.has(key.toLowerCase().trim());
    }

    getCacheState() {
        return {
            size: this.hashMap.size,
            capacity: this.capacity,
            items: this.dll.toArray()
        };
    }

    clear() {
        this.hashMap.clear();
        this.dll = new DoubleLinkedList();
    }
}

module.exports = LRUCache;
