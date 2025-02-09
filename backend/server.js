const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');

// Import configuration
const config = require('./config/config');

// Import routes
const userRoutes = require('./routes/userRoutes');
const registerRoutes = require('./routes/registerRoutes');
const loginRoutes = require('./routes/loginRoutes');
const chatRoutes = require('./routes/chatRoutes');
const meditationRoutes = require('./routes/meditationRoutes');
const moodRoutes = require('./routes/moodRoutes');
const conversationRoutes = require('./routes/conversationRoutes');
const messageRoutes = require('./routes/messageRoutes');
const healthCheckRoutes = require('./routes/healthCheckRoutes');
const metricsRoutes = require('./routes/metricsRoutes');
const apiRoutes = require('./routes/apiRoutes');

// Import monitoring utilities
const {
    logger,
    requestLogger,
    errorLogger,
    performanceMonitoring,
    healthCheck,
    registry
} = require('./utils/monitoring');

const app = express();

// Security middleware
app.use(helmet());
app.use(cors(config.security.cors));
app.use(express.json({ limit: config.security.requestSizeLimit }));

// Monitoring middleware
app.use(requestLogger);
app.use(performanceMonitoring);

// Rate limiting
const limiter = rateLimit({
    windowMs: config.security.rateLimitWindow,
    max: config.security.maxRequests
});
app.use(limiter);

// API routes
app.use(`${config.app.apiPrefix}/users`, userRoutes);
app.use(`${config.app.apiPrefix}/register`, registerRoutes);
app.use(`${config.app.apiPrefix}/login`, loginRoutes);
app.use(`${config.app.apiPrefix}/chat`, chatRoutes);
app.use(`${config.app.apiPrefix}/meditation-sessions`, meditationRoutes);
app.use(`${config.app.apiPrefix}/mood`, moodRoutes);
app.use(`${config.app.apiPrefix}/conversations`, conversationRoutes);
app.use(`${config.app.apiPrefix}/messages`, messageRoutes);
app.use(`${config.app.apiPrefix}/health`, healthCheckRoutes);
app.use(`${config.app.apiPrefix}/metrics`, metricsRoutes);
app.use(`${config.app.apiPrefix}/api`, apiRoutes);

// Health check endpoint
app.get('/health', async (req, res) => {
    const status = await healthCheck();
    res.status(status.status === 'healthy' ? 200 : 503).json(status);
});

// Metrics endpoint
app.get('/metrics', async (req, res) => {
    try {
        res.set('Content-Type', registry.contentType);
        res.end(await registry.metrics());
    } catch (error) {
        logger.error('Error generating metrics:', error);
        res.status(500).send('Error generating metrics');
    }
});

// Error logging middleware
app.use(errorLogger);

// Global error handler
const errorHandler = (err, req, res, next) => {
    logger.error('Error:', err);
    res.status(err.status || 500).json({
        error: {
            message: err.message || 'Internal server error',
            status: err.status || 500
        }
    });
};
app.use(errorHandler);

// Handle unhandled promise rejections
process.on('unhandledRejection', (err) => {
    logger.error('Unhandled Promise Rejection:', err);
});

// Handle uncaught exceptions
process.on('uncaughtException', (err) => {
    logger.error('Uncaught Exception:', err);
});

// Start server
app.listen(config.app.port, () => {
    logger.info(`Server running on port ${config.app.port} in ${config.app.env} mode`);
});