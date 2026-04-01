# Setup Guide - LRU Cache Search Engine

## Quick Start

### 1. Get Your Groq API Key

1. Visit https://console.groq.com
2. Sign up or log in
3. Navigate to API Keys section
4. Create a new API key
5. Copy the key

### 2. Configure Environment

Edit the `.env` file in the project root:

```bash
GROQ_API_KEY=gsk_your_actual_groq_api_key_here
```

### 3. Start the Application

#### Option A: Using Development Mode
```bash
# Backend (Terminal 1)
node server.js

# Frontend (Terminal 2)
cd client
npm run dev
```

Access the app at: http://localhost:5173

#### Option B: Using Production Build
```bash
# From project root
node server.js
```

Access the app at: http://localhost:3000

## First Steps

### 1. Create Your Username
When you first open the app, enter a username. This will be saved locally.

### 2. Try Searching
- Search for technical terms like "cache", "algorithm", "binary tree"
- Notice the autocomplete suggestions
- Check if it's a cache hit or miss
- See the source file where the term came from

### 3. Explore Features

#### Search Page
- Type to get autocomplete
- Click "Explain Simply" for AI-simplified explanations
- Save words to your collection

#### Cache Dashboard
- View real-time LRU order (most recent to least recent)
- See cache statistics (hits, misses, evictions)
- Watch the cache update as you search

#### Quiz Page
- Search at least 3 terms first
- Click "Generate Quiz" for AI-powered MCQ
- Answer questions and submit
- Check your score and accuracy

#### Leaderboard
- View top 10 users by quiz scores
- See quiz count and average accuracy
- Compete with others

#### History
- Review all your past searches
- See which were cache hits
- Quick reference for definitions

#### Saved Words
- View your saved word collection
- Study your personal glossary

#### Developer Panel
- Password: `admin123`
- Add new words to the dataset
- Choose category (dsa, java, ml, etc.)
- Rebuild the index after changes

## Understanding the System

### LRU Cache
The cache stores 100 most recently used terms. When you search:
- If term is in cache → **Cache Hit** (instant)
- If not in cache → **Cache Miss** (loads from file)

### Spatial Locality
On cache miss, the system loads:
- The searched term
- 3 terms before it in the file
- 3 terms after it in the file

This improves performance for related searches.

### AI Fallback
If a term isn't in the dataset:
- System queries Groq AI
- Gets definition automatically
- Source shown as "AI Generated (Groq)"

## Troubleshooting

### Backend Won't Start
- Check if port 3000 is available
- Verify `.env` file exists with correct format
- Ensure Node.js 18+ is installed

### Frontend Won't Build
- Run `npm install --legacy-peer-deps` in client folder
- Clear node_modules and reinstall if needed

### Groq API Errors
- Verify API key is correct in `.env`
- Check API quota at https://console.groq.com
- Ensure no typos in GROQ_API_KEY

### Database Errors
- Supabase is pre-configured
- If issues persist, check Supabase dashboard
- Verify VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY

## Tips for Best Experience

1. **Search Multiple Terms**: The more you search, the better the cache performance

2. **Use Autocomplete**: Start typing and select from suggestions for faster searches

3. **Try Related Terms**: After searching "cache", try "caching", "eviction", etc. to see spatial locality in action

4. **Generate Quizzes**: Search 5-10 terms, then generate a quiz to test your knowledge

5. **Check Cache Dashboard**: Watch how the LRU order changes as you search different terms

6. **Save Important Terms**: Build your learning collection for future reference

## Performance Metrics

You can track:
- **Hit Rate**: Percentage of searches found in cache
- **Cache Utilization**: Number of items in cache (max 100)
- **Evictions**: How many items were removed to make space
- **Quiz Accuracy**: Your performance on AI-generated quizzes

## Adding Custom Terms

Via Developer Panel:
1. Enter password: `admin123`
2. Fill in word, definition, category
3. Click "Add Word"
4. Optionally rebuild index

Via File System:
1. Edit files in `data_files/`
2. Format: `word=definition`
3. Use Developer Panel to rebuild index

## Data Files

Current categories:
- `ai.txt` - Artificial Intelligence terms
- `backend.txt` - Backend development
- `cloud.txt` - Cloud computing
- `database.txt` - Database concepts
- `distributed.txt` - Distributed systems
- `dsa.txt` - Data structures & algorithms
- `java.txt` - Java programming
- `ml.txt` - Machine learning
- `os.txt` - Operating systems
- `systemdesign.txt` - System design

## Support

For issues or questions:
1. Check this guide
2. Review README.md
3. Check browser console for errors
4. Verify all dependencies are installed
5. Ensure Groq API key is valid

Happy searching!
