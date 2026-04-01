# LRU Cache Search Engine - Full Stack Web Application

A modern web application implementing a technical terms search engine with LRU caching, spatial locality loading, inverted indexing, and AI-powered features.

## Features

### Backend (Node.js/Express)
- **LRU Cache**: HashMap + Doubly Linked List implementation (capacity: 100)
- **Inverted Index**: Fast word-to-file mapping for efficient lookups
- **Spatial Locality Loader**: Loads ±3 neighboring terms when cache miss occurs
- **Trie-based Autocomplete**: Real-time search suggestions
- **Session Statistics**: Track cache hits, misses, and evictions
- **Groq AI Integration**:
  - AI fallback for words not in index
  - Spell correction
  - Definition simplification
  - Quiz generation from searched terms

### Frontend (React)
- **Search Page**: Autocomplete, results with cache indicators, AI simplification
- **Cache Dashboard**: Real-time LRU order visualization and statistics
- **Quiz Page**: AI-generated MCQ quizzes based on search history
- **Leaderboard**: User rankings by quiz scores
- **History Page**: View all past searches
- **Saved Words**: Personal learning collection
- **Developer Panel**: Add words, rebuild index, view all indexed terms

### Database (Supabase)
- Search history tracking
- Saved words management
- Quiz scores and leaderboard
- User activity analytics

## Tech Stack

- **Backend**: Node.js, Express.js
- **Frontend**: React, React Router, Vite
- **Database**: Supabase (PostgreSQL)
- **AI**: Groq API (Mixtral-8x7b)
- **Data Structures**: Custom LRU Cache, Trie, Inverted Index

## Setup Instructions

### Prerequisites
- Node.js 18+ and npm
- Groq API key (get from https://console.groq.com)
- Supabase account (already configured in this project)

### Step 1: Install Dependencies

```bash
# Install root dependencies
npm install

# Install client dependencies
cd client
npm install --legacy-peer-deps
cd ..
```

### Step 2: Configure Environment Variables

Edit `.env` file and add your Groq API key:

```
GROQ_API_KEY=your_groq_api_key_here
```

### Step 3: Start the Application

```bash
# Backend server (from project root)
node server.js

# Frontend (in a new terminal)
cd client
npm run dev
```

The application will be available at:
- Frontend: http://localhost:5173
- Backend API: http://localhost:3000/api

## Project Structure

```
├── backend/
│   ├── CacheNode.js          # LRU cache node
│   ├── DoubleLinkedList.js   # DLL for LRU implementation
│   ├── LRUCache.js           # Main LRU cache logic
│   ├── FileScanner.js        # Reads data files
│   ├── InvertedIndex.js      # Word-to-file mapping
│   ├── SpatialLoader.js      # Loads neighboring terms
│   ├── TrieNode.js           # Autocomplete trie
│   ├── SessionStats.js       # Statistics tracking
│   ├── SearchEngine.js       # Main search orchestrator
│   └── groqService.js        # AI integration
├── client/
│   ├── src/
│   │   ├── components/       # React components
│   │   ├── App.jsx           # Main app component
│   │   ├── App.css           # Global styles
│   │   └── index.css         # Base styles
│   └── public/
├── data_files/               # Term definitions (*.txt)
│   ├── ai.txt
│   ├── backend.txt
│   ├── cloud.txt
│   ├── database.txt
│   ├── distributed.txt
│   ├── dsa.txt
│   ├── java.txt
│   ├── ml.txt
│   ├── os.txt
│   └── systemdesign.txt
├── server.js                 # Express server
└── package.json
```

## Data Format

Terms are stored in `data_files/*.txt` with format:
```
word=definition
```

## API Endpoints

- `POST /api/search` - Search for a term
- `GET /api/cache/stats` - Get cache statistics
- `GET /api/index` - Get all indexed words
- `GET /api/autocomplete` - Get search suggestions
- `POST /api/add-word` - Add new word (requires password)
- `POST /api/rebuild-index` - Rebuild entire index
- `POST /api/simplify` - Get simplified explanation (AI)
- `POST /api/generate-quiz` - Generate AI quiz
- `POST /api/save-word` - Save word to collection
- `GET /api/saved-words/:username` - Get saved words
- `GET /api/history/:username` - Get search history
- `POST /api/submit-quiz` - Submit quiz score
- `GET /api/leaderboard` - Get top scorers

## Usage

1. **Search Terms**: Enter a technical term in the search box
2. **View Results**: See definition, source file, and cache status
3. **Simplify**: Get AI-generated simplified explanations
4. **Save Words**: Build your personal collection
5. **Take Quizzes**: Test knowledge with AI-generated quizzes
6. **Developer Panel**: Password is `admin123`

## How It Works

### LRU Cache Algorithm
- HashMap provides O(1) lookups
- Doubly Linked List maintains LRU order
- Most recently used at HEAD, least at TAIL
- On capacity full, evict TAIL node

### Spatial Locality Loading
On cache miss:
1. Load searched term
2. Load 3 terms before it
3. Load 3 terms after it
4. Insert all into cache

## License

MIT