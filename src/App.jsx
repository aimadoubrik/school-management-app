import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { useEffect } from 'react';
import Layout from './layout/Layout';
import { Home, NotFound, Courses, Quizzes, Filieres, Quiz } from './pages';
import Document from './pages/Documents/Document';

function App() {
  const { theme } = useSelector((state) => state.theme);

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/school-management-app/quizzes" element={<Quizzes />} />
          <Route path="/school-management-app/quiz/:id" element={<Quiz />} />
          <Route path="/school-management-app/" element={<Home />} />
          <Route path="/school-management-app/home" element={<Home />} />
          <Route path="/school-management-app/courses" element={<Courses />} />
          <Route path="/school-management-app/documents" element={<Document />} />
          <Route path="/school-management-app/spicialisations" element={<Filieres />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Layout>
    </Router>
  );
}

export default App;
