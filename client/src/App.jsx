import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useLocation } from 'react-router-dom';
import SearchPage from './components/SearchPage';
import CacheDashboard from './components/CacheDashboard';
import QuizPage from './components/QuizPage';
import Leaderboard from './components/Leaderboard';
import DeveloperPanel from './components/DeveloperPanel';
import HistoryPage from './components/HistoryPage';
import SavedWords from './components/SavedWords';
import './App.css';

function Navigation() {
  const location = useLocation();

  const navItems = [
    { path: '/', label: 'Search' },
    { path: '/cache', label: 'Cache' },
    { path: '/quiz', label: 'Quiz' },
    { path: '/leaderboard', label: 'Leaderboard' },
    { path: '/history', label: 'History' },
    { path: '/saved', label: 'Saved' },
    { path: '/dev', label: 'Dev Panel' }
  ];

  return (
    <nav className="navigation">
      {navItems.map(item => (
        <Link
          key={item.path}
          to={item.path}
          className={`nav-link ${location.pathname === item.path ? 'active' : ''}`}
        >
          {item.label}
        </Link>
      ))}
    </nav>
  );
}

function App() {
  const [username, setUsername] = useState('');
  const [showUsernamePrompt, setShowUsernamePrompt] = useState(false);

  useEffect(() => {
    const savedUsername = localStorage.getItem('username');
    if (savedUsername) {
      setUsername(savedUsername);
    } else {
      setShowUsernamePrompt(true);
    }
  }, []);

  const handleUsernameSubmit = (e) => {
    e.preventDefault();
    if (username.trim()) {
      localStorage.setItem('username', username.trim());
      setShowUsernamePrompt(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('username');
    setUsername('');
    setShowUsernamePrompt(true);
  };

  if (showUsernamePrompt) {
    return (
      <div className="username-prompt">
        <div className="prompt-card">
          <h1>Welcome to LRU Search Engine</h1>
          <p>Enter your username to continue</p>
          <form onSubmit={handleUsernameSubmit}>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Enter username"
              autoFocus
            />
            <button type="submit">Continue</button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <Router>
      <div className="app">
        <header className="header">
          <div className="header-content">
            <h1 className="logo">LRU Search Engine</h1>
            <div className="user-info">
              <span className="username-display">{username}</span>
              <button className="logout-btn" onClick={handleLogout}>Logout</button>
            </div>
          </div>
          <Navigation />
        </header>

        <main className="main-content">
          <Routes>
            <Route path="/" element={<SearchPage username={username} />} />
            <Route path="/cache" element={<CacheDashboard />} />
            <Route path="/quiz" element={<QuizPage username={username} />} />
            <Route path="/leaderboard" element={<Leaderboard />} />
            <Route path="/dev" element={<DeveloperPanel />} />
            <Route path="/history" element={<HistoryPage username={username} />} />
            <Route path="/saved" element={<SavedWords username={username} />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
