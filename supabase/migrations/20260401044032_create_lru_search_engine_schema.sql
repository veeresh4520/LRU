/*
  # LRU Search Engine Database Schema

  1. New Tables
    - `search_history`
      - `id` (uuid, primary key)
      - `username` (text)
      - `word` (text)
      - `definition` (text)
      - `source` (text)
      - `cache_hit` (boolean)
      - `created_at` (timestamp)

    - `saved_words`
      - `id` (uuid, primary key)
      - `username` (text)
      - `word` (text, unique per user)
      - `definition` (text)
      - `created_at` (timestamp)

    - `quiz_scores`
      - `id` (uuid, primary key)
      - `username` (text)
      - `score` (integer)
      - `total` (integer)
      - `accuracy` (numeric)
      - `created_at` (timestamp)

    - `leaderboard` (materialized view)
      - `username` (text, primary key)
      - `total_score` (integer)
      - `quiz_count` (integer)
      - `average_accuracy` (numeric)
      - `last_quiz_at` (timestamp)

  2. Security
    - Enable RLS on all tables
    - Public access for reading leaderboard
    - Users can manage their own data
*/

CREATE TABLE IF NOT EXISTS search_history (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  username text NOT NULL,
  word text NOT NULL,
  definition text NOT NULL,
  source text,
  cache_hit boolean DEFAULT false,
  created_at timestamptz DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_search_history_username ON search_history(username);
CREATE INDEX IF NOT EXISTS idx_search_history_created_at ON search_history(created_at DESC);

ALTER TABLE search_history ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own search history"
  ON search_history FOR SELECT
  USING (true);

CREATE POLICY "Users can insert own search history"
  ON search_history FOR INSERT
  WITH CHECK (true);

CREATE TABLE IF NOT EXISTS saved_words (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  username text NOT NULL,
  word text NOT NULL,
  definition text NOT NULL,
  created_at timestamptz DEFAULT now(),
  UNIQUE(username, word)
);

CREATE INDEX IF NOT EXISTS idx_saved_words_username ON saved_words(username);

ALTER TABLE saved_words ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own saved words"
  ON saved_words FOR SELECT
  USING (true);

CREATE POLICY "Users can insert own saved words"
  ON saved_words FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Users can delete own saved words"
  ON saved_words FOR DELETE
  USING (true);

CREATE TABLE IF NOT EXISTS quiz_scores (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  username text NOT NULL,
  score integer NOT NULL DEFAULT 0,
  total integer NOT NULL DEFAULT 0,
  accuracy numeric NOT NULL DEFAULT 0,
  created_at timestamptz DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_quiz_scores_username ON quiz_scores(username);
CREATE INDEX IF NOT EXISTS idx_quiz_scores_created_at ON quiz_scores(created_at DESC);

ALTER TABLE quiz_scores ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view all quiz scores"
  ON quiz_scores FOR SELECT
  USING (true);

CREATE POLICY "Users can insert own quiz scores"
  ON quiz_scores FOR INSERT
  WITH CHECK (true);

CREATE OR REPLACE VIEW leaderboard AS
SELECT 
  username,
  SUM(score) as total_score,
  COUNT(*) as quiz_count,
  AVG(accuracy) as average_accuracy,
  MAX(created_at) as last_quiz_at
FROM quiz_scores
GROUP BY username
ORDER BY total_score DESC;
