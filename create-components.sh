#!/bin/bash

# This script creates all remaining React component files

cat > /tmp/cc-agent/65250131/project/client/src/components/CacheDashboard.jsx << 'EOF'
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
EOF

cat > /tmp/cc-agent/65250131/project/client/src/components/CacheDashboard.css << 'EOF'
.cache-dashboard {
  max-width: 1200px;
  margin: 0 auto;
}

.cache-dashboard h2 {
  text-align: center;
  margin-bottom: 2rem;
  font-size: 2rem;
  background: linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1.5rem;
  margin-bottom: 3rem;
}

.stat-card {
  background: rgba(30, 30, 46, 0.8);
  border: 1px solid rgba(59, 130, 246, 0.3);
  border-radius: 16px;
  padding: 2rem;
  text-align: center;
  transition: all 0.3s;
}

.stat-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 10px 30px rgba(59, 130, 246, 0.2);
}

.stat-card.success {
  border-color: rgba(34, 197, 94, 0.5);
}

.stat-card.warning {
  border-color: rgba(251, 146, 60, 0.5);
}

.stat-value {
  font-size: 3rem;
  font-weight: 700;
  color: #3b82f6;
  margin-bottom: 0.5rem;
}

.success .stat-value {
  color: #4ade80;
}

.warning .stat-value {
  color: #fb923c;
}

.stat-label {
  color: #94a3b8;
  font-size: 1rem;
  margin-bottom: 0.5rem;
}

.stat-percent {
  color: #cbd5e1;
  font-size: 0.9rem;
  margin-top: 0.5rem;
}

.cache-state {
  background: rgba(30, 30, 46, 0.8);
  border: 1px solid rgba(59, 130, 246, 0.3);
  border-radius: 16px;
  padding: 2rem;
}

.cache-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
}

.cache-header h3 {
  color: #3b82f6;
  font-size: 1.5rem;
}

.capacity-badge {
  padding: 0.5rem 1rem;
  background: rgba(59, 130, 246, 0.2);
  border: 1px solid rgba(59, 130, 246, 0.4);
  border-radius: 8px;
  color: #3b82f6;
  font-weight: 600;
}

.list-labels {
  display: flex;
  justify-content: space-between;
  margin-bottom: 1rem;
  padding: 0 1rem;
  font-size: 0.9rem;
  color: #94a3b8;
}

.cache-list {
  max-height: 600px;
  overflow-y: auto;
}

.cache-item {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1rem;
  background: rgba(59, 130, 246, 0.05);
  border: 1px solid rgba(59, 130, 246, 0.2);
  border-radius: 8px;
  margin-bottom: 0.5rem;
  transition: all 0.2s;
}

.cache-item:hover {
  background: rgba(59, 130, 246, 0.1);
  border-color: rgba(59, 130, 246, 0.4);
}

.item-index {
  font-weight: 600;
  color: #94a3b8;
  min-width: 40px;
}

.item-key {
  color: #e4e4e7;
  font-family: monospace;
}

.empty-cache {
  text-align: center;
  padding: 3rem;
  color: #94a3b8;
  font-size: 1.1rem;
}

.loading,
.error {
  text-align: center;
  padding: 3rem;
  font-size: 1.2rem;
}

.error {
  color: #f87171;
}
EOF

echo "CacheDashboard components created successfully"
