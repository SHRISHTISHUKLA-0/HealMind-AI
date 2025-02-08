import React, { useState } from 'react';
import axios from 'axios';

const Chat = ({ user, token }) => {
    const [messages, setMessages] = useState([]);
    const [input, setInput] = useState('');

    const handleSendMessage = async () => {
        if (input.trim()) {
            const newMessage = { sender: 'user', text: input };
            setMessages([...messages, newMessage]);

            try {
                const res = await axios.post('http://localhost:5000/api/chat/message', {
                    userId: user._id,
                    message: input
                }, {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });

                const botMessage = { sender: 'bot', text: res.data.message };
                setMessages([...messages, newMessage, botMessage]);
            } catch (error) {
                console.error('Error sending message: ', error);
            }

            setInput('');
        }
    };

    return (
        <div>
            <h2>Welcome, {user.name}</h2>
            <div>
                {messages.map((msg, index) => (
                    <div key={index} className={msg.sender === 'user' ? 'user-message' : 'bot-message'}>
                        {msg.text}
                    </div>
                ))}
            </div>
            <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Type a message"
            />
            <button onClick={handleSendMessage}>Send</button>
        </div>
    );
};

export default Chat;