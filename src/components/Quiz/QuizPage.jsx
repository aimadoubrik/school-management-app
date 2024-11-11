import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { Clock, CheckCircle, ArrowRight } from "lucide-react";
import { useSpring, animated } from "@react-spring/web";
import Confetti from "react-confetti";
import { useSelector } from "react-redux";

const QuizPage = () => {
  const { id } = useParams(); // Get the quiz ID from the URL

  // Fetch quiz data from the Redux store using useSelector
  const quizData = useSelector((state) => state.quizzes.quizzes.find((quiz) => quiz.id === id));

  const [timeLeft, setTimeLeft] = useState(300); // Default time: 5 minutes
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState([]);
  const [quizFinished, setQuizFinished] = useState(false);
  const [confettiActive, setConfettiActive] = useState(false);

  // Handle the progress bar animation
  const progressAnimation = useSpring({
    width: `${((300 - timeLeft) / 300) * 100}%`,
    config: { tension: 200, friction: 30 },
  });

  // Countdown Timer
  useEffect(() => {
    if (timeLeft === 0) {
      setQuizFinished(true);
      return;
    }
    const interval = setInterval(() => {
      setTimeLeft((prevTime) => prevTime - 1);
    }, 1000);
    return () => clearInterval(interval);
  }, [timeLeft]);

  // Format Time Left
  const formatTime = (time) => {
    const minutes = Math.floor(time / 60);
    const seconds = time % 60;
    return `${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;
  };

  // Handle selecting an answer
  const handleAnswerChange = (answer) => {
    const updatedAnswers = [...selectedAnswers];
    updatedAnswers[currentQuestionIndex] = answer;
    setSelectedAnswers(updatedAnswers);
  };

  // Handle quiz submission
  const handleSubmitQuiz = () => {
    setQuizFinished(true);
    setConfettiActive(true); // Activate confetti on quiz completion
    setTimeout(() => setConfettiActive(false), 7000); // Stop confetti after 7 seconds
  };

  // Move to the next question
  const goToNextQuestion = () => {
    if (currentQuestionIndex < quizData.questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    } else {
      setQuizFinished(true);
    }
  };

  // Calculate total score
  const calculateScore = () => {
    let score = 0;
    quizData.questions.forEach((question, index) => {
      if (selectedAnswers[index] === question.correctAnswer) {
        score++;
      }
    });
    return score;
  };

  useEffect(() => {
    // Apply this only when the component is mounted
    document.body.style.overflowX = 'hidden';
    return () => {
      // Clean up overflowX style when component unmounts
      document.body.style.overflowX = 'auto';
    };
  }, []);

  // If quiz data is not yet loaded, display a loading message
  if (!quizData) {
    return <div>Loading...</div>;
  }

  const currentQuestion = quizData.questions[currentQuestionIndex];

  return (
    <div className="min-h-screen bg-[#eae7e7] text-white p-6 lg:p-12">
      <div className="max-w-4xl mx-auto bg-[#1E1E1E] p-8 rounded-lg shadow-xl space-y-6">
        {/* Confetti animation when quiz is finished */}
        {confettiActive && <Confetti />}

        {/* Quiz Header */}
        <div className="card bg-[#2A2A2A] text-white shadow-xl hover:shadow-2xl transition-all duration-300 ease-in-out">
          <div className="card-body">
            <h1 className="text-3xl font-semibold text-gradient mb-2">{quizData.courseName}</h1>
            <p className="text-lg mb-2">Quiz ID: {quizData.quizID}</p>
            <p className="text-sm text-gray-400">Deadline: {new Date(quizData.Deadline).toLocaleString()}</p>
          </div>
        </div>

        {/* Countdown Timer */}
        {!quizFinished && (
          <div className="flex justify-between items-center mb-8">
            <div className="text-lg text-gray-300 flex items-center space-x-2">
              <Clock size={18} />
              <span>{formatTime(timeLeft)}</span>
            </div>
            <div>
              <span className="text-sm text-gray-500">Time Left</span>
            </div>
          </div>
        )}

        {/* Progress Bar */}
        {!quizFinished && (
          <div className="mb-6">
            <div className="w-full bg-gray-700 rounded-full h-2.5">
              <animated.div
                className="bg-gradient-to-r from-teal-400 to-cyan-500 h-2.5 rounded-full"
                style={progressAnimation}
              />
            </div>
          </div>
        )}

        {/* Current Question */}
        {!quizFinished && (
          <div className="bg-gradient-to-r from-gray-700 to-gray-600 p-6 rounded-lg shadow-lg">
            <h2 className="text-xl font-semibold">{currentQuestion.question}</h2>

            <div className="space-y-4 mt-4">
              {currentQuestion.answers.map((option) => (
                <button
                  key={option}
                  onClick={() => handleAnswerChange(option)}
                  className={`w-full py-3 text-lg rounded-lg font-semibold focus:outline-none transition duration-300 ease-in-out transform ${
                    selectedAnswers[currentQuestionIndex] === option
                      ? "bg-gradient-to-r from-teal-600 to-cyan-500 text-white"
                      : "bg-gradient-to-r from-gray-800 to-gray-700 text-gray-200 hover:bg-gradient-to-r hover:from-teal-600 hover:to-cyan-600 hover:text-white"
                  }`}
                >
                  {option}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Next Button / Submit Button */}
        {!quizFinished && (
          <div className="mt-8 flex justify-between items-center">
            {currentQuestionIndex < quizData.questions.length - 1 ? (
              <button
                onClick={goToNextQuestion}
                disabled={!selectedAnswers[currentQuestionIndex]} // Disable next button if no answer is selected
                className={`btn btn-primary w-full text-white bg-gradient-to-r from-cyan-600 to-teal-600 hover:bg-gradient-to-r hover:from-cyan-500 hover:to-teal-500 transition duration-200 ${!selectedAnswers[currentQuestionIndex] ? "opacity-50 cursor-not-allowed" : ""}`}
              >
                <ArrowRight size={18} className="mr-2 inline-block" />
                Next Question
              </button>
            ) : (
              <button
                onClick={handleSubmitQuiz}
                className="btn btn-primary w-full text-white bg-gradient-to-r from-cyan-600 to-teal-600 hover:bg-gradient-to-r hover:from-cyan-500 hover:to-teal-500 transition duration-200"
              >
                <CheckCircle size={18} className="mr-2 inline-block" />
                Submit Quiz
              </button>
            )}
          </div>
        )}

        {/* Quiz Finished */}
        {quizFinished && (
          <div className="bg-gradient-to-r from-gray-700 to-gray-600 p-6 rounded-lg shadow-lg">
            <div className="text-center text-lg text-gray-200">
              <h2 className="text-2xl font-semibold text-gradient">Quiz Finished!</h2>
              <span className="badge badge-neutral text-lg">Score : {calculateScore()}/{quizData.questions.length}</span>
              <p className="mt-4">Thank you for completing the quiz. Here are your results:</p>

              {/* Display answers */}
              {quizData.questions.map((question, index) => (
                <div key={index} className="mt-4 text-xl font-semibold text-gray-300">
                  <p>
                    <span className="text-gradient">{question.question}</span>
                  </p>
                  <p>
                    Your answer:{" "}
                    <span
                      className={
                        selectedAnswers[index] === question.correctAnswer
                          ? "text-green-500"
                          : "text-red-500"
                      }
                    >
                      {selectedAnswers[index] || "Not Answered"}
                    </span>
                  </p>
                  <p>
                    Correct answer:{" "}
                    <span className="text-green-500">{question.correctAnswer}</span>
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default QuizPage;
