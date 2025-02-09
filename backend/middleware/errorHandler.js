const logger = require('../utils/monitoring').logger;

const errorHandler = (err, req, res, next) => {
    logger.error('Error:', {
        message: err.message,
        stack: err.stack,
        path: req.path,
        method: req.method
    });

    // Handle validation errors
    if (err.name === 'ValidationError') {
        return res.status(400).json({
            error: {
                message: 'Validation Error',
                details: err.errors,
                status: 400
            }
        });
    }

    // Handle database errors
    if (err.name === 'MongoError' || err.name === 'SequelizeError') {
        return res.status(500).json({
            error: {
                message: 'Database Error',
                status: 500
            }
        });
    }

    // Handle JWT errors
    if (err.name === 'JsonWebTokenError') {
        return res.status(401).json({
            error: {
                message: 'Invalid token',
                status: 401
            }
        });
    }

    // Handle rate limit errors
    if (err.name === 'TooManyRequests') {
        return res.status(429).json({
            error: {
                message: 'Too many requests',
                status: 429
            }
        });
    }

    // Default error
    res.status(500).json({
        error: {
            message: 'Internal Server Error',
            status: 500
        }
    });
};

module.exports = errorHandler;
