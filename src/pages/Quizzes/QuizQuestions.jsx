import { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import { ChevronLeft, ChevronRight, Trash2, ArrowLeft } from 'lucide-react';

const BASE_URL = 'http://localhost:3000';

export default function QuizQuestions() {
  // State management for quiz data and UI
  const { quizId } = useParams(); // Get the quizId from the URL parameters
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const [selectedQuestions, setSelectedQuestions] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const QUESTIONS_PER_PAGE = 5;

  // Fetch quiz details
  const [quiz, setQuiz] = useState({});
  useEffect(() => {
    axios
      .get(`${BASE_URL}/quizzes/${quizId}`)
      .then((res) => {
        const { courseName, Deadline } = res.data;
        setQuiz({ courseName, quizId, Deadline });
      })
      .catch((err) => console.error(err));
  }, [quizId]);

  // Quiz header component showing course details
  const { courseName, Deadline } = quiz;
  const QuizHeader = () => (
    <div className="card bg-base-200 shadow-xl mb-8">
      <div className="card-body">
        <h2 className="card-title text-2xl">{courseName}</h2>
        <div className="flex flex-col gap-1">
          <p className="text-sm opacity-70">Quiz ID: {quizId}</p>
          <p className="text-sm opacity-70">Due: {new Date(Deadline).toLocaleDateString()}</p>
        </div>
      </div>
    </div>
  );
  // Calcul des questions pour la page courante
  const indexOfLastQuestion = currentPage * QUESTIONS_PER_PAGE;
  const indexOfFirstQuestion = indexOfLastQuestion - QUESTIONS_PER_PAGE;
  const currentQuestions = questions.slice(indexOfFirstQuestion, indexOfLastQuestion);

  // Calcul du nombre total de pages
  const totalPages = Math.ceil(questions.length / QUESTIONS_PER_PAGE);

  // Gestion des changements de page
  const goToNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const goToPreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  // Fetch questions from the server
  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        const response = await axios.get(`${BASE_URL}/quizzes/${quizId}`);
        const selectedQuestions = response.data.questionsSelected || [];
        setQuestions(selectedQuestions);
      } catch (err) {
        console.error('Error fetching questions:', err);
        setError('An error occurred while fetching the questions.');
      } finally {
        setLoading(false);
      }
    };

    fetchQuestions();
  }, [quizId]);

  // Function to handle going back to the previous page
  const handleGoBack = () => {
    navigate(-1);
  };

  // Handle question selection
  const handleQuestionSelect = (questionId) => {
    setSelectedQuestions((prev) =>
      prev.includes(questionId) ? prev.filter((id) => id !== questionId) : [...prev, questionId]
    );
  };

  // Delete selected questions
  const handleDeleteQuestions = async () => {
    try {
      // Confirm deletion
      const confirmDelete = window.confirm(
        `Are you sure you want to delete ${selectedQuestions.length} selected questions?`
      );

      if (!confirmDelete) return;

      // Remove selected questions from the quiz
      const updatedQuestions = questions.filter(
        (question) => !selectedQuestions.includes(question.id)
      );

      // Update the quiz in the backend
      await axios.patch(`${BASE_URL}/quizzes/${quizId}`, {
        questionsSelected: updatedQuestions,
      });

      // Update local state
      setQuestions(updatedQuestions);
      setSelectedQuestions([]); // Clear selected questions
    } catch (err) {
      console.error('Error deleting questions:', err);
      alert('Failed to delete questions');
    }
  };

  // Loading and error states
  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <>
      <div className="container mx-auto p-4">
        <h1 className="text-3xl font-bold text-center mb-2">Quiz Questions</h1>
        <div>
          <QuizHeader />
        </div>

        {selectedQuestions.length > 0 && (
          <button onClick={handleDeleteQuestions} className="btn btn-error flex items-center">
            <Trash2 className="mr-2" />
            Delete {selectedQuestions.length} Questions
          </button>
        )}
      </div>
      <hr />
      <div className="overflow-x-auto">
        <div>
          <table className="table table-zebra w-full">
            <thead>
              <tr>
                <th>
                  <label>
                    <input
                      type="checkbox"
                      className="checkbox"
                      checked={selectedQuestions.length === questions.length}
                      onChange={() => {
                        // Toggle all questions
                        setSelectedQuestions((prev) =>
                          prev.length === questions.length ? [] : questions.map((q) => q.id)
                        );
                      }}
                    />
                  </label>
                </th>
                <th>Question</th>
                <th>Options</th>
                <th>Correct Answer</th>
              </tr>
            </thead>
            <tbody>
              {currentQuestions.map((question) => (
                <tr key={question.id}>
                  <td>
                    <label>
                      <input
                        type="checkbox"
                        className="checkbox"
                        checked={selectedQuestions.includes(question.id)}
                        onChange={() => handleQuestionSelect(question.id)}
                      />
                    </label>
                  </td>
                  <td className="hover px-6 py-4">{question.question}</td>
                  <td className="hover px-6 py-4">
                    <ul>
                      {question.answers.map((answer) => (
                        <li key={`answer-${question.id}-${answer}`}>{answer}</li> // Use answer text to ensure uniqueness
                      ))}
                    </ul>
                  </td>
                  <td className="hover px-6 py-4 text-green-600">{question.correctAnswer}</td>
                </tr>
              ))}
            </tbody>
          </table>
          {/* Contrôles de pagination */}
          <div className="flex items-center justify-center mt-4 space-x-2">
            <button
              onClick={goToPreviousPage}
              disabled={currentPage === 1}
              className="btn btn-primary"
            >
              <span className="sr-only">Previous</span>
              <ChevronLeft className="h-5 w-5" aria-hidden="true" />
            </button>

            <span className="text-center">
              Page {currentPage} sur {totalPages}
            </span>

            <button
              onClick={goToNextPage}
              disabled={currentPage === totalPages}
              className="btn btn-primary"
            >
              <span className="sr-only">Next</span>
              <ChevronRight className="h-5 w-5" aria-hidden="true" />
            </button>
          </div>
          <div className="mt-4">
            <button onClick={handleGoBack} className="btn btn-outline btn-primary">
              <ArrowLeft className="w-4 h-4" />
              Back
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
