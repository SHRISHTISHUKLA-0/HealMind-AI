const express = require('express');
const router = express.Router();

// Import route modules
const authRoutes = require('./auth');
const chatRoutes = require('./chat');
const moodRoutes = require('./mood');
const meditationRoutes = require('./meditation');
const breathingRoutes = require('./breathing');
const goalsRoutes = require('./goals');
const sleepRoutes = require('./sleep');

// Mount routes
router.use('/api/auth', authRoutes);
router.use('/api/chat', chatRoutes);
router.use('/api/mood', moodRoutes);
router.use('/api/meditation', meditationRoutes);
router.use('/api/breathing', breathingRoutes);
router.use('/api/goals', goalsRoutes);
router.use('/api/sleep', sleepRoutes);

// Health check endpoint
router.get('/api/health', (req, res) => {
    res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

module.exports = router;
