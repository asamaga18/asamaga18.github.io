import { Link } from 'react-router-dom';
import './Home.css';

const Home = () => {
  return (
    <div className="home-container">
      <nav className="home-nav">
        <div className="nav-logo">The Tomato Trade</div>
        <div className="nav-links">
          <Link to="/browse" className="nav-link">Browse</Link>
          <Link to="/post" className="nav-link">Create Post</Link>
          <Link to="/messages" className="nav-link">Messages</Link>
        </div>
      </nav>
      
      <main className="home-content">
        <section className="hero-section">
          <h1>Welcome to The Tomato Trade</h1>
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