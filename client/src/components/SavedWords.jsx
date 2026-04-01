import React, { useState, useEffect } from 'react';
import './SavedWords.css';

function SavedWords({ username }) {
  const [words, setWords] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchSavedWords();
  }, [username]);

  const fetchSavedWords = async () => {
    try {
      const response = await fetch(`/api/saved-words/${username}`);
      const data = await response.json();
      setWords(data.words || []);
      setLoading(false);
    } catch (error) {
      console.error('Saved words error:', error);
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="loading">Loading saved words...</div>;
  }

  return (
    <div className="saved-words-page">
      <h2>Saved Words</h2>
      <div className="saved-container">
        {words.length > 0 ? (
          <div className="saved-grid">
            {words.map((item) => (
              <div key={item.id} className="saved-card">
                <h3>{item.word}</h3>
                <p>{item.definition}</p>
                <div className="saved-date">
                  Saved {new Date(item.created_at).toLocaleDateString()}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="empty">No saved words yet. Save words from search results!</div>
        )}
      </div>
    </div>
  );
}

export default SavedWords;
