import React, { useState } from 'react';
import { Container, TextField, Button, Typography, Box, Paper } from '@mui/material';
import axios from 'axios';

const RegisterScreen = ({ onRegister }) => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [age, setAge] = useState('');

    const handleRegister = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post('http://localhost:3000/register', {
                name,
                email,
                password,
                age: parseInt(age)
            });
            
            // Pass the user data to parent component
            onRegister(response.data.user);
        } catch (error) {
            console.error('Registration failed:', error);
            alert(error.response?.data?.message || 'Registration failed!');
        }
    };

    return (
        <Container maxWidth="sm">
            <Paper elevation={3} sx={{ p: 4, mt: 8 }}>
                <Typography variant="h4" component="h1" gutterBottom align="center">
                    Register for HealMind AI
                </Typography>
                <Box component="form" onSubmit={handleRegister} sx={{ mt: 2 }}>
                    <TextField
                        fullWidth
                        label="Name"
                        margin="normal"
                        required
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                    />
                    <TextField
                        fullWidth
                        label="Email"
                        type="email"
                        margin="normal"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    />
                    <TextField
                        fullWidth
                        label="Password"
                        type="password"
                        margin="normal"
                        required
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                    <TextField
                        fullWidth
                        label="Age"
                        type="number"
                        margin="normal"
                        required
                        value={age}
                        onChange={(e) => setAge(e.target.value)}
                    />
                    <Button
                        type="submit"
                        fullWidth
                        variant="contained"
                        sx={{ mt: 3, mb: 2 }}
                    >
                        Register
                    </Button>
                </Box>
            </Paper>
        </Container>
    );
};

export default RegisterScreen;