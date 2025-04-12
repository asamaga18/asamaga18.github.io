import { Link } from 'react-router-dom';
import { useEffect, useState } from 'react';
import './Home.css';

const Home = () => {
  const [firstName, setFirstName] = useState<string | null>(null);

  useEffect(() => {
    const storedName = localStorage.getItem('firstName');
    if (storedName) {
      setFirstName(storedName);
    }
  }, []);

  return (
    <div className="home-container">
      <nav className="home-nav">
        <img src="/thetomatotrade/thetomatotradelogo.png" alt="The Tomato Trade Logo" width="50" height="50"/>
        <div className="nav-logo">The Tomato Trade</div>
        <div className="nav-links">
          <Link to="/browse" className="nav-link">Browse</Link>
          <Link to="/post" className="nav-link">Create Post</Link>
          <Link to="/messages" className="nav-link">Messages</Link>
          <Link to="/account" className="nav-link">Account</Link>
        </div>
      </nav>
      
      <main className="home-content">
        <section className="hero-section">
          <h1>Welcome{firstName ? `, ${firstName}` : ' to The Tomato Trade'}</h1>
          <p>Share and discover fresh produce in your community</p>
        </section>
        
        <section className="quick-actions">
          <Link to="/browse" className="action-card">
            <h3>Browse Produce</h3>
            <p>Find available produce near you</p>
          </Link>
          <Link to="/post" className="action-card">
            <h3>Share Produce</h3>
            <p>Post items you want to share</p>
          </Link>
          <Link to="/messages" className="action-card">
            <h3>Messages</h3>
            <p>Connect with other users</p>
          </Link>
        </section>
      </main>
    </div>
  );
};

export default Home;