import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import QuizList from './components/Quiz/QuizList';
import QuizPage from './components/Quiz/QuizPage';
import { useSelector } from 'react-redux';
import { useEffect } from 'react';
import Layout from './layout/Layout';
import { Home, NotFound, Courses } from './pages';

function App() {
  const { theme } = useSelector((state) => state.theme);

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/school-management-app/quizlist" element={<QuizList />} />
          <Route path="/school-management-app/quiz/:id" element={<QuizPage />} />
          <Route path="/school-management-app/" element={<Home />} />
          <Route path="/school-management-app/home" element={<Home />} />
          <Route path="/school-management-app/courses" element={<Courses />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Layout>
    </Router>
  );
}

export default App;
