import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './Messages.css';

const Messages = () => {
  const [users, setUsers] = useState([]);
  const senderId = parseInt(localStorage.getItem('userId'));
  const navigate = useNavigate();

  useEffect(() => {
    axios.get(`http://localhost:8080/api/messages/${senderId}`)
      .then((res) => {
        console.log(res.data);
        const filteredUsers = res.data.filter((u) => u.userId !== senderId);
        setUsers(filteredUsers);
      })
      .catch((err) => {
        console.error("Error fetching users:", err);
      });
  }, [senderId]);

  const handleUserClick = (user) => {
    navigate(`/chat/${user.userId}`);
  };

  return (
    <div className="messages-container">
  <h2>Start a Chat</h2>
  <ul className="user-list">
    {users.map((user) => (
      <li key={user.userId} onClick={() => handleUserClick(user)}>
        <div className="user-avatar">{user.name.charAt(0)}</div>
        <span className="user-name">{user.name}</span>
      </li>
    ))}
  </ul>
</div>

  );
};

export default Messages;
