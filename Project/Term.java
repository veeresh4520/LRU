
class Term {

    private String word;
    private String definition;
    private String sourceFile;

    // constructor 
    Term(String word, String definition, String sourceFile) {
        // .trim() removes extra whitespace from the beginning and end of a string.
        this.word = word.toLowerCase().trim();
        this.definition = definition.trim();
        this.sourceFile = sourceFile;
    }

    // getter methods 
    public String getWord() {
        return word;
    }

    public String getDefinition() {
        return definition;
    }

    public String getSourceFile() {
        return sourceFile;
    }

    /*
        -toString() is a special method from the Object class.
        -toString method - converts the object to a readable string representation
        -Every Java class automatically inherits it.
        -So whenever Java needs to print an object, it calls toString().

        Sample Input
            word = stack
            sourceFile = dsa.txt
        Expected Output 
            cache [dsa.txt]
     */
    public String toString() {
        return word + " [" + sourceFile + "]";
    }
}
