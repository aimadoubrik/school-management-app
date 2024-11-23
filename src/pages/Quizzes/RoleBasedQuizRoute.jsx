import { Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import QuizzesPage from './QuizzesPage';
import TeacherQuizzes from './TeacherQuizzes';

const RoleBasedQuizRoute = () => {
  const user = JSON.parse(localStorage.getItem('user') || sessionStorage.getItem('user') || '{}');
  const userRole = user?.role;

  // Show TeacherQuizzes for trainers
  if (userRole === 'trainer') {
    return <TeacherQuizzes />;
  }

  // Show QuizzesPage for trainees and admins
  if (userRole === 'trainee') {
    return <QuizzesPage />;
  }

  // Fallback to unauthorized if role doesn't match
  return <Navigate to="/unauthorized" replace />;
};

export default RoleBasedQuizRoute;
