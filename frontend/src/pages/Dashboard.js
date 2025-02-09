import React from 'react';
import {
    Grid,
    Card,
    CardContent,
    Typography,
    Box,
    CircularProgress,
    IconButton,
    Button,
} from '@mui/material';
import { styled } from '@mui/material/styles';
import {
    Favorite,
    Timer,
    Chat,
    TrendingUp,
    CalendarToday,
    EmojiEmotions
} from '@mui/icons-material';
import { useAuth } from '../contexts/AuthContext';
import { useApi } from '../hooks/useApi';
import meditationService from '../services/meditationService';
import moodService from '../services/moodService';
import chatService from '../services/chatService';

const StyledCard = styled(Card)(({ theme }) => ({
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
    transition: 'transform 0.2s ease-in-out',
    '&:hover': {
        transform: 'translateY(-5px)',
    },
}));

const StatNumber = styled(Typography)(({ theme }) => ({
    fontSize: '2rem',
    fontWeight: 'bold',
    color: theme.palette.primary.main,
}));

const Dashboard = () => {
    const { user } = useAuth();
    const { data: meditationStats, loading: meditationLoading } = useApi(() =>
        meditationService.getStats(user.id)
    );
    const { data: moodStats, loading: moodLoading } = useApi(() =>
        moodService.getMoodStats(user.id)
    );
    const { data: chatStats, loading: chatLoading } = useApi(() =>
        chatService.getChatHistory(user.id)
    );

    const stats = [
        {
            title: 'Total Meditation Time',
            value: meditationStats?.totalMinutes || 0,
            unit: 'minutes',
            icon: <Timer color="primary" />,
            loading: meditationLoading,
        },
        {
            title: 'Mood Entries',
            value: moodStats?.totalEntries || 0,
            unit: 'entries',
            icon: <EmojiEmotions color="primary" />,
            loading: moodLoading,
        },
        {
            title: 'Chat Sessions',
            value: chatStats?.totalSessions || 0,
            unit: 'sessions',
            icon: <Chat color="primary" />,
            loading: chatLoading,
        },
        {
            title: 'Streak',
            value: user?.streak || 0,
            unit: 'days',
            icon: <TrendingUp color="primary" />,
            loading: false,
        },
    ];

    return (
        <Box sx={{ p: 3 }}>
            <Typography variant="h4" gutterBottom>
                Welcome back, {user?.name}!
            </Typography>

            <Grid container spacing={3} sx={{ mb: 4 }}>
                {stats.map((stat, index) => (
                    <Grid item xs={12} sm={6} md={3} key={index}>
                        <StyledCard>
                            <CardContent>
                                <Box
                                    sx={{
                                        display: 'flex',
                                        justifyContent: 'space-between',
                                        alignItems: 'center',
                                        mb: 2,
                                    }}
                                >
                                    <Typography variant="h6" color="textSecondary">
                                        {stat.title}
                                    </Typography>
                                    {stat.icon}
                                </Box>
                                {stat.loading ? (
                                    <CircularProgress size={30} />
                                ) : (
                                    <StatNumber>
                                        {stat.value}
                                        <Typography
                                            component="span"
                                            variant="body2"
                                            color="textSecondary"
                                            sx={{ ml: 1 }}
                                        >
                                            {stat.unit}
                                        </Typography>
                                    </StatNumber>
                                )}
                            </CardContent>
                        </StyledCard>
                    </Grid>
                ))}
            </Grid>

            <Grid container spacing={3}>
                <Grid item xs={12} md={6}>
                    <StyledCard>
                        <CardContent>
                            <Typography variant="h6" gutterBottom>
                                Recent Mood Trends
                            </Typography>
                            {moodLoading ? (
                                <CircularProgress />
                            ) : (
                                <Box sx={{ height: 300 }}>
                                    {/* Add Mood Chart Component Here */}
                                </Box>
                            )}
                        </CardContent>
                    </StyledCard>
                </Grid>

                <Grid item xs={12} md={6}>
                    <StyledCard>
                        <CardContent>
                            <Typography variant="h6" gutterBottom>
                                Meditation Progress
                            </Typography>
                            {meditationLoading ? (
                                <CircularProgress />
                            ) : (
                                <Box sx={{ height: 300 }}>
                                    {/* Add Meditation Progress Chart Here */}
                                </Box>
                            )}
                        </CardContent>
                    </StyledCard>
                </Grid>

                <Grid item xs={12}>
                    <StyledCard>
                        <CardContent>
                            <Box
                                sx={{
                                    display: 'flex',
                                    justifyContent: 'space-between',
                                    alignItems: 'center',
                                    mb: 2,
                                }}
                            >
                                <Typography variant="h6">
                                    Recent Conversations
                                </Typography>
                                <Button
                                    variant="outlined"
                                    startIcon={<Chat />}
                                    href="/chat"
                                >
                                    Start New Chat
                                </Button>
                            </Box>
                            {chatLoading ? (
                                <CircularProgress />
                            ) : (
                                <Box>
                                    {/* Add Recent Conversations List Here */}
                                </Box>
                            )}
                        </CardContent>
                    </StyledCard>
                </Grid>
            </Grid>
        </Box>
    );
};

export default Dashboard;
