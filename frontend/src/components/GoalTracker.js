import React, { useState, useEffect } from 'react';
import {
    Box,
    Paper,
    Typography,
    TextField,
    Button,
    LinearProgress,
    IconButton,
    Card,
    CardContent,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Select,
    MenuItem,
    FormControl,
    InputLabel,
    Grid,
    Chip,
    Tooltip
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import StarIcon from '@mui/icons-material/Star';

const GoalTracker = () => {
    const [goals, setGoals] = useState(() => {
        const saved = localStorage.getItem('goals');
        return saved ? JSON.parse(saved) : [];
    });
    const [openDialog, setOpenDialog] = useState(false);
    const [editingGoal, setEditingGoal] = useState(null);
    const [newGoal, setNewGoal] = useState({
        title: '',
        description: '',
        category: '',
        deadline: '',
        progress: 0,
        priority: 'medium',
        milestones: []
    });

    useEffect(() => {
        localStorage.setItem('goals', JSON.stringify(goals));
    }, [goals]);

    const categories = [
        'Mental Health',
        'Physical Health',
        'Personal Growth',
        'Relationships',
        'Career',
        'Other'
    ];

    const priorities = {
        high: { label: 'High', color: '#f44336' },
        medium: { label: 'Medium', color: '#ff9800' },
        low: { label: 'Low', color: '#4caf50' }
    };

    const handleOpenDialog = (goal = null) => {
        if (goal) {
            setEditingGoal(goal);
            setNewGoal(goal);
        } else {
            setEditingGoal(null);
            setNewGoal({
                title: '',
                description: '',
                category: '',
                deadline: '',
                progress: 0,
                priority: 'medium',
                milestones: []
            });
        }
        setOpenDialog(true);
    };

    const handleCloseDialog = () => {
        setOpenDialog(false);
        setEditingGoal(null);
    };

    const handleSaveGoal = () => {
        if (editingGoal) {
            setGoals(goals.map(g => g.id === editingGoal.id ? { ...newGoal, id: editingGoal.id } : g));
        } else {
            setGoals([...goals, { ...newGoal, id: Date.now(), createdAt: new Date() }]);
        }
        handleCloseDialog();
    };

    const handleDeleteGoal = (id) => {
        setGoals(goals.filter(goal => goal.id !== id));
    };

    const handleProgressChange = (id, newProgress) => {
        setGoals(goals.map(goal =>
            goal.id === id ? { ...goal, progress: newProgress } : goal
        ));
    };

    const handleAddMilestone = () => {
        setNewGoal({
            ...newGoal,
            milestones: [...newGoal.milestones, { text: '', completed: false }]
        });
    };

    const handleMilestoneChange = (index, value) => {
        const updatedMilestones = [...newGoal.milestones];
        updatedMilestones[index] = { ...updatedMilestones[index], text: value };
        setNewGoal({ ...newGoal, milestones: updatedMilestones });
    };

    const handleToggleMilestone = (goalId, index) => {
        setGoals(goals.map(goal => {
            if (goal.id === goalId) {
                const updatedMilestones = [...goal.milestones];
                updatedMilestones[index] = {
                    ...updatedMilestones[index],
                    completed: !updatedMilestones[index].completed
                };
                return { ...goal, milestones: updatedMilestones };
            }
            return goal;
        }));
    };

    return (
        <Paper elevation={3} sx={{ p: 3, mb: 3 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                <Typography variant="h5" color="primary">
                    Goal Tracker
                </Typography>
                <Button
                    variant="contained"
                    startIcon={<AddIcon />}
                    onClick={() => handleOpenDialog()}
                >
                    Add Goal
                </Button>
            </Box>

            <Grid container spacing={3}>
                {goals.map((goal) => (
                    <Grid item xs={12} md={6} key={goal.id}>
                        <Card sx={{ height: '100%' }}>
                            <CardContent>
                                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                                    <Typography variant="h6" gutterBottom>
                                        {goal.title}
                                    </Typography>
                                    <Box>
                                        <IconButton
                                            size="small"
                                            onClick={() => handleOpenDialog(goal)}
                                        >
                                            <EditIcon />
                                        </IconButton>
                                        <IconButton
                                            size="small"
                                            color="error"
                                            onClick={() => handleDeleteGoal(goal.id)}
                                        >
                                            <DeleteIcon />
                                        </IconButton>
                                    </Box>
                                </Box>

                                <Typography variant="body2" color="text.secondary" paragraph>
                                    {goal.description}
                                </Typography>

                                <Box sx={{ mb: 2 }}>
                                    <Chip
                                        label={goal.category}
                                        size="small"
                                        sx={{ mr: 1 }}
                                    />
                                    <Chip
                                        icon={<StarIcon />}
                                        label={priorities[goal.priority].label}
                                        size="small"
                                        sx={{ bgcolor: priorities[goal.priority].color, color: 'white' }}
                                    />
                                </Box>

                                <Box sx={{ mb: 2 }}>
                                    <Typography variant="body2" gutterBottom>
                                        Progress: {goal.progress}%
                                    </Typography>
                                    <LinearProgress
                                        variant="determinate"
                                        value={goal.progress}
                                        sx={{ height: 8, borderRadius: 4 }}
                                    />
                                </Box>

                                {goal.milestones.length > 0 && (
                                    <Box>
                                        <Typography variant="subtitle2" gutterBottom>
                                            Milestones:
                                        </Typography>
                                        {goal.milestones.map((milestone, index) => (
                                            <Box
                                                key={index}
                                                sx={{
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    mb: 1
                                                }}
                                            >
                                                <Tooltip title={milestone.completed ? "Mark as incomplete" : "Mark as complete"}>
                                                    <IconButton
                                                        size="small"
                                                        onClick={() => handleToggleMilestone(goal.id, index)}
                                                        color={milestone.completed ? "primary" : "default"}
                                                    >
                                                        <CheckCircleIcon />
                                                    </IconButton>
                                                </Tooltip>
                                                <Typography
                                                    variant="body2"
                                                    sx={{
                                                        textDecoration: milestone.completed ? 'line-through' : 'none',
                                                        color: milestone.completed ? 'text.secondary' : 'text.primary'
                                                    }}
                                                >
                                                    {milestone.text}
                                                </Typography>
                                            </Box>
                                        ))}
                                    </Box>
                                )}

                                {goal.deadline && (
                                    <Typography variant="caption" color="text.secondary">
                                        Deadline: {new Date(goal.deadline).toLocaleDateString()}
                                    </Typography>
                                )}
                            </CardContent>
                        </Card>
                    </Grid>
                ))}
            </Grid>

            <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
                <DialogTitle>
                    {editingGoal ? 'Edit Goal' : 'Add New Goal'}
                </DialogTitle>
                <DialogContent>
                    <Box sx={{ pt: 2 }}>
                        <TextField
                            fullWidth
                            label="Goal Title"
                            value={newGoal.title}
                            onChange={(e) => setNewGoal({ ...newGoal, title: e.target.value })}
                            sx={{ mb: 2 }}
                        />
                        <TextField
                            fullWidth
                            multiline
                            rows={3}
                            label="Description"
                            value={newGoal.description}
                            onChange={(e) => setNewGoal({ ...newGoal, description: e.target.value })}
                            sx={{ mb: 2 }}
                        />
                        <Grid container spacing={2} sx={{ mb: 2 }}>
                            <Grid item xs={12} sm={6}>
                                <FormControl fullWidth>
                                    <InputLabel>Category</InputLabel>
                                    <Select
                                        value={newGoal.category}
                                        label="Category"
                                        onChange={(e) => setNewGoal({ ...newGoal, category: e.target.value })}
                                    >
                                        {categories.map((category) => (
                                            <MenuItem key={category} value={category}>
                                                {category}
                                            </MenuItem>
                                        ))}
                                    </Select>
                                </FormControl>
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <FormControl fullWidth>
                                    <InputLabel>Priority</InputLabel>
                                    <Select
                                        value={newGoal.priority}
                                        label="Priority"
                                        onChange={(e) => setNewGoal({ ...newGoal, priority: e.target.value })}
                                    >
                                        {Object.entries(priorities).map(([key, { label }]) => (
                                            <MenuItem key={key} value={key}>
                                                {label}
                                            </MenuItem>
                                        ))}
                                    </Select>
                                </FormControl>
                            </Grid>
                        </Grid>
                        <TextField
                            fullWidth
                            type="date"
                            label="Deadline"
                            value={newGoal.deadline}
                            onChange={(e) => setNewGoal({ ...newGoal, deadline: e.target.value })}
                            InputLabelProps={{ shrink: true }}
                            sx={{ mb: 2 }}
                        />
                        <Box sx={{ mb: 2 }}>
                            <Typography variant="subtitle2" gutterBottom>
                                Progress: {newGoal.progress}%
                            </Typography>
                            <TextField
                                fullWidth
                                type="range"
                                value={newGoal.progress}
                                onChange={(e) => setNewGoal({ ...newGoal, progress: Number(e.target.value) })}
                                inputProps={{ min: 0, max: 100 }}
                            />
                        </Box>
                        <Box sx={{ mb: 2 }}>
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                                <Typography variant="subtitle2">
                                    Milestones
                                </Typography>
                                <Button
                                    size="small"
                                    startIcon={<AddIcon />}
                                    onClick={handleAddMilestone}
                                >
                                    Add Milestone
                                </Button>
                            </Box>
                            {newGoal.milestones.map((milestone, index) => (
                                <TextField
                                    key={index}
                                    fullWidth
                                    size="small"
                                    placeholder={`Milestone ${index + 1}`}
                                    value={milestone.text}
                                    onChange={(e) => handleMilestoneChange(index, e.target.value)}
                                    sx={{ mb: 1 }}
                                />
                            ))}
                        </Box>
                    </Box>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseDialog}>Cancel</Button>
                    <Button
                        variant="contained"
                        onClick={handleSaveGoal}
                        disabled={!newGoal.title || !newGoal.category}
                    >
                        Save
                    </Button>
                </DialogActions>
            </Dialog>
        </Paper>
    );
};

export default GoalTracker;
