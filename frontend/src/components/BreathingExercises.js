import React, { useState, useEffect } from 'react';
import {
    Box,
    Paper,
    Typography,
    Card,
    CardContent,
    Grid,
    IconButton,
    Button,
    Slider,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    List,
    ListItem,
    ListItemText,
    ListItemIcon,
    Chip,
    CircularProgress
} from '@mui/material';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import PauseIcon from '@mui/icons-material/Pause';
import StopIcon from '@mui/icons-material/Stop';
import AirIcon from '@mui/icons-material/Air';
import FavoriteIcon from '@mui/icons-material/Favorite';
import SettingsIcon from '@mui/icons-material/Settings';

const breathingPatterns = [
    {
        id: 1,
        name: '4-7-8 Breathing',
        description: 'Inhale for 4, hold for 7, exhale for 8',
        inhale: 4,
        hold: 7,
        exhale: 8,
        color: '#4CAF50'
    },
    {
        id: 2,
        name: 'Box Breathing',
        description: 'Equal duration for inhale, hold, exhale, and hold',
        inhale: 4,
        hold: 4,
        exhale: 4,
        holdAfterExhale: 4,
        color: '#2196F3'
    },
    {
        id: 3,
        name: 'Relaxing Breath',
        description: 'Long exhale for deep relaxation',
        inhale: 4,
        hold: 0,
        exhale: 6,
        color: '#9C27B0'
    }
];

