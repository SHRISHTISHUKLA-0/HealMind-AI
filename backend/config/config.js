require('dotenv').config();

module.exports = {
    app: {
        port: process.env.PORT || 5000,
        env: process.env.NODE_ENV || 'development',
        frontendUrl: process.env.FRONTEND_URL || 'http://localhost:3000',
        apiPrefix: '/api/v1'
    },
    
    database: {
        host: process.env.DB_HOST || 'localhost',
        user: process.env.DB_USER || 'root',
        password: process.env.DB_PASSWORD || 'Shrishti@401209',
        name: process.env.DB_NAME || 'HealMindAI',
        connectionLimit: 10
    },
    
    openai: {
        apiKey: process.env.OPENAI_API_KEY,
        model: 'gpt-3.5-turbo',
        maxTokens: 150
    },
    
    security: {
        rateLimitWindow: 15 * 60 * 1000, // 15 minutes
        maxRequests: 100,
        cors: {
            credentials: true,
            methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
            allowedHeaders: ['Content-Type', 'Authorization']
        },
        requestSizeLimit: '10mb'
    },
    
    logging: {
        level: process.env.LOG_LEVEL || 'info',
        maxFiles: 5,
        maxSize: '5m'
    },
    
    features: {
        meditation: {
            defaultDuration: 10,
            maxDuration: 120,
            types: [
                'mindful-breathing',
                'body-scan',
                'loving-kindness',
                'stress-relief',
                'sleep-preparation',
                'morning-energy',
                'gratitude',
                'focus'
            ]
        },
        mood: {
            types: ['happy', 'sad', 'anxious', 'calm', 'angry', 'neutral'],
            maxNoteLength: 500
        },
        breathing: {
            maxPatterns: 10,
            defaultCycles: 3,
            maxCycles: 50
        }
    }
};
