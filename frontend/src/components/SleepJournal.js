import React, { useState, useEffect } from 'react';
import {
    Box,
    Paper,
    Typography,
    TextField,
    Button,
    Card,
    CardContent,
    Grid,
    Rating,
    Slider,
    Chip,
    IconButton,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    FormControl,
    FormLabel,
    FormGroup,
    FormControlLabel,
    Checkbox
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import HotelIcon from '@mui/icons-material/Hotel';
import WbTwilightIcon from '@mui/icons-material/WbTwilight';
import WbSunnyIcon from '@mui/icons-material/WbSunny';
import LocalCafeIcon from '@mui/icons-material/LocalCafe';
import SportsEsportsIcon from '@mui/icons-material/SportsEsports';
import DevicesIcon from '@mui/icons-material/Devices';
import RestaurantIcon from '@mui/icons-material/Restaurant';
import FitnessCenterIcon from '@mui/icons-material/FitnessCenter';

const SleepJournal = () => {
    const [entries, setEntries] = useState(() => {
        const saved = localStorage.getItem('sleepEntries');
        return saved ? JSON.parse(saved) : [];
    });
    const [openDialog, setOpenDialog] = useState(false);
    const [newEntry, setNewEntry] = useState({
        date: new Date().toISOString().split('T')[0],
        bedTime: '',
        wakeTime: '',
        sleepQuality: 3,
        sleepDuration: 8,
        mood: 3,
        factors: {
            caffeine: false,
            exercise: false,
            screenTime: false,
            lateMeal: false,
            stress: false,
            gaming: false
        },
        notes: ''
    });

    useEffect(() => {
        localStorage.setItem('sleepEntries', JSON.stringify(entries));
    }, [entries]);

    const handleOpenDialog = () => {
        setOpenDialog(true);
    };

    const handleCloseDialog = () => {
        setOpenDialog(false);
    };

    const handleSaveEntry = () => {
        const sleepStart = new Date(\`\${newEntry.date} \${newEntry.bedTime}\`);
        const sleepEnd = new Date(\`\${newEntry.date} \${newEntry.wakeTime}\`);
        if (sleepEnd < sleepStart) {
            sleepEnd.setDate(sleepEnd.getDate() + 1);
        }
        const duration = (sleepEnd - sleepStart) / (1000 * 60 * 60);

        const entry = {
            ...newEntry,
            id: Date.now(),
            sleepDuration: duration.toFixed(1),
            createdAt: new Date()
        };

        setEntries([entry, ...entries]);
        handleCloseDialog();
        setNewEntry({
            date: new Date().toISOString().split('T')[0],
            bedTime: '',
            wakeTime: '',
            sleepQuality: 3,
            sleepDuration: 8,
            mood: 3,
            factors: {
                caffeine: false,
                exercise: false,
                screenTime: false,
                lateMeal: false,
                stress: false,
                gaming: false
            },
            notes: ''
        });
    };

    const handleDeleteEntry = (id) => {
        setEntries(entries.filter(entry => entry.id !== id));
    };

    const getQualityColor = (rating) => {
        if (rating >= 4) return '#4caf50';
        if (rating >= 3) return '#ff9800';
        return '#f44336';
    };

    const factors = [
        { name: 'caffeine', label: 'Caffeine', icon: <LocalCafeIcon /> },
        { name: 'gaming', label: 'Gaming', icon: <SportsEsportsIcon /> },
        { name: 'screenTime', label: 'Screen Time', icon: <DevicesIcon /> },
        { name: 'lateMeal', label: 'Late Meal', icon: <RestaurantIcon /> },
        { name: 'exercise', label: 'Exercise', icon: <FitnessCenterIcon /> }
    ];

    return (
        <Paper elevation={3} sx={{ p: 3, mb: 3 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                <Typography variant="h5" color="primary">
                    Sleep Journal
                </Typography>
                <Button
                    variant="contained"
                    onClick={handleOpenDialog}
                    startIcon={<HotelIcon />}
                >
                    Add Sleep Entry
                </Button>
            </Box>

            <Grid container spacing={3}>
                {entries.map((entry) => (
                    <Grid item xs={12} md={6} key={entry.id}>
                        <Card>
                            <CardContent>
                                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                                    <Typography variant="h6">
                                        {new Date(entry.date).toLocaleDateString()}
                                    </Typography>
                                    <IconButton
                                        size="small"
                                        color="error"
                                        onClick={() => handleDeleteEntry(entry.id)}
                                    >
                                        <DeleteIcon />
                                    </IconButton>
                                </Box>

                                <Grid container spacing={2} sx={{ mb: 2 }}>
                                    <Grid item xs={6}>
                                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                            <WbTwilightIcon sx={{ mr: 1 }} />
                                            <Typography>
                                                {entry.bedTime}
                                            </Typography>
                                        </Box>
                                    </Grid>
                                    <Grid item xs={6}>
                                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                            <WbSunnyIcon sx={{ mr: 1 }} />
                                            <Typography>
                                                {entry.wakeTime}
                                            </Typography>
                                        </Box>
                                    </Grid>
                                </Grid>

                                <Box sx={{ mb: 2 }}>
                                    <Typography variant="body2" gutterBottom>
                                        Sleep Duration: {entry.sleepDuration} hours
                                    </Typography>
                                    <Typography variant="body2" gutterBottom>
                                        Sleep Quality:
                                        <Rating
                                            value={entry.sleepQuality}
                                            readOnly
                                            sx={{ ml: 1 }}
                                        />
                                    </Typography>
                                    <Typography variant="body2">
                                        Morning Mood:
                                        <Rating
                                            value={entry.mood}
                                            readOnly
                                            sx={{ ml: 1 }}
                                        />
                                    </Typography>
                                </Box>

                                <Box sx={{ mb: 2 }}>
                                    {Object.entries(entry.factors).map(([factor, value]) => {
                                        if (!value) return null;
                                        const factorInfo = factors.find(f => f.name === factor);
                                        return (
                                            <Chip
                                                key={factor}
                                                icon={factorInfo?.icon}
                                                label={factorInfo?.label}
                                                size="small"
                                                sx={{ mr: 1, mb: 1 }}
                                            />
                                        );
                                    })}
                                </Box>

                                {entry.notes && (
                                    <Typography variant="body2" color="text.secondary">
                                        Notes: {entry.notes}
                                    </Typography>
                                )}
                            </CardContent>
                        </Card>
                    </Grid>
                ))}
            </Grid>

            <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
                <DialogTitle>Add Sleep Entry</DialogTitle>
                <DialogContent>
                    <Box sx={{ pt: 2 }}>
                        <Grid container spacing={2}>
                            <Grid item xs={12}>
                                <TextField
                                    fullWidth
                                    type="date"
                                    label="Date"
                                    value={newEntry.date}
                                    onChange={(e) => setNewEntry({ ...newEntry, date: e.target.value })}
                                    InputLabelProps={{ shrink: true }}
                                />
                            </Grid>
                            <Grid item xs={6}>
                                <TextField
                                    fullWidth
                                    type="time"
                                    label="Bed Time"
                                    value={newEntry.bedTime}
                                    onChange={(e) => setNewEntry({ ...newEntry, bedTime: e.target.value })}
                                    InputLabelProps={{ shrink: true }}
                                />
                            </Grid>
                            <Grid item xs={6}>
                                <TextField
                                    fullWidth
                                    type="time"
                                    label="Wake Time"
                                    value={newEntry.wakeTime}
                                    onChange={(e) => setNewEntry({ ...newEntry, wakeTime: e.target.value })}
                                    InputLabelProps={{ shrink: true }}
                                />
                            </Grid>
                        </Grid>

                        <Box sx={{ mt: 3 }}>
                            <Typography gutterBottom>Sleep Quality</Typography>
                            <Rating
                                value={newEntry.sleepQuality}
                                onChange={(_, value) => setNewEntry({ ...newEntry, sleepQuality: value })}
                            />
                        </Box>

                        <Box sx={{ mt: 3 }}>
                            <Typography gutterBottom>Morning Mood</Typography>
                            <Rating
                                value={newEntry.mood}
                                onChange={(_, value) => setNewEntry({ ...newEntry, mood: value })}
                            />
                        </Box>

                        <FormControl component="fieldset" sx={{ mt: 3 }}>
                            <FormLabel component="legend">Factors that may have affected your sleep:</FormLabel>
                            <FormGroup>
                                {factors.map((factor) => (
                                    <FormControlLabel
                                        key={factor.name}
                                        control={
                                            <Checkbox
                                                checked={newEntry.factors[factor.name]}
                                                onChange={(e) => setNewEntry({
                                                    ...newEntry,
                                                    factors: {
                                                        ...newEntry.factors,
                                                        [factor.name]: e.target.checked
                                                    }
                                                })}
                                            />
                                        }
                                        label={
                                            <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                                {factor.icon}
                                                <Typography sx={{ ml: 1 }}>{factor.label}</Typography>
                                            </Box>
                                        }
                                    />
                                ))}
                            </FormGroup>
                        </FormControl>

                        <TextField
                            fullWidth
                            multiline
                            rows={3}
                            label="Notes"
                            value={newEntry.notes}
                            onChange={(e) => setNewEntry({ ...newEntry, notes: e.target.value })}
                            sx={{ mt: 3 }}
                        />
                    </Box>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseDialog}>Cancel</Button>
                    <Button
                        variant="contained"
                        onClick={handleSaveEntry}
                        disabled={!newEntry.date || !newEntry.bedTime || !newEntry.wakeTime}
                    >
                        Save
                    </Button>
                </DialogActions>
            </Dialog>
        </Paper>
    );
};

export default SleepJournal;
