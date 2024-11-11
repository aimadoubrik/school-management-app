import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { useEffect } from 'react';
import Layout from './layout/Layout';
import Home from './pages/Home';
import Courses from './pages/Courses';
import NotFound from './pages/NotFound';
import Filieres from './pages/Filieres';

function App() {
  const theme = useSelector((state) => state.theme);

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme.theme);
  }, [theme]);

  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/home" element={<Home />} />
          <Route path="/courses" element={<Courses />} />
          <Route path="/spicialisations" element={<Filieres />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Layout>
    </Router>
  );
}

export default App;
