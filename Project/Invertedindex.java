
import java.io.File;
import java.util.HashMap;

public class Invertedindex {
    // this is word => in which file it has 

    HashMap<String, String> invertedIndex = new HashMap<>(); // this gives in which file that topic is ..
    HashMap<String, HashMap<String, String>> fileMapcache = new HashMap<>(); // this outer hasmap gives the file the inner hashmap gives the topic ka difinition 
    String folderPath;

    public void buildIndex(String folderPath) { // this method is to build the map for each words
        this.folderPath = folderPath; // this is to store the file path 

        // FIX 1: Removed the argument folderPath because the error says it requires no arguments
        FileScanner scanner = new FileScanner();

        // FIX: Changed List<File> to Map<String, File> based on the error message
        HashMap<String, File> filesMap = scanner.getAllFiles(); // this  get's alll files 

        // We iterate through the values of the map (the File objects)
        for (File file : filesMap.values()) { // this goes to each files
            // FIX 2 & 3: parseFile is non-static (needs an instance) and returns a Map, not a List
            HashMap<String, Term> terms = scanner.parseFile(file); // this reads one file at one time

            for (Term term : terms.values()) { // Iterate through the values of the Map
                invertedIndex.put(term.getWord(), term.getSourceFile()); // this thing taking the words and puttinh in index hashtable
            }
            fileMapcache.put(file.getName(), null); // this stores only the file name but not open it 
        }
        System.out.println("Index-Built " + invertedIndex.size() + " terms across :" + filesMap.size() + "files");
    }

    String getFileName(String word) { // gets the file name and check whether the file exits or not is yes retue file name or no means return null
        word = word.toLowerCase().trim();
        String fileName = invertedIndex.get(word);
        if (fileName == null) {
            return null;
        }
        return fileName;
    }

    HashMap<String, String> getFileMap(String fileName) {
        if (fileMapcache.get(fileName) != null) {// if the file name is not empty it returns file nam
            System.out.println("FILE CACHE HIT!!" + fileName);
            return fileMapcache.get(fileName);
        }
        System.out.println("FILE CACHE MISS...LODAING" + fileName);
        File file = new File(folderPath + "/" + fileName); // if the file not loaded  create a new hashmap for tha for reusable

        // FIX: Create an instance of FileScanner to call the non-static parseFile method
        FileScanner scanner = new FileScanner();
        HashMap<String, Term> termsMap = scanner.parseFile(file);

        HashMap<String, String> fileMap = new HashMap<>();
        for (Term term : termsMap.values()) {
            fileMap.put(term.getWord(), term.getDefinition());//this builts 
        }

        // FIX: Changed fileMapCache to fileMapcache (lowercase 'c') to match the declaration
        fileMapcache.put(fileName, fileMap);  // RETAIN: store for future use
        return fileMap;
    }

    public String getDefinition(String word) {
        word = word.toLowerCase().trim();
        // search through index to locate the word
        String fileName = getFileName(word);
        // if the word does not exist in any file return null
        if (fileName == null) {
            return null;
        }
        // go to that file hash map and get the definition 
        HashMap<String, String> fileMap = getFileMap(fileName);
        return fileMap.get(word);
    }

    public int size() {
        return invertedIndex.size();  // returns how many words are indexed
    }
}
