import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchQuizzes } from "../../features/Quiz/quizzesSlice";
import QuizCard from "./QuizCard"; // Import the QuizCard component

const QuizList = () => {
  const dispatch = useDispatch();
  const quizdata = useSelector((state) => state.quizzes.quizzes);
  const status = useSelector((state) => state.quizzes.status);
  const error = useSelector((state) => state.quizzes.error);

  // Fetch quizzes on component mount
  useEffect(() => {
    if (status === "idle") {
      dispatch(fetchQuizzes());
    }
  }, [dispatch, status]);

  let content;

  if (status === "loading") {
    content = <span className="loading loading-infinity loading-lg"></span>;
  } else if (status === "failed") {
    content = (
      <div role="alert" className="alert alert-error ">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-6 w-6 shrink-0 stroke-current"
          fill="none"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
        <span>Error! {error}.</span>
      </div>
    );
  } else if (status === "succeeded") {
    content = (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
        {quizdata.map((quiz) => (
          <QuizCard key={quiz.quizID} quiz={quiz} />
        ))}
      </div>
    );
  }

  return (
    <div className="bg-base-300 p-8 rounded-lg shadow-lg space-y-8">
      {/* Title */}
      <h2 className="text-3xl font-semibold text-center mb-6">Available Quizzes</h2>

      {/* Quiz Content */}
      {content}
    </div>
  );
};

export default QuizList;