const BreathingExercises = () => {
    const [selectedPattern, setSelectedPattern] = useState(null);
    const [isRunning, setIsRunning] = useState(false);
    const [phase, setPhase] = useState('ready'); // ready, inhale, hold, exhale, holdAfterExhale
    const [progress, setProgress] = useState(0);
    const [showCustomize, setShowCustomize] = useState(false);
    const [customPattern, setCustomPattern] = useState({
        inhale: 4,
        hold: 4,
        exhale: 4,
        holdAfterExhale: 0
    });
    const [completedCycles, setCompletedCycles] = useState(0);
    const [favorites, setFavorites] = useState(() => {
        const saved = localStorage.getItem('favoriteBreathingPatterns');
        return saved ? JSON.parse(saved) : [];
    });

    useEffect(() => {
        let timer;
        if (isRunning && selectedPattern) {
            timer = setInterval(() => {
                setProgress((prevProgress) => {
                    const newProgress = prevProgress + 1;
                    const pattern = selectedPattern;
                    
                    let totalPhaseTime;
                    switch (phase) {
                        case 'inhale':
                            totalPhaseTime = pattern.inhale;
                            if (newProgress >= totalPhaseTime * 10) {
                                setPhase(pattern.hold > 0 ? 'hold' : 'exhale');
                                return 0;
                            }
                            break;
                        case 'hold':
                            totalPhaseTime = pattern.hold;
                            if (newProgress >= totalPhaseTime * 10) {
                                setPhase('exhale');
                                return 0;
                            }
                            break;
                        case 'exhale':
                            totalPhaseTime = pattern.exhale;
                            if (newProgress >= totalPhaseTime * 10) {
                                if (pattern.holdAfterExhale > 0) {
                                    setPhase('holdAfterExhale');
                                } else {
                                    setPhase('inhale');
                                    setCompletedCycles(prev => prev + 1);
                                }
                                return 0;
                            }
                            break;
                        case 'holdAfterExhale':
                            totalPhaseTime = pattern.holdAfterExhale;
                            if (newProgress >= totalPhaseTime * 10) {
                                setPhase('inhale');
                                setCompletedCycles(prev => prev + 1);
                                return 0;
                            }
                            break;
                        default:
                            return 0;
                    }
                    return newProgress;
                });
            }, 100);
        }

        return () => clearInterval(timer);
    }, [isRunning, phase, selectedPattern]);

    useEffect(() => {
        localStorage.setItem('favoriteBreathingPatterns', JSON.stringify(favorites));
    }, [favorites]);

    const handleStart = () => {
        if (selectedPattern) {
            setIsRunning(true);
            setPhase('inhale');
            setProgress(0);
        }
    };

    const handlePause = () => {
        setIsRunning(false);
    };

    const handleStop = () => {
        setIsRunning(false);
        setPhase('ready');
        setProgress(0);
    };

    const handlePatternSelect = (pattern) => {
        setSelectedPattern(pattern);
        handleStop();
    };

    const toggleFavorite = (patternId) => {
        if (favorites.includes(patternId)) {
            setFavorites(favorites.filter(id => id !== patternId));
        } else {
            setFavorites([...favorites, patternId]);
        }
    };

    const saveCustomPattern = () => {
        const newPattern = {
            id: 'custom',
            name: 'Custom Pattern',
            description: 'Your personalized breathing pattern',
            ...customPattern,
            color: '#FF5722'
        };
        setSelectedPattern(newPattern);
        setShowCustomize(false);
    };

    const getPhaseText = () => {
        switch (phase) {
            case 'inhale':
                return 'Breathe In';
            case 'hold':
                return 'Hold';
            case 'exhale':
                return 'Breathe Out';
            case 'holdAfterExhale':
                return 'Hold';
            default:
                return 'Get Ready';
        }
    };

    const getProgressValue = () => {
        if (!selectedPattern || phase === 'ready') return 0;
        
        const pattern = selectedPattern;
        let totalPhaseTime;
        
        switch (phase) {
            case 'inhale':
                totalPhaseTime = pattern.inhale;
                break;
            case 'hold':
                totalPhaseTime = pattern.hold;
                break;
            case 'exhale':
                totalPhaseTime = pattern.exhale;
                break;
            case 'holdAfterExhale':
                totalPhaseTime = pattern.holdAfterExhale;
                break;
            default:
                return 0;
        }
        
        return (progress / (totalPhaseTime * 10)) * 100;
    };

    return (
        <Paper elevation={3} sx={{ p: 3, mb: 3 }}>
            <Typography variant="h5" gutterBottom align="center" color="primary">
                Breathing Exercises
            </Typography>

            <Grid container spacing={3}>
                <Grid item xs={12} md={6}>
                    <Card sx={{ mb: 3 }}>
                        <CardContent>
                            {selectedPattern ? (
                                <>
                                    <Typography variant="h6" gutterBottom>
                                        {selectedPattern.name}
                                    </Typography>
                                    <Typography variant="body2" color="text.secondary" paragraph>
                                        {selectedPattern.description}
                                    </Typography>
                                    
                                    <Box sx={{ position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center', my: 4 }}>
                                        <CircularProgress
                                            variant="determinate"
                                            value={getProgressValue()}
                                            size={200}
                                            thickness={2}
                                            sx={{
                                                color: selectedPattern.color,
                                                position: 'absolute'
                                            }}
                                        />
                                        <Typography
                                            variant="h4"
                                            component="div"
                                            color="primary"
                                            sx={{ position: 'absolute' }}
                                        >
                                            {getPhaseText()}
                                        </Typography>
                                    </Box>

                                    <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2, mt: 3 }}>
                                        {!isRunning ? (
                                            <IconButton
                                                onClick={handleStart}
                                                color="primary"
                                                size="large"
                                            >
                                                <PlayArrowIcon fontSize="large" />
                                            </IconButton>
                                        ) : (
                                            <IconButton
                                                onClick={handlePause}
                                                color="primary"
                                                size="large"
                                            >
                                                <PauseIcon fontSize="large" />
                                            </IconButton>
                                        )}
                                        <IconButton
                                            onClick={handleStop}
                                            color="secondary"
                                            size="large"
                                        >
                                            <StopIcon fontSize="large" />
                                        </IconButton>
                                    </Box>
                                </>
                            ) : (
                                <Typography align="center" color="text.secondary">
                                    Select a breathing pattern to begin
                                </Typography>
                            )}
                        </CardContent>
                    </Card>

                    <Grid container spacing={2}>
                        <Grid item xs={6}>
                            <Button
                                variant="outlined"
                                fullWidth
                                startIcon={<AirIcon />}
                                onClick={() => setShowCustomize(true)}
                            >
                                Customize Pattern
                            </Button>
                        </Grid>
                        <Grid item xs={6}>
                            <Button
                                variant="outlined"
                                fullWidth
                                startIcon={<SettingsIcon />}
                                onClick={() => setSelectedPattern(null)}
                            >
                                Change Pattern
                            </Button>
                        </Grid>
                    </Grid>
                </Grid>

                <Grid item xs={12} md={6}>
                    <Card>
                        <CardContent>
                            <Typography variant="h6" gutterBottom>
                                Breathing Patterns
                            </Typography>
                            <List>
                                {breathingPatterns.map((pattern) => (
                                    <ListItem
                                        key={pattern.id}
                                        button
                                        onClick={() => handlePatternSelect(pattern)}
                                        sx={{
                                            mb: 2,
                                            border: 1,
                                            borderColor: 'divider',
                                            borderRadius: 1,
                                        }}
                                    >
                                        <ListItemIcon>
                                            <AirIcon sx={{ color: pattern.color }} />
                                        </ListItemIcon>
                                        <ListItemText
                                            primary={pattern.name}
                                            secondary={
                                                <>
                                                    {pattern.description}
                                                    <br />
                                                    <Chip
                                                        size="small"
                                                        icon={<AirIcon />}
                                                        label={`${pattern.inhale}-${pattern.hold}-${pattern.exhale}`}
                                                        sx={{ mt: 1 }}
                                                    />
                                                </>
                                            }
                                        />
                                        <IconButton
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                toggleFavorite(pattern.id);
                                            }}
                                            color={favorites.includes(pattern.id) ? "primary" : "default"}
                                        >
                                            <FavoriteIcon />
                                        </IconButton>
                                    </ListItem>
                                ))}
                            </List>
                        </CardContent>
                    </Card>
                </Grid>
            </Grid>

            <Dialog
                open={showCustomize}
                onClose={() => setShowCustomize(false)}
                maxWidth="sm"
                fullWidth
            >
                <DialogTitle>Customize Breathing Pattern</DialogTitle>
                <DialogContent>
                    <Box sx={{ p: 2 }}>
                        <Typography gutterBottom>
                            Inhale Duration (seconds): {customPattern.inhale}
                        </Typography>
                        <Slider
                            value={customPattern.inhale}
                            onChange={(_, value) => setCustomPattern(prev => ({ ...prev, inhale: value }))}
                            min={2}
                            max={10}
                            marks
                            sx={{ mb: 4 }}
                        />

                        <Typography gutterBottom>
                            Hold Duration (seconds): {customPattern.hold}
                        </Typography>
                        <Slider
                            value={customPattern.hold}
                            onChange={(_, value) => setCustomPattern(prev => ({ ...prev, hold: value }))}
                            min={0}
                            max={10}
                            marks
                            sx={{ mb: 4 }}
                        />

                        <Typography gutterBottom>
                            Exhale Duration (seconds): {customPattern.exhale}
                        </Typography>
                        <Slider
                            value={customPattern.exhale}
                            onChange={(_, value) => setCustomPattern(prev => ({ ...prev, exhale: value }))}
                            min={2}
                            max={10}
                            marks
                            sx={{ mb: 4 }}
                        />

                        <Typography gutterBottom>
                            Hold After Exhale (seconds): {customPattern.holdAfterExhale}
                        </Typography>
                        <Slider
                            value={customPattern.holdAfterExhale}
                            onChange={(_, value) => setCustomPattern(prev => ({ ...prev, holdAfterExhale: value }))}
                            min={0}
                            max={10}
                            marks
                        />
                    </Box>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setShowCustomize(false)}>
                        Cancel
                    </Button>
                    <Button onClick={saveCustomPattern} variant="contained">
                        Save Pattern
                    </Button>
                </DialogActions>
            </Dialog>
        </Paper>
    );
};

export default BreathingExercises;
