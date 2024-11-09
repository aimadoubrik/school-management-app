import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'

function App() {
  return (
    <div className="app">
      
      <Router>
        <Routes>
          <Route path="/" element={<h1>Enhanced React App</h1>} />
        </Routes>
      </Router>
    </div>
  )
}

export default App