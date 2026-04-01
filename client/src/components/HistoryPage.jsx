import React, { useState, useEffect } from 'react';
import './HistoryPage.css';

function HistoryPage({ username }) {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchHistory();
  }, [username]);

  const fetchHistory = async () => {
    try {
      const response = await fetch(`/api/history/${username}`);
      const data = await response.json();
      setHistory(data.history || []);
      setLoading(false);
    } catch (error) {
      console.error('History error:', error);
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="loading">Loading history...</div>;
  }

  return (
    <div className="history-page">
      <h2>Search History</h2>
      <div className="history-container">
        {history.length > 0 ? (
          <div className="history-list">
            {history.map((item) => (
              <div key={item.id} className="history-item">
                <div className="item-header">
                  <h3>{item.word}</h3>
                  <div className="badges">
                    {item.cache_hit && <span className="badge cache-hit">Cache Hit</span>}
                    <span className="badge source">{item.source}</span>
                  </div>
                </div>
                <p className="definition">{item.definition}</p>
                <div className="timestamp">
                  {new Date(item.created_at).toLocaleString()}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="empty">No search history yet</div>
        )}
      </div>
    </div>
  );
}

export default HistoryPage;
