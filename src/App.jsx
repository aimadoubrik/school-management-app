import { BrowserRouter as Router } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { useEffect } from 'react';
import RouteConfig from './routes/RouteConfig';

function App() {
  const { theme } = useSelector((state) => state.theme);

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  return (
    <Router>
      <RouteConfig />
    </Router>
  );
}

export default App;
