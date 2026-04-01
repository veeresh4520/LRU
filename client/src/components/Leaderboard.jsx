import React, { useState, useEffect } from 'react';
import './Leaderboard.css';

function Leaderboard() {
  const [leaderboard, setLeaderboard] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchLeaderboard();
  }, []);

  const fetchLeaderboard = async () => {
    try {
      const response = await fetch('/api/leaderboard');
      const data = await response.json();
      setLeaderboard(data.leaderboard || []);
      setLoading(false);
    } catch (error) {
      console.error('Leaderboard error:', error);
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="loading">Loading leaderboard...</div>;
  }

  return (
    <div className="leaderboard-page">
      <h2>Leaderboard</h2>
      <div className="leaderboard-container">
        {leaderboard.length > 0 ? (
          <div className="leaderboard-list">
            {leaderboard.map((entry, index) => (
              <div key={index} className={`leader-item rank-${index + 1}`}>
                <div className="rank">#{index + 1}</div>
                <div className="username">{entry.username}</div>
                <div className="stats">
                  <div className="stat">
                    <span className="label">Score</span>
                    <span className="value">{entry.total_score}</span>
                  </div>
                  <div className="stat">
                    <span className="label">Quizzes</span>
                    <span className="value">{entry.quiz_count}</span>
                  </div>
                  <div className="stat">
                    <span className="label">Accuracy</span>
                    <span className="value">{parseFloat(entry.average_accuracy).toFixed(1)}%</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="empty">No quiz scores yet. Be the first!</div>
        )}
      </div>
    </div>
  );
}

export default Leaderboard;
