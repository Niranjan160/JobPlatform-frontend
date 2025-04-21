import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import '../LoginForm/LoginForm.css';

const LoginForm = ({onLogin}) => {
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      // Replace with your actual login API
      const response = await axios.post('http://localhost:8080/api/users/login', {
        email,
        password,
      });

      const userData = response.data;
      console.log('Login success:', userData);
      console.log("login response data:", response.data);

      // Save to localStorage
      localStorage.setItem('userId', response.data.id);

      onLogin()
      navigate('/home');

      const userId = localStorage.getItem('userId');
      console.log("Fetched userId from localStorage:", userId);
      // Notify parent (App.js) and navigate to home
      // navigate('/home');
    } catch (error) {
      console.error('Login failed:', error);
      setErrorMsg('Invalid credentials. Please try again.');
    }
  };

  return (
    <div className="login-container">
      <form className="login-form" onSubmit={handleSubmit}>
        <h2>Login</h2>
        {errorMsg && <p className="error">{errorMsg}</p>}
        <label>Email:</label>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        <label>Password:</label>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        <button type="submit">Login</button>
        <p>
          Don’t have an account? <a href="/register">Register</a>
        </p>
      </form>
    </div>
  );
};

export default LoginForm;
