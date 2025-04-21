// src/pages/Welcome.js
import React from 'react';
import { useNavigate } from 'react-router-dom';
import './Welcome.css';
import jobWelcome from '../assets/job_welcome.png';

const Welcome = () => {
  const navigate = useNavigate();

  const handleLogin = () => {
    navigate('/login');
  };

  return (
    <div className="welcome-container">
      <header className="welcome-header">
        <h1 className="logo">JobConnect</h1>
        <button className="login-button" onClick={handleLogin}>Login</button>
      </header>

      <main className="welcome-content">
        <div className="text-section">
          <h2>Your Gateway to Opportunities</h2>
          <p>
          JobConnect is a platform where you can find jobs,
           hire skilled workers, and connect instantly. Whether you're an individual 
           looking for quick gigs or an employer with urgent tasks, JobConnect brings
            flexibility, speed, and simplicity to your hiring journey. Post jobs, apply with ease, 
            chat in real time, and get the work done, all from one place.          </p>
        </div>

        <div className="image-section">
          <img src={jobWelcome} alt="Welcome to JobConnect" />
        </div>
      </main>
    </div>
  );
};

export default Welcome;
