import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchQuizzes } from '../../features/quizzes/quizzesSlice';
import QuizCard from './QuizCard';
import { AlertCircle } from 'lucide-react';

const QuizList = () => {
  const dispatch = useDispatch();
  const quizdata = useSelector((state) => state.quizzes.quizzes);
  const status = useSelector((state) => state.quizzes.status);
  const error = useSelector((state) => state.quizzes.error);

  // Fetch quizzes on component mount
  useEffect(() => {
    if (status === 'idle') {
      dispatch(fetchQuizzes());
    }
  }, [dispatch, status]);

  let content;

  if (status === 'loading') {
    content = <span className="loading loading-infinity loading-lg"></span>;
  } else if (status === 'failed') {
    content = (
      <div role="alert" className="alert alert-error ">
        <AlertCircle className="w-6 h-6" />
        <span>Error! {error}.</span>
      </div>
    );
  } else if (status === 'succeeded') {
    content = (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
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
