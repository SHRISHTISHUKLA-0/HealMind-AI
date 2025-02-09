import React, { useState, useEffect } from 'react';
import { 
    Box, 
    Paper, 
    Typography, 
    Button, 
    Card, 
    CardContent,
    IconButton,
    Fade,
    Grid
} from '@mui/material';
import FavoriteIcon from '@mui/icons-material/Favorite';
import ShuffleIcon from '@mui/icons-material/Shuffle';
import VolumeUpIcon from '@mui/icons-material/VolumeUp';

const affirmations = [
    "I am worthy of love, respect, and happiness",
    "I trust in my ability to make good decisions",
    "I am getting stronger every day",
    "I have the power to create change",
    "I am in charge of my own happiness",
    "I am learning and growing every day",
    "I radiate positive energy and attract positive people",
    "I am grateful for everything I have",
    "I choose to be confident",
    "I am capable of achieving great things",
    "My potential is limitless",
    "I deserve all the good things life has to offer",
    "I am surrounded by love and support",
    "My mind is full of brilliant ideas",
    "I am at peace with who I am",
    "I choose to be happy",
    "I am resilient and can overcome any challenge",
    "I believe in myself and my abilities",
    "I attract abundance and prosperity",
    "I am enough, just as I am"
];

const PositiveAffirmations = () => {
    const [currentAffirmation, setCurrentAffirmation] = useState(affirmations[0]);
    const [favorites, setFavorites] = useState(() => {
        const saved = localStorage.getItem('favoriteAffirmations');
        return saved ? JSON.parse(saved) : [];
    });
    const [showFavorites, setShowFavorites] = useState(false);

    useEffect(() => {
        localStorage.setItem('favoriteAffirmations', JSON.stringify(favorites));
    }, [favorites]);

    const getRandomAffirmation = () => {
        const newAffirmation = affirmations[Math.floor(Math.random() * affirmations.length)];
        setCurrentAffirmation(newAffirmation);
    };

    const toggleFavorite = (affirmation) => {
        if (favorites.includes(affirmation)) {
            setFavorites(favorites.filter(fav => fav !== affirmation));
        } else {
            setFavorites([...favorites, affirmation]);
        }
    };

    const speakAffirmation = (text) => {
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.rate = 0.9;
        utterance.pitch = 1;
        window.speechSynthesis.speak(utterance);
    };

    return (
        <Paper elevation={3} sx={{ p: 3, mb: 3 }}>
            <Typography variant="h5" gutterBottom align="center" color="primary">
                Daily Affirmations
            </Typography>

            <Card 
                sx={{ 
                    mb: 3, 
                    bgcolor: 'primary.light', 
                    color: 'white',
                    minHeight: 200,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    position: 'relative'
                }}
            >
                <CardContent>
                    <Fade in key={currentAffirmation}>
                        <Typography variant="h6" align="center" paragraph>
                            {currentAffirmation}
                        </Typography>
                    </Fade>
                    <Box sx={{ 
                        display: 'flex', 
                        justifyContent: 'center', 
                        gap: 2,
                        position: 'absolute',
                        bottom: 16,
                        left: 0,
                        right: 0
                    }}>
                        <IconButton 
                            onClick={() => toggleFavorite(currentAffirmation)}
                            sx={{ color: favorites.includes(currentAffirmation) ? 'secondary.light' : 'white' }}
                        >
                            <FavoriteIcon />
                        </IconButton>
                        <IconButton 
                            onClick={() => speakAffirmation(currentAffirmation)}
                            sx={{ color: 'white' }}
                        >
                            <VolumeUpIcon />
                        </IconButton>
                        <IconButton 
                            onClick={getRandomAffirmation}
                            sx={{ color: 'white' }}
                        >
                            <ShuffleIcon />
                        </IconButton>
                    </Box>
                </CardContent>
            </Card>

            <Box sx={{ mb: 3 }}>
                <Button 
                    variant="outlined" 
                    onClick={() => setShowFavorites(!showFavorites)}
                    fullWidth
                >
                    {showFavorites ? 'Hide Favorites' : 'Show Favorites'}
                </Button>
            </Box>

            {showFavorites && (
                <Grid container spacing={2}>
                    {favorites.map((affirmation, index) => (
                        <Grid item xs={12} key={index}>
                            <Card sx={{ bgcolor: 'grey.100' }}>
                                <CardContent>
                                    <Typography variant="body1">
                                        {affirmation}
                                    </Typography>
                                    <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 1 }}>
                                        <IconButton 
                                            onClick={() => speakAffirmation(affirmation)}
                                            size="small"
                                        >
                                            <VolumeUpIcon />
                                        </IconButton>
                                        <IconButton 
                                            onClick={() => toggleFavorite(affirmation)}
                                            size="small"
                                            color="secondary"
                                        >
                                            <FavoriteIcon />
                                        </IconButton>
                                    </Box>
                                </CardContent>
                            </Card>
                        </Grid>
                    ))}
                </Grid>
            )}
        </Paper>
    );
};

export default PositiveAffirmations;
