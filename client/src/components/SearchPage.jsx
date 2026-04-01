import React, { useState, useEffect } from 'react';
import './SearchPage.css';

function SearchPage({ username }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [suggestions, setSuggestions] = useState([]);
  const [simplified, setSimplified] = useState('');
  const [simplifyLoading, setSimplifyLoading] = useState(false);

  useEffect(() => {
    if (searchTerm.length >= 2) {
      fetchSuggestions(searchTerm);
    } else {
      setSuggestions([]);
    }
  }, [searchTerm]);

  const fetchSuggestions = async (prefix) => {
    try {
      const response = await fetch(`/api/autocomplete?prefix=${encodeURIComponent(prefix)}`);
      const data = await response.json();
      setSuggestions(data.suggestions || []);
    } catch (error) {
      console.error('Autocomplete error:', error);
    }
  };

  const handleSearch = async (word = searchTerm) => {
    if (!word.trim()) return;

    setLoading(true);
    setResult(null);
    setSimplified('');
    setSuggestions([]);

    try {
      const response = await fetch('/api/search', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ word, username })
      });

      const data = await response.json();
      setResult(data);
    } catch (error) {
      console.error('Search error:', error);
      setResult({ error: 'Search failed' });
    } finally {
      setLoading(false);
    }
  };

  const handleSimplify = async () => {
    if (!result?.definition) return;

    setSimplifyLoading(true);
    try {
      const response = await fetch('/api/simplify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ word: searchTerm, definition: result.definition })
      });

      const data = await response.json();
      setSimplified(data.simplified);
    } catch (error) {
      console.error('Simplify error:', error);
    } finally {
      setSimplifyLoading(false);
    }
  };

  const handleSave = async () => {
    if (!result?.definition) return;

    try {
      await fetch('/api/save-word', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          username,
          word: searchTerm,
          definition: result.definition
        })
      });
      alert('Word saved successfully!');
    } catch (error) {
      console.error('Save error:', error);
      alert('Failed to save word');
    }
  };

  const handleSuggestionClick = (suggestion) => {
    setSearchTerm(suggestion);
    setSuggestions([]);
    handleSearch(suggestion);
  };

  return (
    <div className="search-page">
      <div className="search-container">
        <h2>Search Technical Terms</h2>
        <div className="search-box">
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
            placeholder="Enter a term to search..."
            className="search-input"
          />
          <button onClick={() => handleSearch()} className="search-btn" disabled={loading}>
            {loading ? 'Searching...' : 'Search'}
          </button>

          {suggestions.length > 0 && (
            <div className="suggestions">
              {suggestions.map((suggestion, index) => (
                <div
                  key={index}
                  className="suggestion-item"
                  onClick={() => handleSuggestionClick(suggestion)}
                >
                  {suggestion}
                </div>
              ))}
            </div>
          )}
        </div>

        {result && (
          <div className="result-card">
            {result.error ? (
              <div className="error-message">{result.error}</div>
            ) : result.definition ? (
              <>
                <div className="result-header">
                  <h3>{searchTerm}</h3>
                  <div className="badges">
                    {result.cacheHit && <span className="badge cache-hit">Cache Hit</span>}
                    {result.source && (
                      <span className="badge source">{result.source}</span>
                    )}
                  </div>
                </div>

                <div className="definition">
                  <p>{result.definition}</p>
                </div>

                {simplified && (
                  <div className="simplified">
                    <h4>Simplified Explanation</h4>
                    <p>{simplified}</p>
                  </div>
                )}

                <div className="action-buttons">
                  <button onClick={handleSimplify} disabled={simplifyLoading}>
                    {simplifyLoading ? 'Simplifying...' : 'Explain Simply'}
                  </button>
                  <button onClick={handleSave}>Save Word</button>
                </div>
              </>
            ) : (
              <div className="not-found">Word not found in index or AI</div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default SearchPage;
