# Quick Reference Card

## Installation & Setup

```bash
# 1. Install dependencies
npm install
cd client && npm install --legacy-peer-deps && cd ..

# 2. Add Groq API key to .env
GROQ_API_KEY=your_key_here

# 3. Start application
node server.js        # Backend (Terminal 1)
cd client && npm run dev  # Frontend (Terminal 2)
```

## URLs

- **Frontend**: http://localhost:5173
- **Backend API**: http://localhost:3000/api
- **Production**: http://localhost:3000

## Key Features

| Feature | Description | Location |
|---------|-------------|----------|
| Search | Find terms with autocomplete | `/` |
| Cache View | See LRU order in real-time | `/cache` |
| Quiz | AI-generated MCQ tests | `/quiz` |
| Leaderboard | Top users by score | `/leaderboard` |
| History | Your past searches | `/history` |
| Saved Words | Your collection | `/saved` |
| Dev Panel | Add words, rebuild index | `/dev` |

## Developer Panel

- **Password**: `admin123`
- **Add Words**: Select category, enter word/definition
- **Rebuild Index**: Reload all data files
- **View Index**: See all 1000+ indexed words

## API Endpoints

### Search
```bash
POST /api/search
Body: { "word": "cache", "username": "john" }
```

### Cache Stats
```bash
GET /api/cache/stats
```

### Autocomplete
```bash
GET /api/autocomplete?prefix=cac
```

### Add Word
```bash
POST /api/add-word
Body: { "word": "new", "definition": "...", "category": "dsa", "password": "admin123" }
```

### Quiz
```bash
POST /api/generate-quiz
Body: { "words": ["cache", "tree"], "count": 5 }
```

## Data Files

Location: `data_files/*.txt`

Format: `word=definition`

Categories:
- `ai.txt` - AI/ML terms
- `backend.txt` - Backend dev
- `cloud.txt` - Cloud computing
- `database.txt` - Database concepts
- `distributed.txt` - Distributed systems
- `dsa.txt` - Data structures
- `java.txt` - Java programming
- `ml.txt` - Machine learning
- `os.txt` - Operating systems
- `systemdesign.txt` - System design

## LRU Cache Specs

- **Capacity**: 100 terms
- **Eviction**: Least recently used (TAIL)
- **Data Structure**: HashMap + Doubly Linked List
- **Complexity**: O(1) get/put operations
- **Spatial Loading**: ±3 neighbors on cache miss

## Database Schema

### search_history
```sql
id, username, word, definition, source, cache_hit, created_at
```

### saved_words
```sql
id, username, word, definition, created_at
UNIQUE(username, word)
```

### quiz_scores
```sql
id, username, score, total, accuracy, created_at
```

### leaderboard (view)
```sql
username, total_score, quiz_count, average_accuracy, last_quiz_at
```

## Common Commands

### Backend
```bash
node server.js                    # Start server
npm install                       # Install dependencies
```

### Frontend
```bash
cd client
npm run dev                       # Dev server with HMR
npm run build                     # Production build
npm run preview                   # Preview production build
```

### Add New Category
1. Create `data_files/newcategory.txt`
2. Add terms: `word=definition`
3. Update `DeveloperPanel.jsx` select options
4. Rebuild index via Dev Panel

## Keyboard Shortcuts

- `Enter` in search → Search
- Click suggestion → Instant search
- Type 2+ chars → Autocomplete

## Performance Tips

1. **Search Related Terms**: Spatial locality speeds up related searches
2. **Use Autocomplete**: Faster than typing full words
3. **Check Cache Dashboard**: Monitor hit rate for optimization
4. **Generate Quizzes**: After 5+ searches for best results

## Troubleshooting

| Issue | Solution |
|-------|----------|
| Backend won't start | Check port 3000 is free |
| Frontend build fails | Run `npm install --legacy-peer-deps` |
| Groq API errors | Verify API key in `.env` |
| Cache not working | Check SearchEngine initialization |
| DB errors | Verify Supabase credentials |

## Environment Variables

Required in `.env`:
```
GROQ_API_KEY=your_groq_key
VITE_SUPABASE_URL=https://...
VITE_SUPABASE_ANON_KEY=eyJ...
PORT=3000
```

## Project Structure (Simplified)

```
├── backend/              # Core algorithms
│   ├── LRUCache.js      # Cache implementation
│   ├── InvertedIndex.js # Word lookup
│   └── SpatialLoader.js # Neighbor loading
├── client/src/
│   ├── components/      # React UI
│   └── App.jsx         # Main app
├── data_files/         # Term definitions
├── server.js           # Express API
└── .env               # Configuration
```

## Testing Checklist

- [ ] Search a term
- [ ] See cache hit/miss indicator
- [ ] Check autocomplete works
- [ ] View cache dashboard
- [ ] Generate and take a quiz
- [ ] Check leaderboard
- [ ] Save a word
- [ ] View history
- [ ] Use developer panel

## Algorithms Preserved from Java

✅ LRU Cache (HashMap + DLL)
✅ Inverted Index
✅ Spatial Locality (±3 neighbors)
✅ File Scanner
✅ Session Statistics

## New Features Added

🆕 Trie Autocomplete
🆕 Groq AI Integration
🆕 Supabase Database
🆕 React Web UI
🆕 Quiz System
🆕 Leaderboard

## Resources

- **Groq API**: https://console.groq.com
- **Supabase**: https://supabase.com
- **React Docs**: https://react.dev
- **Vite Docs**: https://vitejs.dev

---

**Need Help?** Check README.md, SETUP_GUIDE.md, or IMPLEMENTATION_SUMMARY.md
