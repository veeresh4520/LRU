
import java.io.*;
import java.util.*;

// class looks inside data_files folder to search for txt files
class FileScanner {

    // method returns all text files inside the data_files folder : return type example: "java.txt" → File("data_files/java.txt")
    public HashMap<String, File> getAllFiles() {

        // creating a file object which just points to the folder
        File folder = new File("data_files");

        // get all the files present in that folder
        File[] allFiles = folder.listFiles();

        // create a hash table; key = file name ; value = actual file object
        HashMap<String, File> result = new HashMap<>();

        // if folder does not exist or cannot be read
        if (allFiles == null) {
            System.out.println("data_files folder not found or empty");
            return result;
        }

        // loop through every file in the folder
        for (File file : allFiles) {

            // check two conditions
            // 1) it must be a file (not another folder)
            // 2) file extension must be .txt
            if (file.isFile() && file.getName().toLowerCase().endsWith(".txt")) {

                // add entry into hash map; key   → filename; value → file object
                result.put(file.getName(), file);
            }
        }
        // return map containing all valid text files
        return result;
    }

    // method reads a single file and converts each line into a Term object
    // return type example: "cache" → Term("cache","temporary memory","dsa.txt")
    public HashMap<String, Term> parseFile(File file) {

        // create a map to store terms from this file
        // key = word; value = Term object containing word, definition, and file source
        HashMap<String, Term> terms = new LinkedHashMap<>();

        // try-with-resources automatically closes the reader
        try (BufferedReader br = new BufferedReader(new FileReader(file))) {
            String line;
            // read file line by line until end of file
            while ((line = br.readLine()) != null) {
                // skip empty lines
                if (line.trim().isEmpty()) {
                    continue;
                }

                // split line into word and definition
                // example line: cache = temporary memory
                String[] parts = line.split("=", 2);

                // skip line if format is invalid
                if (parts.length != 2) {
                    continue;
                }

                // clean the word and definition
                // remove extra spaces
                // convert word to lowercase for consistent searching
                String word = parts[0].trim().toLowerCase();
                String definition = parts[1].trim();

                // create Term object
                Term term = new Term(word, definition, file.getName());

                // store term inside map
                terms.put(word, term);
            }

        } catch (IOException e) {

            // print error if file reading fails
            System.err.println("Error reading file: " + file.getName());
        }

        // return map containing all terms from this file
        return terms;
    }
}
