import { Link, useLocation } from 'react-router-dom';
import './Sidebar.css';

const Sidebar = () => {
  const location = useLocation();

  return (
    <div className="sidebar">
      <Link to="/thetomatotrade/post" className="plus-btn">
        <i className="fas fa-plus"></i>
      </Link>
      
      <nav className="menu">
        <Link to="/thetomatotrade/home" className={`menu-item ${location.pathname === '/thetomatotrade/home' ? 'active' : ''}`}>
          <i className="fas fa-home"></i>
          <span>Home</span>
        </Link>
        
        <Link to="/thetomatotrade/browse" className={`menu-item ${location.pathname === '/thetomatotrade/browse' ? 'active' : ''}`}>
          <i className="fas fa-search"></i>
          <span>Browse</span>
        </Link>
        
        <Link to="/thetomatotrade/messages" className={`menu-item ${location.pathname === '/thetomatotrade/messages' ? 'active' : ''}`}>
          <i className="fas fa-comments"></i>
          <span>Messages</span>
        </Link>
        
        <Link to="/thetomatotrade/profile" className={`menu-item ${location.pathname === '/thetomatotrade/profile' ? 'active' : ''}`}>
          <i className="fas fa-user"></i>
          <span>Profile</span>
        </Link>
      </nav>
    </div>
  );
};

export default Sidebar; 