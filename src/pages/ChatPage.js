import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import './ChatPage.css';

const ChatPage = () => {
  const { userId } = useParams(); // selected user's ID from URL
  const senderId = parseInt(localStorage.getItem('userId'));
  const [receiver, setReceiver] = useState(null);
  const [messages, setMessages] = useState([]);
  const [messageContent, setMessageContent] = useState('');

  // Fetch receiver user details
  useEffect(() => {
    axios.get(`http://localhost:8080/api/users/${userId}`)
      .then(res => {
        setReceiver(res.data)
        console.log("DATA ",res.data);
        
      })
      .catch(err => console.error("Error fetching user:", err));
  }, [userId]);

  // Fetch messages between sender and receiver
  useEffect(() => {
    if (receiver) {
      axios.get(`http://localhost:8080/api/messages/${senderId}/${userId}`)
        .then(res =>{{ 
          setMessages(res.data)
          console.log(res.data);
          
        }})
        .catch(err => console.error('Error fetching messages:', err));
    }
  }, [receiver, senderId, userId]);

  // Send message
  const handleSend = async (e) => {
    e.preventDefault();
    if (!messageContent.trim()) return;

    try {
      await axios.post('http://localhost:8080/api/messages/send', {
        senderId,
        receiverId: parseInt(userId),
        content: messageContent,
      });
      setMessageContent('');
      const updated = await axios.get(`http://localhost:8080/api/messages/${senderId}/${userId}`);
      setMessages(updated.data);
    } catch (err) {
      console.error('Error sending message:', err);
    }
  };

  return (
    <div className="chatpage-container">
      {receiver && <h2 className="chat-heading">Chat with {receiver.name}</h2>}

      <div className="chat-box">
        {messages.map((msg, index) => (
          <div key={index} className={msg.senderId === senderId ? 'msg-sent' : 'msg-received'}>
            {msg.content}
          </div>
        ))}
      </div>

      <form className="chat-input-form" onSubmit={handleSend}>
        <input
          type="text"
          placeholder="Type a message..."
          value={messageContent}
          onChange={(e) => setMessageContent(e.target.value)}
        />
        <button type="submit">Send</button>
      </form>
    </div>
  );
};

export default ChatPage;
