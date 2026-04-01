const CacheNode = require('./CacheNode');

class DoubleLinkedList {
    constructor() {
        this.head = new CacheNode(null, null);
        this.tail = new CacheNode(null, null);
        this.head.next = this.tail;
        this.tail.prev = this.head;
    }

    addToFront(node) {
        node.next = this.head.next;
        node.prev = this.head;
        this.head.next.prev = node;
        this.head.next = node;
    }

    removeNode(node) {
        node.prev.next = node.next;
        node.next.prev = node.prev;
    }

    removeTail() {
        if (this.head.next === this.tail) {
            return null;
        }
        const lruNode = this.tail.prev;
        this.removeNode(lruNode);
        return lruNode;
    }

    moveToFront(node) {
        this.removeNode(node);
        this.addToFront(node);
    }

    toArray() {
        const result = [];
        let temp = this.head.next;
        while (temp !== this.tail) {
            result.push({ key: temp.key, value: temp.value });
            temp = temp.next;
        }
        return result;
    }
}

module.exports = DoubleLinkedList;
