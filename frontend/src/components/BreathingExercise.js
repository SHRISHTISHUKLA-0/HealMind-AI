import React, { useState, useEffect } from 'react';
import { Box, Paper, Typography, Button, CircularProgress } from '@mui/material';

const BreathingExercise = () => {
    const [phase, setPhase] = useState('ready'); // ready, inhale, hold, exhale
    const [progress, setProgress] = useState(0);
    const [isActive, setIsActive] = useState(false);

    const phases = {
        inhale: { duration: 4000, message: 'Breathe In' },
        hold: { duration: 4000, message: 'Hold' },
        exhale: { duration: 4000, message: 'Breathe Out' },
    };

    useEffect(() => {
        let timer;
        if (isActive) {
            if (phase === 'ready') {
                setPhase('inhale');
            }

            const currentPhase = phases[phase];
            if (currentPhase) {
                const startTime = Date.now();
                timer = setInterval(() => {
                    const elapsed = Date.now() - startTime;
                    const newProgress = (elapsed / currentPhase.duration) * 100;

                    if (newProgress >= 100) {
                        setProgress(0);
                        setPhase(prev => {
                            if (prev === 'inhale') return 'hold';
                            if (prev === 'hold') return 'exhale';
                            if (prev === 'exhale') return 'inhale';
                            return 'inhale';
                        });
                    } else {
                        setProgress(newProgress);
                    }
                }, 50);
            }
        }

        return () => clearInterval(timer);
    }, [phase, isActive]);

    const handleStart = () => {
        setIsActive(true);
        setPhase('inhale');
        setProgress(0);
    };

    const handleStop = () => {
        setIsActive(false);
        setPhase('ready');
        setProgress(0);
    };

    const getColor = () => {
        switch (phase) {
            case 'inhale':
                return '#4caf50';
            case 'hold':
                return '#2196f3';
            case 'exhale':
                return '#ff9800';
            default:
                return '#grey.500';
        }
    };

    return (
        <Paper elevation={3} sx={{ p: 3, mb: 3 }}>
            <Typography variant="h6" gutterBottom align="center">
                Breathing Exercise
            </Typography>

            <Box sx={{ 
                display: 'flex', 
                flexDirection: 'column', 
                alignItems: 'center',
                position: 'relative',
                my: 4
            }}>
                <Box sx={{ position: 'relative' }}>
                    <CircularProgress
                        variant="determinate"
                        value={100}
                        size={200}
                        thickness={2}
                        sx={{ color: 'grey.200' }}
                    />
                    <CircularProgress
                        variant="determinate"
                        value={progress}
                        size={200}
                        thickness={2}
                        sx={{
                            color: getColor(),
                            position: 'absolute',
                            left: 0,
                            transition: 'all 0.5s ease'
                        }}
                    />
                    <Box sx={{
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        right: 0,
                        bottom: 0,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                    }}>
                        <Typography variant="h5" component="div" color="text.secondary">
                            {phase === 'ready' ? 'Ready?' : phases[phase]?.message}
                        </Typography>
                    </Box>
                </Box>
            </Box>

            <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2 }}>
                {!isActive ? (
                    <Button
                        variant="contained"
                        color="primary"
                        onClick={handleStart}
                    >
                        Start
                    </Button>
                ) : (
                    <Button
                        variant="contained"
                        color="secondary"
                        onClick={handleStop}
                    >
                        Stop
                    </Button>
                )}
            </Box>

            <Box sx={{ mt: 3 }}>
                <Typography variant="body2" color="text.secondary" align="center">
                    Take deep breaths to reduce stress and anxiety
                </Typography>
            </Box>
        </Paper>
    );
};

export default BreathingExercise;
