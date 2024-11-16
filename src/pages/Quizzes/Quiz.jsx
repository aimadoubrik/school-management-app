import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useSelector } from 'react-redux';

const Quiz = () => {
  const { id } = useParams();
  const quizData = useSelector((state) => state.quizzes.quizzes.find((quiz) => quiz.id === id));

  const [timeLeft, setTimeLeft] = useState(300);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState([]);
  const [quizFinished, setQuizFinished] = useState(false);
  const [isConfettiActive, setIsConfettiActive] = useState(false);
  const [retries, setRetries] = useState(0);

  useEffect(() => {
    setTimeLeft(300);
    setCurrentQuestionIndex(0);
    setSelectedAnswers([]);
    setQuizFinished(false);
  }, [id, retries]);

  useEffect(() => {
    if (timeLeft > 0) {
      const timer = setInterval(() => setTimeLeft((prev) => prev - 1), 1000);
      return () => clearInterval(timer);
    } else {
      finishQuiz();
    }
  }, [timeLeft]);

  const calculateScore = () =>
    quizData.questions.reduce(
      (score, question, index) =>
        score + (selectedAnswers[index] === question.correctAnswer ? 1 : 0),
      0
    );

  const finishQuiz = () => {
    setQuizFinished(true);
    const score = calculateScore();
    if (score >= 0.7 * quizData.questions.length) {
      setIsConfettiActive(true);
      setTimeout(() => setIsConfettiActive(false), 3000);
    }
  };

  const handleAnswerChange = (answer) => {
    const updatedAnswers = [...selectedAnswers];
    updatedAnswers[currentQuestionIndex] = answer;
    setSelectedAnswers(updatedAnswers);
  };

  const nextQuestion = () => {
    if (currentQuestionIndex < quizData.questions.length - 1) {
      setCurrentQuestionIndex((prev) => prev + 1);
    } else {
      finishQuiz();
    }
  };

  const handleRetryQuiz = () => {
    setRetries((prev) => prev + 1);
  };

  if (!quizData)
    return (
      <div className="min-h-screen flex items-center justify-center">
        <span className="loading loading-spinner loading-lg text-primary"></span>
      </div>
    );

  const currentQuestion = quizData.questions[currentQuestionIndex];
  const score = calculateScore();

  const QuizProgress = () => (
    <div className="w-full mb-8">
      <div className="flex justify-between mb-2">
        <span className="text-sm">
          Question {currentQuestionIndex + 1} of {quizData.questions.length}
        </span>
        <span className="text-sm font-mono">
          {Math.floor(timeLeft / 60)}:{(timeLeft % 60).toString().padStart(2, '0')}
        </span>
      </div>
      <progress
        className="progress progress-primary w-full"
        value={currentQuestionIndex + 1}
        max={quizData.questions.length}
      ></progress>
    </div>
  );

  const QuizHeader = () => (
    <div className="card bg-base-200 shadow-xl mb-8">
      <div className="card-body">
        <h2 className="card-title text-2xl">{quizData.courseName}</h2>
        <div className="flex flex-col gap-1">
          <p className="text-sm opacity-70">Quiz ID: {quizData.quizID}</p>
          <p className="text-sm opacity-70">
            Due: {new Date(quizData.Deadline).toLocaleDateString()}
          </p>
        </div>
      </div>
    </div>
  );

  const renderQuizContent = () => (
    <div className="space-y-8">
      <QuizProgress />
      <div className="card bg-base-100 shadow-xl">
        <div className="card-body">
          <h3 className="text-xl font-medium mb-6">{currentQuestion.question}</h3>
          <div className="space-y-4">
            {currentQuestion.answers.map((option) => (
              <button
                key={option}
                onClick={() => handleAnswerChange(option)}
                className={`btn btn-outline w-full justify-start h-auto py-4 px-6 normal-case text-left ${
                  selectedAnswers[currentQuestionIndex] === option
                    ? 'btn-primary'
                    : 'hover:btn-primary'
                }`}
              >
                {option}
              </button>
            ))}
          </div>
          <div className="card-actions justify-end mt-6">
            <button
              onClick={nextQuestion}
              disabled={!selectedAnswers[currentQuestionIndex]}
              className="btn btn-primary"
            >
              {currentQuestionIndex < quizData.questions.length - 1
                ? 'Next Question'
                : 'Finish Quiz'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  const renderQuizResults = () => (
    <div className="card bg-base-100 shadow-xl">
      <div className="card-body">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold mb-4">🎉 Quiz Completed! 🎉</h2>
          <div className="stats shadow-lg">
            <div className="stat">
              <div className="stat-title text-lg">Your Final Score</div>
              <div className="stat-value text-primary">
                {score}/{quizData.questions.length}
              </div>
              <div className="stat-desc text-sm">
                Accuracy: {((score / quizData.questions.length) * 100).toFixed(1)}%
              </div>
            </div>
          </div>
        </div>

        <div className="divider text-lg">📜 Question Review</div>
        <div className="space-y-6">
          {quizData.questions.map((question, index) => (
            <div key={index} className="border border-base-200 rounded-lg p-4 shadow-sm">
              <p className="font-medium mb-2">
                <span className="text-primary">{index + 1}.</span> {question.question}
              </p>
              <div className="flex flex-col space-y-2">
                <div className="flex items-center gap-2">
                  <span
                    className={`badge ${
                      selectedAnswers[index] === question.correctAnswer
                        ? 'badge-success'
                        : 'badge-error'
                    }`}
                  >
                    {selectedAnswers[index] === question.correctAnswer ? 'Correct' : 'Incorrect'}
                  </span>
                  <p>
                    <span className="font-semibold">Your Answer:</span>{' '}
                    {selectedAnswers[index] || 'Not answered'}
                  </p>
                </div>

                {selectedAnswers[index] !== question.correctAnswer && (
                  <p className="text-sm text-success">
                    <span className="font-semibold">Correct Answer:</span> {question.correctAnswer}
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>

        <div className="text-center mt-8">
          <button className="btn btn-primary btn-wide" onClick={() => handleRetryQuiz()}>
            Retry Quiz
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <div className="container mx-auto px-4 py-8 max-w-3xl">
      {isConfettiActive && (
        <div className="fixed inset-0 pointer-events-none text-center text-4xl">🎉🎊✨</div>
      )}
      <QuizHeader />
      {!quizFinished ? renderQuizContent() : renderQuizResults()}
    </div>
  );
};

export default Quiz;
