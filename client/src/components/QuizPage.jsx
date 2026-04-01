import React, { useState, useEffect } from 'react';
import './QuizPage.css';

function QuizPage({ username }) {
  const [quiz, setQuiz] = useState(null);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState({});
  const [showResults, setShowResults] = useState(false);
  const [score, setScore] = useState(0);
  const [loading, setLoading] = useState(false);
  const [searchHistory, setSearchHistory] = useState([]);

  useEffect(() => {
    fetchSearchHistory();
  }, []);

  const fetchSearchHistory = async () => {
    try {
      const response = await fetch(`/api/history/${username}`);
      const data = await response.json();
      const words = data.history?.map(h => h.word) || [];
      setSearchHistory(words.slice(0, 10));
    } catch (error) {
      console.error('History error:', error);
    }
  };

  const generateQuiz = async () => {
    if (searchHistory.length < 3) {
      alert('Search at least 3 terms before generating a quiz!');
      return;
    }

    setLoading(true);
    try {
      const response = await fetch('/api/generate-quiz', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ words: searchHistory, count: 5 })
      });

      const data = await response.json();
      if (data.questions && data.questions.length > 0) {
        setQuiz(data);
        setCurrentQuestion(0);
        setSelectedAnswers({});
        setShowResults(false);
        setScore(0);
      } else {
        alert('Failed to generate quiz. Please try again.');
      }
    } catch (error) {
      console.error('Quiz error:', error);
      alert('Failed to generate quiz');
    } finally {
      setLoading(false);
    }
  };

  const handleAnswerSelect = (questionIndex, answerIndex) => {
    setSelectedAnswers({
      ...selectedAnswers,
      [questionIndex]: answerIndex
    });
  };

  const submitQuiz = async () => {
    let correctAnswers = 0;
    quiz.questions.forEach((q, index) => {
      if (selectedAnswers[index] === q.correctAnswer) {
        correctAnswers++;
      }
    });

    const finalScore = correctAnswers;
    const totalQuestions = quiz.questions.length;
    const accuracy = (finalScore / totalQuestions) * 100;

    setScore(finalScore);
    setShowResults(true);

    try {
      await fetch('/api/submit-quiz', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          username,
          score: finalScore,
          total: totalQuestions,
          accuracy: accuracy.toFixed(2)
        })
      });
    } catch (error) {
      console.error('Submit error:', error);
    }
  };

  if (!quiz) {
    return (
      <div className="quiz-page">
        <div className="quiz-container">
          <h2>AI-Powered Quiz</h2>
          <div className="quiz-intro">
            <p>Generate a quiz based on your search history!</p>
            <p className="history-count">
              You have searched {searchHistory.length} terms
            </p>
            <button
              onClick={generateQuiz}
              disabled={loading || searchHistory.length < 3}
              className="generate-btn"
            >
              {loading ? 'Generating Quiz...' : 'Generate Quiz'}
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (showResults) {
    return (
      <div className="quiz-page">
        <div className="quiz-container">
          <h2>Quiz Results</h2>
          <div className="results">
            <div className="score-display">
              <div className="score-value">
                {score} / {quiz.questions.length}
              </div>
              <div className="score-label">
                {((score / quiz.questions.length) * 100).toFixed(0)}% Correct
              </div>
            </div>

            <div className="results-list">
              {quiz.questions.map((q, index) => {
                const userAnswer = selectedAnswers[index];
                const isCorrect = userAnswer === q.correctAnswer;

                return (
                  <div key={index} className={`result-item ${isCorrect ? 'correct' : 'incorrect'}`}>
                    <div className="result-question">{q.question}</div>
                    <div className="result-answer">
                      Your answer: {q.options[userAnswer]}
                      {!isCorrect && ` (Correct: ${q.options[q.correctAnswer]})`}
                    </div>
                  </div>
                );
              })}
            </div>

            <button onClick={() => setQuiz(null)} className="retry-btn">
              Take Another Quiz
            </button>
          </div>
        </div>
      </div>
    );
  }

  const question = quiz.questions[currentQuestion];
  const progress = ((currentQuestion + 1) / quiz.questions.length) * 100;

  return (
    <div className="quiz-page">
      <div className="quiz-container">
        <div className="quiz-header">
          <h2>Question {currentQuestion + 1} of {quiz.questions.length}</h2>
          <div className="progress-bar">
            <div className="progress-fill" style={{ width: `${progress}%` }} />
          </div>
        </div>

        <div className="question-card">
          <h3>{question.question}</h3>
          <div className="options">
            {question.options.map((option, index) => (
              <button
                key={index}
                className={`option ${selectedAnswers[currentQuestion] === index ? 'selected' : ''}`}
                onClick={() => handleAnswerSelect(currentQuestion, index)}
              >
                {option}
              </button>
            ))}
          </div>
        </div>

        <div className="quiz-navigation">
          <button
            onClick={() => setCurrentQuestion(prev => prev - 1)}
            disabled={currentQuestion === 0}
            className="nav-btn"
          >
            Previous
          </button>

          {currentQuestion < quiz.questions.length - 1 ? (
            <button
              onClick={() => setCurrentQuestion(prev => prev + 1)}
              disabled={selectedAnswers[currentQuestion] === undefined}
              className="nav-btn next"
            >
              Next
            </button>
          ) : (
            <button
              onClick={submitQuiz}
              disabled={Object.keys(selectedAnswers).length !== quiz.questions.length}
              className="nav-btn submit"
            >
              Submit Quiz
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

export default QuizPage;
