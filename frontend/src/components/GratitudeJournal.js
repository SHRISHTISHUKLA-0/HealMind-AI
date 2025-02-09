import React, { useState, useEffect } from 'react';
import { 
    Box, 
    Paper, 
    Typography, 
    TextField, 
    Button, 
    List, 
    ListItem, 
    ListItemText,
    IconButton,
    Fade,
    Card,
    CardContent
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import FavoriteIcon from '@mui/icons-material/Favorite';

const GratitudeJournal = () => {
    const [entry, setEntry] = useState('');
    const [entries, setEntries] = useState(() => {
        const saved = localStorage.getItem('gratitudeEntries');
        return saved ? JSON.parse(saved) : [];
    });
    const [showPrompt, setShowPrompt] = useState(true);

    const prompts = [
        "What made you smile today?",
        "Name three things you're thankful for right now.",
        "What's something beautiful you saw today?",
        "Who made a positive impact on your day?",
        "What's a small win you're grateful for?",
        "What's something you're looking forward to?",
        "What's a challenge you're grateful for?",
        "What's something about yourself you're thankful for?"
    ];

    const [currentPrompt, setCurrentPrompt] = useState(prompts[0]);

    useEffect(() => {
        localStorage.setItem('gratitudeEntries', JSON.stringify(entries));
    }, [entries]);

    const handleSubmit = (e) => {
        e.preventDefault();
        if (entry.trim()) {
            const newEntry = {
                id: Date.now(),
                text: entry,
                date: new Date().toLocaleDateString(),
                prompt: currentPrompt,
                likes: 0
            };
            setEntries([newEntry, ...entries]);
            setEntry('');
            setCurrentPrompt(prompts[Math.floor(Math.random() * prompts.length)]);
        }
    };

    const handleDelete = (id) => {
        setEntries(entries.filter(entry => entry.id !== id));
    };

    const handleLike = (id) => {
        setEntries(entries.map(entry => 
            entry.id === id ? { ...entry, likes: entry.likes + 1 } : entry
        ));
    };

    return (
        <Paper elevation={3} sx={{ p: 3, mb: 3 }}>
            <Typography variant="h5" gutterBottom align="center" color="primary">
                Gratitude Journal
            </Typography>

            <Box component="form" onSubmit={handleSubmit} sx={{ mb: 4 }}>
                <Card sx={{ mb: 3, bgcolor: 'primary.light', color: 'white' }}>
                    <CardContent>
                        <Typography variant="h6" gutterBottom>
                            Today's Prompt:
                        </Typography>
                        <Typography variant="body1">
                            {currentPrompt}
                        </Typography>
                    </CardContent>
                </Card>

                <TextField
                    fullWidth
                    multiline
                    rows={4}
                    variant="outlined"
                    placeholder="What are you grateful for today?"
                    value={entry}
                    onChange={(e) => setEntry(e.target.value)}
                    sx={{ mb: 2 }}
                />
                <Button 
                    type="submit" 
                    variant="contained" 
                    color="primary" 
                    fullWidth
                    sx={{ mb: 3 }}
                >
                    Save Entry
                </Button>
            </Box>

            <Typography variant="h6" gutterBottom>
                Your Gratitude Journey
            </Typography>
            
            <List>
                {entries.map((entry) => (
                    <Fade in key={entry.id}>
                        <ListItem
                            alignItems="flex-start"
                            sx={{
                                mb: 2,
                                bgcolor: 'background.paper',
                                borderRadius: 1,
                                boxShadow: 1
                            }}
                        >
                            <ListItemText
                                primary={
                                    <Typography variant="subtitle2" color="text.secondary">
                                        {entry.date} - Prompt: {entry.prompt}
                                    </Typography>
                                }
                                secondary={
                                    <Typography
                                        sx={{ display: 'inline' }}
                                        component="span"
                                        variant="body1"
                                        color="text.primary"
                                    >
                                        {entry.text}
                                    </Typography>
                                }
                            />
                            <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                <IconButton 
                                    onClick={() => handleLike(entry.id)}
                                    color={entry.likes > 0 ? 'secondary' : 'default'}
                                >
                                    <FavoriteIcon />
                                </IconButton>
                                <Typography variant="body2" sx={{ mr: 2 }}>
                                    {entry.likes}
                                </Typography>
                                <IconButton onClick={() => handleDelete(entry.id)} color="error">
                                    <DeleteIcon />
                                </IconButton>
                            </Box>
                        </ListItem>
                    </Fade>
                ))}
            </List>
        </Paper>
    );
};

export default GratitudeJournal;
