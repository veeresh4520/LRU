
class Node {

    String word; // this is the key 
    String definition; // this is the value 
    Node previous;
    Node next;

    // constructor
    Node(String word, String definition) {
        this.word = word;
        this.definition = definition;
        this.previous = null;
        this.next = null;
    }
}
