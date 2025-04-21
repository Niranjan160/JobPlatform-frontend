// src/App.js
import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import RegistrationForm from './components/RegistrationForm/RegistrationForm';
import LoginForm from './components/LoginForm/LoginForm';
import Home from './pages/Home';
import Profile from './components/Profile/Profile';
import PostJob from './pages/PostJob';
import BottomNav from './components/BottomNav';
import Welcome from './pages/Welcome';
import Messages from './pages/Messages';
import ChatPage from './pages/ChatPage';

// Wrapper to access location inside Router
const AppRoutes = ({ isAuthenticated, setIsAuthenticated }) => {
  const location = useLocation();

  // Only show BottomNav on these routes (when logged in)
  const showBottomNavPaths = ['/home', '/profile', '/postjob', '/messages', '/chat'];
  const shouldShowBottomNav = isAuthenticated && showBottomNavPaths.some(path => location.pathname.startsWith(path));

  return (
    <>
      <Routes>
        <Route path="/" element={<Welcome />} />
        <Route path="/register" element={<RegistrationForm />} />
        <Route path="/login" element={<LoginForm onLogin={() => setIsAuthenticated(true)} />} />

        <Route path="/home" element={isAuthenticated ? <Home /> : <Navigate to="/login" replace />} />
        <Route path="/profile" element={isAuthenticated ? <Profile /> : <Navigate to="/login" replace />} />
        <Route path="/postjob" element={isAuthenticated ? <PostJob /> : <Navigate to="/login" replace />} />
        <Route path="/messages" element={isAuthenticated ? <Messages /> : <Navigate to="/login" replace />} />
        <Route path="/chat/:userId" element={isAuthenticated ? <ChatPage /> : <Navigate to="/login" replace />} />

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>

      {shouldShowBottomNav && <BottomNav />}
    </>
  );
};

const App = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(!!localStorage.getItem('userId'));

  return (
    <Router>
      <AppRoutes isAuthenticated={isAuthenticated} setIsAuthenticated={setIsAuthenticated} />
    </Router>
  );
};

export default App;
