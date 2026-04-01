require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');
const { createClient } = require('@supabase/supabase-js');
const SearchEngine = require('./backend/SearchEngine');
const GroqService = require('./backend/groqService');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

const supabase = createClient(
    process.env.VITE_SUPABASE_URL,
    process.env.VITE_SUPABASE_ANON_KEY
);

const searchEngine = new SearchEngine();
searchEngine.initialize(path.join(__dirname, 'data_files'));

const groqService = process.env.GROQ_API_KEY
    ? new GroqService(process.env.GROQ_API_KEY)
    : null;

app.post('/api/search', async (req, res) => {
    try {
        const { word, username } = req.body;

        if (!word) {
            return res.status(400).json({ error: 'Word is required' });
        }

        let result = searchEngine.search(word);

        if (!result.definition && groqService) {
            console.log('[AI FALLBACK] Querying Groq API for:', word);
            const aiDefinition = await groqService.getDefinition(word);
            if (aiDefinition) {
                result.definition = aiDefinition;
                result.source = 'AI Generated (Groq)';
                result.cacheHit = false;
            }
        }

        if (username && result.definition) {
            await supabase.from('search_history').insert({
                username,
                word: word.toLowerCase(),
                definition: result.definition,
                source: result.source,
                cache_hit: result.cacheHit
            });
        }

        res.json(result);
    } catch (error) {
        console.error('Search error:', error);
        res.status(500).json({ error: 'Search failed' });
    }
});

app.get('/api/cache/stats', (req, res) => {
    try {
        const cacheState = searchEngine.getCacheState();
        const stats = searchEngine.getStats();

        res.json({
            ...stats,
            cache: cacheState
        });
    } catch (error) {
        console.error('Stats error:', error);
        res.status(500).json({ error: 'Failed to get stats' });
    }
});

app.get('/api/index', (req, res) => {
    try {
        const allWords = searchEngine.getAllWords();
        res.json({ words: allWords, count: allWords.length });
    } catch (error) {
        console.error('Index error:', error);
        res.status(500).json({ error: 'Failed to get index' });
    }
});

app.post('/api/add-word', (req, res) => {
    try {
        const { word, definition, category, password } = req.body;

        if (password !== 'admin123') {
            return res.status(403).json({ error: 'Invalid password' });
        }

        if (!word || !definition || !category) {
            return res.status(400).json({ error: 'Word, definition, and category are required' });
        }

        const result = searchEngine.addWord(word, definition, category);
        res.json({ success: result });
    } catch (error) {
        console.error('Add word error:', error);
        res.status(500).json({ error: 'Failed to add word' });
    }
});

app.post('/api/rebuild-index', (req, res) => {
    try {
        const { password } = req.body;

        if (password !== 'admin123') {
            return res.status(403).json({ error: 'Invalid password' });
        }

        searchEngine.rebuildIndex();
        res.json({ success: true });
    } catch (error) {
        console.error('Rebuild error:', error);
        res.status(500).json({ error: 'Failed to rebuild index' });
    }
});

app.get('/api/autocomplete', (req, res) => {
    try {
        const { prefix } = req.query;

        if (!prefix) {
            return res.json({ suggestions: [] });
        }

        const suggestions = searchEngine.autocomplete(prefix);
        res.json({ suggestions });
    } catch (error) {
        console.error('Autocomplete error:', error);
        res.status(500).json({ error: 'Autocomplete failed' });
    }
});

app.post('/api/simplify', async (req, res) => {
    try {
        const { word, definition } = req.body;

        if (!groqService) {
            return res.status(503).json({ error: 'AI service not available' });
        }

        const simplified = await groqService.simplifyDefinition(word, definition);
        res.json({ simplified });
    } catch (error) {
        console.error('Simplify error:', error);
        res.status(500).json({ error: 'Simplification failed' });
    }
});

app.post('/api/spell-check', async (req, res) => {
    try {
        const { word } = req.body;

        if (!groqService) {
            return res.status(503).json({ error: 'AI service not available' });
        }

        const corrected = await groqService.correctSpelling(word);
        res.json({ corrected });
    } catch (error) {
        console.error('Spell check error:', error);
        res.status(500).json({ error: 'Spell check failed' });
    }
});

app.post('/api/generate-quiz', async (req, res) => {
    try {
        const { words, count } = req.body;

        if (!groqService) {
            return res.status(503).json({ error: 'AI service not available' });
        }

        const quiz = await groqService.generateQuiz(words, count);
        res.json(quiz);
    } catch (error) {
        console.error('Quiz generation error:', error);
        res.status(500).json({ error: 'Quiz generation failed' });
    }
});

app.post('/api/save-word', async (req, res) => {
    try {
        const { username, word, definition } = req.body;

        if (!username || !word || !definition) {
            return res.status(400).json({ error: 'Username, word, and definition are required' });
        }

        const { data, error } = await supabase
            .from('saved_words')
            .insert({ username, word: word.toLowerCase(), definition })
            .select()
            .single();

        if (error) throw error;

        res.json({ success: true, data });
    } catch (error) {
        console.error('Save word error:', error);
        res.status(500).json({ error: 'Failed to save word' });
    }
});

app.get('/api/saved-words/:username', async (req, res) => {
    try {
        const { username } = req.params;

        const { data, error } = await supabase
            .from('saved_words')
            .select('*')
            .eq('username', username)
            .order('created_at', { ascending: false });

        if (error) throw error;

        res.json({ words: data });
    } catch (error) {
        console.error('Get saved words error:', error);
        res.status(500).json({ error: 'Failed to get saved words' });
    }
});

app.get('/api/history/:username', async (req, res) => {
    try {
        const { username } = req.params;

        const { data, error } = await supabase
            .from('search_history')
            .select('*')
            .eq('username', username)
            .order('created_at', { ascending: false })
            .limit(50);

        if (error) throw error;

        res.json({ history: data });
    } catch (error) {
        console.error('Get history error:', error);
        res.status(500).json({ error: 'Failed to get history' });
    }
});

app.post('/api/submit-quiz', async (req, res) => {
    try {
        const { username, score, total, accuracy } = req.body;

        if (!username) {
            return res.status(400).json({ error: 'Username is required' });
        }

        const { data, error } = await supabase
            .from('quiz_scores')
            .insert({ username, score, total, accuracy })
            .select()
            .single();

        if (error) throw error;

        res.json({ success: true, data });
    } catch (error) {
        console.error('Submit quiz error:', error);
        res.status(500).json({ error: 'Failed to submit quiz' });
    }
});

app.get('/api/leaderboard', async (req, res) => {
    try {
        const { data, error } = await supabase
            .from('leaderboard')
            .select('*')
            .order('total_score', { ascending: false })
            .limit(10);

        if (error) throw error;

        res.json({ leaderboard: data });
    } catch (error) {
        console.error('Get leaderboard error:', error);
        res.status(500).json({ error: 'Failed to get leaderboard' });
    }
});

app.use(express.static(path.join(__dirname, 'client/dist')));

app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'client/dist/index.html'));
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
