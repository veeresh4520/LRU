
class DoubleLinkedList {

    // declaring head and tail pointers 
    CacheNode head = null;
    CacheNode tail = null;

    public DoubleLinkedList() {
        head = new CacheNode(null, null); // this created dummy ndodes
        tail = new CacheNode(null, null);
        head.next = tail; // create head and tail as dummy nodes
        tail.prev = head;
    }

    // method addTofront
    public void addToFront(CacheNode node) {
        node.next = head.next; // this points the new node at front 
        node.prev = head;  // point new node ka previous to head
        head.next.prev = node; // the node currently at front now points back to  new node 
        head.next = node; // now point head to new node 
    }
    //remove Node

    public void removeNode(CacheNode node) {
        node.prev.next = node.next;  // node before skips over removed node 
        node.next.prev = node.prev;   // node after skips back over removed node 
    }

    //Remove Tail 
    public CacheNode removeTail() {
        if (head.next == tail) {
            return null;
        }
        CacheNode lruNode = tail.prev; // least recelty used node stays at last 
        removeNode(lruNode); // this removes the last node 
        return lruNode; // the removed node returns 
    }

    public void moveToFront(CacheNode node) {
        removeNode(node);  // this will remove the node from current position 
        addToFront(node);  // this will add to front cause we used this 
    }
    // printing method to check the order 

    public void printList() {
        System.out.println("The DLL List From MRU=>LRU");
        CacheNode temp = head.next;; // cause head is dummy node 
        while (temp != null) {
            System.out.print(temp.key + "=>");
            temp = temp.next;

        }
        System.out.println("End");
    }
}
