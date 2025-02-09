const jwt = require('jsonwebtoken');
const config = require('../config/config');
const logger = require('../utils/monitoring').logger;

const auth = {
    // Verify JWT token
    verifyToken: (req, res, next) => {
        const token = req.headers.authorization?.split(' ')[1];

        if (!token) {
            return res.status(401).json({ 
                error: { message: 'Access denied. No token provided.', status: 401 }
            });
        }

        try {
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            req.user = decoded;
            next();
        } catch (error) {
            logger.error('Token verification failed:', error);
            res.status(401).json({ 
                error: { message: 'Invalid token.', status: 401 }
            });
        }
    },

    // Generate JWT token
    generateToken: (user) => {
        return jwt.sign(
            { id: user.id, email: user.email },
            process.env.JWT_SECRET,
            { expiresIn: '24h' }
        );
    },

    // Check user role
    checkRole: (roles) => {
        return (req, res, next) => {
            if (!roles.includes(req.user.role)) {
                return res.status(403).json({ 
                    error: { message: 'Access denied. Insufficient permissions.', status: 403 }
                });
            }
            next();
        };
    }
};

module.exports = auth;
