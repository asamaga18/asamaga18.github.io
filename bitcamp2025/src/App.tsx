import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import Browse from './Browse/Browse';
import './App.css';

function LandingPage() {
  return (
    <div className="landing-page">
      <h1>Welcome to Gardening App</h1>
      <div className="auth-buttons">
        <Link to="/login" className="auth-button">Log In</Link>
        <Link to="/signup" className="auth-button">Sign Up</Link>
        <Link to="/home" className="auth-button">Skip</Link>
      </div>
    </div>
  );
}

function HomePage() {
  return (
    <div className="home">
      <h1>Gardening App</h1>
      <div className="nav-buttons">
        <Link to="/post" className="nav-button">Go to Post</Link>
        <Link to="/browse" className="nav-button">Go to Browse</Link>
      </div>
    </div>
  );
}

function App() {
  return (
    <Router>
      <div className="app">
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/home" element={<HomePage />} />
          <Route path="/browse" element={<Browse />} />
          <Route path="/login" element={<div>Login Page (Coming Soon)</div>} />
          <Route path="/signup" element={<div>Signup Page (Coming Soon)</div>} />
          <Route path="/post" element={<div>Post Page (Coming Soon)</div>} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
