import React, { useState, useEffect, useRef } from 'react';
import { Box, TextField, Button, Paper, Typography, Container } from '@mui/material';
import SendIcon from '@mui/icons-material/Send';
import axios from 'axios';

const ChatInterface = ({ user }) => {
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState('');
    const [conversationId, setConversationId] = useState(null);
    const messagesEndRef = useRef(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        // Create a new conversation when component mounts
        const createConversation = async () => {
            try {
                const response = await axios.post('http://localhost:3000/conversations', {
                    userId: user.id,
                    title: 'New Chat'
                });
                setConversationId(response.data.conversationId);
            } catch (error) {
                console.error('Error creating conversation:', error);
            }
        };
        createConversation();
    }, [user.id]);

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const handleSendMessage = async (e) => {
        e.preventDefault();
        if (!newMessage.trim()) return;

        try {
            // Add user message to chat
            setMessages(prev => [...prev, { content: newMessage, isBot: false }]);
            setNewMessage('');

            // Send message to backend
            const response = await axios.post('http://localhost:3000/messages', {
                conversationId,
                userId: user.id,
                content: newMessage
            });

            // Add bot response to chat
            setMessages(prev => [...prev, { content: response.data.response, isBot: true }]);
        } catch (error) {
            console.error('Error sending message:', error);
            alert('Failed to send message');
        }
    };

    return (
        <Container maxWidth="md">
            <Paper elevation={3} sx={{ height: '80vh', display: 'flex', flexDirection: 'column', p: 2 }}>
                {/* Chat Messages */}
                <Box sx={{ flexGrow: 1, overflow: 'auto', mb: 2 }}>
                    {messages.map((message, index) => (
                        <Box
                            key={index}
                            sx={{
                                display: 'flex',
                                justifyContent: message.isBot ? 'flex-start' : 'flex-end',
                                mb: 2
                            }}
                        >
                            <Paper
                                sx={{
                                    p: 2,
                                    backgroundColor: message.isBot ? '#f5f5f5' : '#e3f2fd',
                                    maxWidth: '70%'
                                }}
                            >
                                <Typography>{message.content}</Typography>
                            </Paper>
                        </Box>
                    ))}
                    <div ref={messagesEndRef} />
                </Box>

                {/* Message Input */}
                <Box component="form" onSubmit={handleSendMessage} sx={{ display: 'flex', gap: 1 }}>
                    <TextField
                        fullWidth
                        variant="outlined"
                        placeholder="Type your message..."
                        value={newMessage}
                        onChange={(e) => setNewMessage(e.target.value)}
                    />
                    <Button
                        type="submit"
                        variant="contained"
                        endIcon={<SendIcon />}
                    >
                        Send
                    </Button>
                </Box>
            </Paper>
        </Container>
    );
};

export default ChatInterface;
