import React, { useState, useEffect } from 'react';
import './DeveloperPanel.css';

function DeveloperPanel() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  const [allWords, setAllWords] = useState([]);
  const [newWord, setNewWord] = useState({ word: '', definition: '', category: 'dsa' });
  const [loading, setLoading] = useState(false);

  const handleAuth = (e) => {
    e.preventDefault();
    if (password === 'admin123') {
      setIsAuthenticated(true);
      fetchAllWords();
    } else {
      alert('Invalid password');
    }
  };

  const fetchAllWords = async () => {
    try {
      const response = await fetch('/api/index');
      const data = await response.json();
      setAllWords(data.words || []);
    } catch (error) {
      console.error('Index error:', error);
    }
  };

  const handleAddWord = async (e) => {
    e.preventDefault();
    if (!newWord.word || !newWord.definition || !newWord.category) {
      alert('All fields are required');
      return;
    }

    setLoading(true);
    try {
      const response = await fetch('/api/add-word', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...newWord, password: 'admin123' })
      });

      const data = await response.json();
      if (data.success) {
        alert('Word added successfully');
        setNewWord({ word: '', definition: '', category: 'dsa' });
        fetchAllWords();
      } else {
        alert('Failed to add word');
      }
    } catch (error) {
      console.error('Add word error:', error);
      alert('Failed to add word');
    } finally {
      setLoading(false);
    }
  };

  const handleRebuildIndex = async () => {
    if (!confirm('Rebuild the entire index? This will reload all files.')) return;

    setLoading(true);
    try {
      const response = await fetch('/api/rebuild-index', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password: 'admin123' })
      });

      const data = await response.json();
      if (data.success) {
        alert('Index rebuilt successfully');
        fetchAllWords();
      }
    } catch (error) {
      console.error('Rebuild error:', error);
      alert('Failed to rebuild index');
    } finally {
      setLoading(false);
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="dev-panel">
        <div className="auth-form">
          <h2>Developer Panel</h2>
          <p>Enter password to access</p>
          <form onSubmit={handleAuth}>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Password"
              autoFocus
            />
            <button type="submit">Authenticate</button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="dev-panel">
      <h2>Developer Panel</h2>

      <div className="panel-section">
        <h3>Add New Word</h3>
        <form onSubmit={handleAddWord} className="add-word-form">
          <input
            type="text"
            value={newWord.word}
            onChange={(e) => setNewWord({ ...newWord, word: e.target.value })}
            placeholder="Word"
          />
          <textarea
            value={newWord.definition}
            onChange={(e) => setNewWord({ ...newWord, definition: e.target.value })}
            placeholder="Definition"
            rows="3"
          />
          <select
            value={newWord.category}
            onChange={(e) => setNewWord({ ...newWord, category: e.target.value })}
          >
            <option value="dsa">DSA</option>
            <option value="java">Java</option>
            <option value="database">Database</option>
            <option value="os">Operating System</option>
            <option value="ml">Machine Learning</option>
            <option value="ai">AI</option>
            <option value="backend">Backend</option>
            <option value="cloud">Cloud</option>
            <option value="distributed">Distributed Systems</option>
            <option value="systemdesign">System Design</option>
          </select>
          <button type="submit" disabled={loading}>
            {loading ? 'Adding...' : 'Add Word'}
          </button>
        </form>
      </div>

      <div className="panel-section">
        <h3>Index Management</h3>
        <button onClick={handleRebuildIndex} disabled={loading} className="rebuild-btn">
          Rebuild Index
        </button>
        <div className="index-stats">
          <strong>{allWords.length}</strong> words indexed
        </div>
      </div>

      <div className="panel-section">
        <h3>All Indexed Words</h3>
        <div className="words-list">
          {allWords.slice(0, 100).map((word, index) => (
            <span key={index} className="word-chip">{word}</span>
          ))}
          {allWords.length > 100 && (
            <span className="more">+{allWords.length - 100} more</span>
          )}
        </div>
      </div>
    </div>
  );
}

export default DeveloperPanel;
