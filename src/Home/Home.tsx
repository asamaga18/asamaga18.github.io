import { Link, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import './Home.css';

const Home = () => {
  const [firstName, setFirstName] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const storedName = localStorage.getItem('user_first_name');
    if (storedName) {
      setFirstName(storedName);
    }
  }, []);

  const handleLogout = () => {
    localStorage.clear(); // Clear all stored user data
    navigate('/login');   // Redirect to login screen
  };

  
  
    const goToAccount = () => {
      navigate('/account');
    };
  
    
  

  return (
    <div className="home-container">
      <nav className="home-nav">
        <div className = "nav-left">
          <img src="/thetomatotrade/thetomatotradelogo.png" alt="The Tomato Trade Logo" width="50" height="50" />
          <div className="nav-logo">The Tomato Trade</div>
        </div>
        <div className='nav-links'>
          {/* <Link to="/account" className = "nav-link">Account</Link> */}

        </div>
        <div className="button-column">
          <button onClick={goToAccount} className="logout-button">Account</button>
          <button onClick={handleLogout} className="logout-button">Log Out</button>
        </div>
        
      </nav>

      <main className="home-content">
        <section className="hero-section">
          <h1>{firstName ? `Welcome, ${firstName},` : 'Welcome'} to The Tomato Trade</h1>
          <p>Share and discover fresh produce in your community</p>
        </section>

        <section className="quick-actions">
          <Link to="/browse" className="action-card">
            <i className="fas fa-search action-icon"></i>
            <h3>Browse Produce</h3>
            <p>Find available produce near you</p>
          </Link>
          <Link to="/post" className="action-card">
            <i className="fas fa-seedling action-icon"></i>
            <h3>Share or Request Produce</h3>
            <p>Post items you want to share or request</p>
          </Link>
          <Link to="/messages" className="action-card">
            <i className="fas fa-comments action-icon"></i>
            <h3>View Your Neighborhood</h3>
            <p>Connect with other users</p>
          </Link>
        </section>
      </main>
    </div>
  );
};

export default Home;