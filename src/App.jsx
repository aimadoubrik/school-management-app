import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Dashboard from './pages/Dashboard';
import QuizList from './components/Quiz/QuizList';
import QuizPage from './components/Quiz/QuizPage';

function App() {
  return (
    <div className="app">
      <Router>
        <Routes>
          <Route path="/quizlist" element={<QuizList />} />
          <Route path="/quiz/:id" element={<QuizPage />} />
        </Routes>
      </Router>
    </div>
  );
}

export default App;
