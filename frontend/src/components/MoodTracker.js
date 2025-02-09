import React, { useState, useEffect } from 'react';
import { 
    Box, 
    Paper, 
    Typography, 
    IconButton, 
    Grid, 
    Tooltip,
    Card,
    CardContent,
    TextField,
    Button
} from '@mui/material';
import SentimentVeryDissatisfiedIcon from '@mui/icons-material/SentimentVeryDissatisfied';
import SentimentDissatisfiedIcon from '@mui/icons-material/SentimentDissatisfied';
import SentimentSatisfiedIcon from '@mui/icons-material/SentimentSatisfied';
import SentimentSatisfiedAltIcon from '@mui/icons-material/SentimentSatisfiedAlt';
import SentimentVerySatisfiedIcon from '@mui/icons-material/SentimentVerySatisfied';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer, Tooltip as RechartsTooltip, Legend } from 'recharts';

const moods = [
    { icon: SentimentVeryDissatisfiedIcon, label: 'Very Sad', value: 1, color: '#ff1744' },
    { icon: SentimentDissatisfiedIcon, label: 'Sad', value: 2, color: '#ff9100' },
    { icon: SentimentSatisfiedIcon, label: 'Okay', value: 3, color: '#ffd600' },
    { icon: SentimentSatisfiedAltIcon, label: 'Happy', value: 4, color: '#00e676' },
    { icon: SentimentVerySatisfiedIcon, label: 'Very Happy', value: 5, color: '#00b0ff' }
];

const MoodTracker = () => {
    const [selectedMood, setSelectedMood] = useState(null);
    const [moodHistory, setMoodHistory] = useState(() => {
        const saved = localStorage.getItem('moodHistory');
        return saved ? JSON.parse(saved) : [];
    });
    const [note, setNote] = useState('');

    useEffect(() => {
        localStorage.setItem('moodHistory', JSON.stringify(moodHistory));
    }, [moodHistory]);

    const handleMoodSelect = (mood) => {
        setSelectedMood(mood);
    };

    const handleSaveMood = () => {
        if (selectedMood) {
            const newEntry = {
                mood: selectedMood,
                note,
                timestamp: new Date().toISOString(),
                date: new Date().toLocaleDateString()
            };
            setMoodHistory([...moodHistory, newEntry]);
            setSelectedMood(null);
            setNote('');
        }
    };

    const getChartData = () => {
        const last7Days = [...Array(7)].map((_, i) => {
            const d = new Date();
            d.setDate(d.getDate() - i);
            return d.toLocaleDateString();
        }).reverse();

        return last7Days.map(date => {
            const dayMoods = moodHistory.filter(entry => entry.date === date);
            const avgMood = dayMoods.length > 0
                ? dayMoods.reduce((sum, entry) => sum + entry.mood.value, 0) / dayMoods.length
                : 0;

            return {
                date,
                'Mood Level': avgMood,
                count: dayMoods.length
            };
        });
    };

    const getMoodDistribution = () => {
        const distribution = moods.map(mood => ({
            name: mood.label,
            count: moodHistory.filter(entry => entry.mood.value === mood.value).length,
            color: mood.color
        }));

        return distribution;
    };

    return (
        <Paper elevation={3} sx={{ p: 3, mb: 3 }}>
            <Typography variant="h5" gutterBottom align="center" color="primary">
                Mood Tracker
            </Typography>

            <Grid container spacing={2}>
                <Grid item xs={12} md={6}>
                    <Card sx={{ mb: 3 }}>
                        <CardContent>
                            <Typography variant="h6" gutterBottom>
                                How are you feeling today?
                            </Typography>
                            <Grid container spacing={2} justifyContent="center">
                                {moods.map((mood) => {
                                    const Icon = mood.icon;
                                    return (
                                        <Grid item key={mood.value}>
                                            <Tooltip title={mood.label}>
                                                <IconButton
                                                    onClick={() => handleMoodSelect(mood)}
                                                    sx={{
                                                        color: selectedMood?.value === mood.value ? mood.color : 'grey.400',
                                                        transform: selectedMood?.value === mood.value ? 'scale(1.2)' : 'scale(1)',
                                                        transition: 'all 0.2s',
                                                        '&:hover': {
                                                            color: mood.color,
                                                            transform: 'scale(1.1)',
                                                        }
                                                    }}
                                                >
                                                    <Icon fontSize="large" />
                                                </IconButton>
                                            </Tooltip>
                                        </Grid>
                                    );
                                })}
                            </Grid>

                            {selectedMood && (
                                <Box sx={{ mt: 2 }}>
                                    <TextField
                                        fullWidth
                                        multiline
                                        rows={3}
                                        placeholder="Add a note about how you're feeling..."
                                        value={note}
                                        onChange={(e) => setNote(e.target.value)}
                                        sx={{ mb: 2 }}
                                    />
                                    <Button
                                        variant="contained"
                                        fullWidth
                                        onClick={handleSaveMood}
                                    >
                                        Save Mood
                                    </Button>
                                </Box>
                            )}
                        </CardContent>
                    </Card>
                </Grid>

                <Grid item xs={12} md={6}>
                    <Card sx={{ mb: 3 }}>
                        <CardContent>
                            <Typography variant="h6" gutterBottom>
                                Your Mood Distribution
                            </Typography>
                            <Box sx={{ height: 200 }}>
                                <ResponsiveContainer width="100%" height="100%">
                                    <BarChart data={getMoodDistribution()}>
                                        <CartesianGrid strokeDasharray="3 3" />
                                        <XAxis dataKey="name" />
                                        <YAxis />
                                        <RechartsTooltip />
                                        <Bar dataKey="count" fill="#8884d8" />
                                    </BarChart>
                                </ResponsiveContainer>
                            </Box>
                        </CardContent>
                    </Card>
                </Grid>

                <Grid item xs={12}>
                    <Card>
                        <CardContent>
                            <Typography variant="h6" gutterBottom>
                                7-Day Mood Trend
                            </Typography>
                            <Box sx={{ height: 300 }}>
                                <ResponsiveContainer width="100%" height="100%">
                                    <BarChart data={getChartData()}>
                                        <CartesianGrid strokeDasharray="3 3" />
                                        <XAxis dataKey="date" />
                                        <YAxis domain={[0, 5]} />
                                        <RechartsTooltip />
                                        <Legend />
                                        <Bar dataKey="Mood Level" fill="#8884d8" />
                                    </BarChart>
                                </ResponsiveContainer>
                            </Box>
                        </CardContent>
                    </Card>
                </Grid>
            </Grid>
        </Paper>
    );
};

export default MoodTracker;
