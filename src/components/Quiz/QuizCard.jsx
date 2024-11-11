import React from "react";
import { Link } from "react-router-dom";
import { List, Clock, PlayCircle } from "lucide-react";

// Function to calculate the time difference and return a badge text
const getTimeLeftBadge = (deadline) => {
  const deadlineDate = new Date(deadline);
  const now = new Date();
  const timeDiff = deadlineDate - now;

  if (timeDiff <= 0) {
    return { text: "Expired", color: "badge-error" };
  }

  const days = Math.floor(timeDiff / (1000 * 60 * 60 * 24));
  const hours = Math.floor((timeDiff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));

  if (days > 0) {
    return { text: `${days} day${days > 1 ? 's' : ''} left`, color: "badge-neutral" };
  }
  if (hours > 0) {
    return { text: `${hours} hour${hours > 1 ? 's' : ''} left`, color: "badge-warning" };
  }
  return { text: "Less than an hour", color: "badge-secondary" };
};

const QuizCard = ({ quiz }) => {
  const { text, color } = getTimeLeftBadge(quiz.Deadline); // Get time left badge
  return (
    <div
      key={quiz.id}
      className="card bg-base-200 shadow-xl hover:shadow-2xl transition-all duration-300 ease-in-out transform hover:scale-105"
    >
      {/* Card Body */}
      <div className="card-body">
        <h3 className="text-xl font-semibold">{quiz.courseName}</h3>

        {/* Time Left Badge */}
        <div className={`badge ${color} mb-4`}>{text}</div>

        {/* Course and Teacher Info */}
        <div className="text-gray-500 mb-4">
          <p><strong>Instructor:</strong> {quiz.teacherName}</p>
          <p><strong>Course ID:</strong> {quiz.courseId}</p>
        </div>

        {/* Deadline */}
        <div className="flex items-center space-x-2 mb-4 text-gray-500">
          <Clock size={18} />
          <span>Deadline: {new Date(quiz.Deadline).toLocaleString()}</span>
        </div>

        {/* Start Quiz Button */}
        <div className="flex justify-center">
          <Link
            to={`/quiz/${quiz.id}`}
            className="btn btn-neutral w-full text-white"
          >
            <PlayCircle size={18} className="mr-2 inline-block" />
            Start Quiz
          </Link>
        </div>
      </div>
    </div>
  );
};

export default QuizCard;
