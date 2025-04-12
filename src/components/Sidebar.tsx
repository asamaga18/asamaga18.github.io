import { Link, useLocation } from 'react-router-dom';
import './Sidebar.css';

const Sidebar = () => {
  const location = useLocation();

  return (
    <div className="sidebar">
      <Link to="/post" className="plus-btn">
        <i className="fas fa-plus"></i>
      </Link>
      
      <nav className="menu">
        <Link to="/home" className={`menu-item ${location.pathname === '/home' ? 'active' : ''}`}>
          <i className="fas fa-home"></i>
          <span>Home</span>
        </Link>
        
        <Link to="/browse" className={`menu-item ${location.pathname === '/browse' ? 'active' : ''}`}>
          <i className="fas fa-search"></i>
          <span>Browse</span>
        </Link>
        
        <Link to="/messages" className={`menu-item ${location.pathname === '/messages' ? 'active' : ''}`}>
          <i className="fas fa-comments"></i>
          <span>Messages</span>
        </Link>
        
        <Link to="/profile" className={`menu-item ${location.pathname === '/profile' ? 'active' : ''}`}>
          <i className="fas fa-user"></i>
          <span>Profile</span>
        </Link>
      </nav>
    </div>
  );
};

export default Sidebar; 