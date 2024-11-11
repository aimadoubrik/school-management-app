import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Dashboard from './pages/Dashboard';
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
          <Route path="/quizlist" element={<QuizList />} />
          <Route path="/quiz/:id" element={<QuizPage />} />
          <Route path="/" element={<Home />} />
          <Route path="/home" element={<Home />} />
          <Route path="/courses" element={<Courses />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Layout>
    </Router>
  );
}

export default App;
