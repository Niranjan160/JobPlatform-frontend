import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { FaHome, FaUser, FaPlusCircle } from 'react-icons/fa';
import './BottomNav.css';

const BottomNav = () => {
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <div className="bottom-nav">
      <button
        className={`nav-icon ${location.pathname === '/postjob' ? 'active' : ''}`}
        onClick={() => navigate('/postjob')}
      >
        <FaPlusCircle />
      </button>

      <button
        className={`nav-icon ${location.pathname === '/home' ? 'active' : ''}`}
        onClick={() => navigate('/home')}
      >
        <FaHome />
      </button>

      <button
        className={`nav-icon ${location.pathname === '/profile' ? 'active' : ''}`}
        onClick={() => navigate('/profile')}
      >
        <FaUser />
      </button>
    
    </div>
  );
};

export default BottomNav;
