const winston = require('winston');
const { createLogger, format, transports } = winston;
const expressWinston = require('express-winston');
const promClient = require('prom-client');

// Initialize Prometheus metrics
const collectDefaultMetrics = promClient.collectDefaultMetrics;
collectDefaultMetrics({ timeout: 5000 });

// Custom metrics
const httpRequestDurationMicroseconds = new promClient.Histogram({
    name: 'http_request_duration_seconds',
    help: 'Duration of HTTP requests in seconds',
    labelNames: ['method', 'route', 'status_code'],
    buckets: [0.1, 0.5, 1, 2, 5]
});

const activeUsers = new promClient.Gauge({
    name: 'active_users',
    help: 'Number of active users'
});

const meditationSessions = new promClient.Counter({
    name: 'meditation_sessions_total',
    help: 'Total number of meditation sessions',
    labelNames: ['type']
});

const moodEntries = new promClient.Counter({
    name: 'mood_entries_total',
    help: 'Total number of mood entries',
    labelNames: ['mood']
});

// Create Winston logger
const logger = createLogger({
    format: format.combine(
        format.timestamp(),
        format.json(),
        format.errors({ stack: true }),
        format.metadata()
    ),
    defaultMeta: { service: 'healmind-api' },
    transports: [
        new transports.Console({
            format: format.combine(
                format.colorize(),
                format.simple()
            )
        }),
        new transports.File({ 
            filename: 'logs/error.log', 
            level: 'error',
            maxsize: 5242880, // 5MB
            maxFiles: 5,
        }),
        new transports.File({ 
            filename: 'logs/combined.log',
            maxsize: 5242880, // 5MB
            maxFiles: 5,
        })
    ]
});

// Request logging middleware
const requestLogger = expressWinston.logger({
    winstonInstance: logger,
    meta: true,
    msg: 'HTTP {{req.method}} {{req.url}}',
    expressFormat: true,
    colorize: true,
});

// Error logging middleware
const errorLogger = expressWinston.errorLogger({
    winstonInstance: logger,
    meta: true,
});

// Custom monitoring functions
const monitorUserActivity = (userId) => {
    activeUsers.inc();
    return () => activeUsers.dec(); // Return cleanup function
};

const trackMeditationSession = (type) => {
    meditationSessions.labels(type).inc();
};

const trackMoodEntry = (mood) => {
    moodEntries.labels(mood).inc();
};

// Health check function
const healthCheck = async (db, redis) => {
    try {
        // Check database connection
        await db.query('SELECT 1');
        
        // Check Redis if available
        if (redis) {
            await redis.ping();
        }
        
        // Check system resources
        const usedMemory = process.memoryUsage();
        const systemLoad = process.cpuUsage();
        
        return {
            status: 'healthy',
            timestamp: new Date().toISOString(),
            uptime: process.uptime(),
            memory: {
                heapUsed: usedMemory.heapUsed,
                heapTotal: usedMemory.heapTotal,
                rss: usedMemory.rss
            },
            cpu: systemLoad,
            services: {
                database: 'connected',
                redis: redis ? 'connected' : 'not_configured'
            }
        };
    } catch (error) {
        logger.error('Health check failed:', error);
        return {
            status: 'unhealthy',
            timestamp: new Date().toISOString(),
            error: error.message
        };
    }
};

// Performance monitoring middleware
const performanceMonitoring = (req, res, next) => {
    const start = process.hrtime();
    
    res.on('finish', () => {
        const duration = process.hrtime(start);
        const durationInSeconds = duration[0] + duration[1] / 1e9;
        
        httpRequestDurationMicroseconds
            .labels(req.method, req.route?.path || req.path, res.statusCode)
            .observe(durationInSeconds);
    });
    
    next();
};

// Export monitoring functions and metrics
module.exports = {
    logger,
    requestLogger,
    errorLogger,
    metrics: {
        httpRequestDurationMicroseconds,
        activeUsers,
        meditationSessions,
        moodEntries
    },
    monitorUserActivity,
    trackMeditationSession,
    trackMoodEntry,
    healthCheck,
    performanceMonitoring,
    registry: promClient.register
};
