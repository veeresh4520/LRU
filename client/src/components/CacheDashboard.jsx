import React, { useState, useEffect } from 'react';
import './CacheDashboard.css';

function CacheDashboard() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
    const interval = setInterval(fetchStats, 3000);
    return () => clearInterval(interval);
  }, []);

  const fetchStats = async () => {
    try {
      const response = await fetch('/api/cache/stats');
      const data = await response.json();
      setStats(data);
      setLoading(false);
    } catch (error) {
      console.error('Stats error:', error);
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="loading">Loading cache stats...</div>;
  }

  if (!stats) {
    return <div className="error">Failed to load stats</div>;
  }

  return (
    <div className="cache-dashboard">
      <h2>Cache Dashboard</h2>

      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-value">{stats.totalSearches}</div>
          <div className="stat-label">Total Searches</div>
        </div>

        <div className="stat-card success">
          <div className="stat-value">{stats.cacheHits}</div>
          <div className="stat-label">Cache Hits</div>
          <div className="stat-percent">{stats.hitPercentage}%</div>
        </div>

        <div className="stat-card warning">
          <div className="stat-value">{stats.cacheMisses}</div>
          <div className="stat-label">Cache Misses</div>
          <div className="stat-percent">{stats.missPercentage}%</div>
        </div>

        <div className="stat-card">
          <div className="stat-value">{stats.evictions}</div>
          <div className="stat-label">Evictions</div>
        </div>
      </div>

      <div className="cache-state">
        <div className="cache-header">
          <h3>LRU Cache State</h3>
          <div className="capacity-badge">
            {stats.cache?.size || 0} / {stats.cache?.capacity || 100}
          </div>
        </div>

        <div className="cache-list">
          {stats.cache?.items?.length > 0 ? (
            <>
              <div className="list-labels">
                <span className="mru-label">Most Recently Used</span>
                <span className="lru-label">Least Recently Used</span>
              </div>
              {stats.cache.items.map((item, index) => (
                <div key={index} className="cache-item">
                  <span className="item-index">#{index + 1}</span>
                  <span className="item-key">{item.key}</span>
                </div>
              ))}
            </>
          ) : (
            <div className="empty-cache">Cache is empty</div>
          )}
        </div>
      </div>
    </div>
  );
}

export default CacheDashboard;
