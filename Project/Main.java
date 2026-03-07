
import java.util.*;

public class Main {

    public static void handleSearch(SearchEngine engine, String input) {
        System.out.println();
        String result = engine.search(input); // this stores the final result
        if (result == null) {
            System.out.println("Word not Found with defifntion :" + input);

        } else {
            String source = engine.getSourceFile(input);// this will get in which file the word has
            System.out.println("Word        :" + input);
            System.out.println("Definition   :" + result);
            System.out.println("Sorces      :" + source);

        }
        System.out.println("------------------------------------------");
        System.out.println();
    }

    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        SearchEngine engine = new SearchEngine();
        engine.initialize("data_files/"); // this is the folder path
        System.out.println("===============================================");
        System.out.println("   LRU Cache Search Engine");
        System.out.println("   Cache Capacity : 100");
        System.out.println("   Terms Indexed  : " + engine.getIndexSize());
        System.out.println("===============================================");
        System.out.println("Commands: word to search | 'stats' | 'cache' | 'exit'");
        // System.out.println("Enter ");
        // System.out.println("1.Search");
        // System.out.println("Stats");
        // System.out.println("Cache");
        // System.out.println("Exit");

        while (true) {
            System.out.println("Enter a word to Search");
            String input = sc.nextLine().trim().toLowerCase();
            if (input.isEmpty()) {
                continue;  // if the input is empty then just contiione
            }
            if (input.equalsIgnoreCase("exit")) { // if user enters exit 
                System.out.println();
                engine.getStats().printStats(); // get the status 
                System.out.println("Goodbye!");
                break;
            } else if (input.equalsIgnoreCase("Stats")) {
                System.out.println();
                engine.getStats().printStats();
                System.out.println();
            } else if (input.equalsIgnoreCase("cache")) {
                System.out.println();
                engine.printCacheState();
                System.out.println();
            } else {
                handleSearch(engine, input); // it send the input and the object engine
            }

        }
    }
}
