import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './RegistrationForm.css'; // Optional CSS for styling

const RegistrationForm = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    mobileNo: '',
    password: '',
    confirmPassword: '',
    dob: '',
    address: '',
  });

  const [message, setMessage] = useState('');
  const [isError, setIsError] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      setMessage("❌ Passwords do not match!");
      setIsError(true);
      return;
    }

    try {
      const response = await axios.post('http://localhost:8080/api/users/register', {
        name: formData.name,
        email: formData.email,
        password: formData.password,
        mobileNo: formData.mobileNo,
        dob: formData.dob,
        address: formData.address,
      });

      if (response.status === 200) {
        setMessage("✅ Registered successfully! Redirecting...");
        setIsError(false);

        setTimeout(() => {
          navigate('/login');
        }, 1500);
      } else {
        setMessage("❌ Registration failed!");
        setIsError(true);
      }
    } catch (error) {
      console.error("Registration error:", error);
      setMessage("❌ Error during registration.");
      setIsError(true);
    }
  };

  return (
    <div className="registration-container">
      <h2>User Registration</h2>
      {message && (
        <p style={{ color: isError ? 'red' : 'green' }}>{message}</p>
      )}

      <form onSubmit={handleSubmit}>
        <input type="text" name="name" placeholder="Name" value={formData.name} onChange={handleChange} required />
        <input type="email" name="email" placeholder="Email" value={formData.email} onChange={handleChange} required />
        <input type="text" name="mobileNo" placeholder="Mobile Number" value={formData.mobileNo} onChange={handleChange} required />
        <input type="date" name="dob" value={formData.dob} onChange={handleChange} required />
        <textarea name="address" placeholder="Address" value={formData.address} onChange={handleChange} required />
        <input type="password" name="password" placeholder="Password" value={formData.password} onChange={handleChange} required />
        <input type="password" name="confirmPassword" placeholder="Confirm Password" value={formData.confirmPassword} onChange={handleChange} required />
        <button type="submit">Register</button>
      </form>

      <p>Already have an account? <a href="/login">Login</a></p>
    </div>
  );
};

export default RegistrationForm;
