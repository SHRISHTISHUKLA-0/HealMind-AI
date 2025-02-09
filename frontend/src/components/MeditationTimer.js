import React, { useState, useEffect, useCallback, useRef } from 'react';
import {
    Box,
    Button,
    Card,
    CardContent,
    CircularProgress,
    Typography,
    Slider,
    IconButton,
    useTheme
} from '@mui/material';
import { styled } from '@mui/material/styles';
import {
    PlayArrow,
    Pause,
    Stop,
    VolumeUp,
    VolumeOff
} from '@mui/icons-material';
import { useApi } from '../hooks/useApi';
import meditationService from '../services/meditationService';
import { useAuth } from '../contexts/AuthContext';

const TimerContainer = styled(Card)(({ theme }) => ({
    textAlign: 'center',
    padding: theme.spacing(3),
    maxWidth: 600,
    margin: '0 auto',
    background: theme.palette.background.paper,
    boxShadow: theme.shadows[3],
    borderRadius: theme.shape.borderRadius * 2,
}));

const TimerDisplay = styled(Box)(({ theme }) => ({
    fontSize: '4rem',
    fontWeight: 'bold',
    margin: theme.spacing(3, 0),
    color: theme.palette.primary.main,
}));

const ControlButton = styled(IconButton)(({ theme }) => ({
    margin: theme.spacing(0, 1),
    '&.large': {
        fontSize: '2rem',
    },
}));

const MeditationTimer = () => {
    const [duration, setDuration] = useState(10);
    const [timeLeft, setTimeLeft] = useState(duration * 60);
    const [isRunning, setIsRunning] = useState(false);
    const [isPaused, setIsPaused] = useState(false);
    const [volume, setVolume] = useState(50);
    const [isMuted, setIsMuted] = useState(false);
    const intervalRef = useRef(null);
    const audioRef = useRef(null);
    const theme = useTheme();
    const { user } = useAuth();

    const { execute: startSession } = useApi(meditationService.startSession);
    const { execute: endSession } = useApi(meditationService.endSession);

    const formatTime = useCallback((seconds) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    }, []);

    const handleStart = useCallback(async () => {
        if (!isRunning && !isPaused) {
            try {
                const session = await startSession({
                    userId: user.id,
                    duration: duration,
                    type: 'mindful-breathing'
                });
                
                setTimeLeft(duration * 60);
                setIsRunning(true);
                
                // Play start sound
                if (audioRef.current && !isMuted) {
                    audioRef.current.play();
                }
            } catch (error) {
                console.error('Failed to start session:', error);
            }
        } else if (isPaused) {
            setIsPaused(false);
            setIsRunning(true);
        }
    }, [isRunning, isPaused, duration, user.id, startSession, isMuted]);

    const handlePause = () => {
        setIsPaused(true);
        setIsRunning(false);
    };

    const handleStop = useCallback(async () => {
        try {
            if (isRunning || isPaused) {
                await endSession(user.id, {
                    completedDuration: duration * 60 - timeLeft,
                    totalDuration: duration * 60
                });
            }
        } catch (error) {
            console.error('Failed to end session:', error);
        } finally {
            setIsRunning(false);
            setIsPaused(false);
            setTimeLeft(duration * 60);
            if (intervalRef.current) {
                clearInterval(intervalRef.current);
            }
        }
    }, [isRunning, isPaused, duration, timeLeft, user.id, endSession]);

    const handleVolumeChange = (event, newValue) => {
        setVolume(newValue);
        if (audioRef.current) {
            audioRef.current.volume = newValue / 100;
        }
    };

    const toggleMute = () => {
        setIsMuted(!isMuted);
        if (audioRef.current) {
            audioRef.current.muted = !isMuted;
        }
    };

    useEffect(() => {
        if (isRunning && !isPaused) {
            intervalRef.current = setInterval(() => {
                setTimeLeft((prevTime) => {
                    if (prevTime <= 1) {
                        handleStop();
                        return 0;
                    }
                    return prevTime - 1;
                });
            }, 1000);
        } else if (intervalRef.current) {
            clearInterval(intervalRef.current);
        }

        return () => {
            if (intervalRef.current) {
                clearInterval(intervalRef.current);
            }
        };
    }, [isRunning, isPaused, handleStop]);

    useEffect(() => {
        setTimeLeft(duration * 60);
    }, [duration]);

    return (
        <TimerContainer>
            <CardContent>
                <Typography variant="h5" gutterBottom>
                    Meditation Timer
                </Typography>

                <Box sx={{ mb: 3 }}>
                    <Typography gutterBottom>
                        Duration: {duration} minutes
                    </Typography>
                    <Slider
                        value={duration}
                        min={1}
                        max={60}
                        onChange={(e, value) => setDuration(value)}
                        disabled={isRunning || isPaused}
                        sx={{ maxWidth: 300, mx: 'auto' }}
                    />
                </Box>

                <TimerDisplay>
                    {formatTime(timeLeft)}
                </TimerDisplay>

                <Box sx={{ mb: 3 }}>
                    {!isRunning && !isPaused && (
                        <ControlButton
                            color="primary"
                            onClick={handleStart}
                            className="large"
                        >
                            <PlayArrow />
                        </ControlButton>
                    )}

                    {isRunning && (
                        <ControlButton
                            color="primary"
                            onClick={handlePause}
                            className="large"
                        >
                            <Pause />
                        </ControlButton>
                    )}

                    {isPaused && (
                        <ControlButton
                            color="primary"
                            onClick={handleStart}
                            className="large"
                        >
                            <PlayArrow />
                        </ControlButton>
                    )}

                    {(isRunning || isPaused) && (
                        <ControlButton
                            color="secondary"
                            onClick={handleStop}
                            className="large"
                        >
                            <Stop />
                        </ControlButton>
                    )}
                </Box>

                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 2 }}>
                    <IconButton onClick={toggleMute}>
                        {isMuted ? <VolumeOff /> : <VolumeUp />}
                    </IconButton>
                    <Slider
                        value={volume}
                        onChange={handleVolumeChange}
                        disabled={isMuted}
                        sx={{ width: 100 }}
                    />
                </Box>

                <audio ref={audioRef} src="/meditation-bell.mp3" />
            </CardContent>
        </TimerContainer>
    );
};

export default MeditationTimer;
