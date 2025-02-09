const Joi = require('joi');

// User schemas
const userSchema = Joi.object({
    name: Joi.string().min(2).max(50).required()
        .messages({
            'string.min': 'Name must be at least 2 characters long',
            'string.max': 'Name cannot exceed 50 characters',
            'any.required': 'Name is required'
        }),
    email: Joi.string().email().required()
        .messages({
            'string.email': 'Please enter a valid email address',
            'any.required': 'Email is required'
        }),
    password: Joi.string()
        .pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/)
        .required()
        .messages({
            'string.pattern.base': 'Password must contain at least 8 characters, one uppercase letter, one lowercase letter, and one number',
            'any.required': 'Password is required'
        }),
    age: Joi.number().min(13).max(120).required()
        .messages({
            'number.min': 'Must be at least 13 years old',
            'number.max': 'Age cannot exceed 120 years',
            'any.required': 'Age is required'
        })
});

// Mood entry schema
const moodSchema = Joi.object({
    userId: Joi.number().required(),
    mood: Joi.string().valid('happy', 'sad', 'anxious', 'calm', 'angry', 'neutral').required(),
    note: Joi.string().max(500).allow(''),
    intensity: Joi.number().min(1).max(10).required(),
    timestamp: Joi.date().default(Date.now)
});

// Meditation session schema
const meditationSchema = Joi.object({
    userId: Joi.number().required(),
    sessionType: Joi.string().valid(
        'mindful-breathing',
        'body-scan',
        'loving-kindness',
        'stress-relief',
        'sleep-preparation',
        'morning-energy',
        'gratitude',
        'focus'
    ).required(),
    duration: Joi.number().min(1).max(120).required(),
    completed: Joi.boolean().default(false),
    notes: Joi.string().max(500).allow(''),
    timestamp: Joi.date().default(Date.now)
});

// Breathing pattern schema
const breathingSchema = Joi.object({
    userId: Joi.number().required(),
    name: Joi.string().max(50).required(),
    inhale: Joi.number().min(1).max(10).required(),
    hold: Joi.number().min(0).max(10).required(),
    exhale: Joi.number().min(1).max(10).required(),
    holdAfterExhale: Joi.number().min(0).max(10).required(),
    cycles: Joi.number().min(1).max(50).required()
});

// Goal schema
const goalSchema = Joi.object({
    userId: Joi.number().required(),
    title: Joi.string().max(100).required(),
    description: Joi.string().max(500).allow(''),
    category: Joi.string().valid('meditation', 'mood', 'sleep', 'breathing').required(),
    targetDate: Joi.date().greater('now').required(),
    completed: Joi.boolean().default(false),
    progress: Joi.number().min(0).max(100).default(0)
});

// Sleep journal schema
const sleepJournalSchema = Joi.object({
    userId: Joi.number().required(),
    sleepTime: Joi.date().required(),
    wakeTime: Joi.date().required(),
    quality: Joi.number().min(1).max(10).required(),
    mood: Joi.string().valid('refreshed', 'tired', 'groggy', 'energetic').required(),
    notes: Joi.string().max(500).allow(''),
    factors: Joi.array().items(
        Joi.string().valid(
            'stress',
            'exercise',
            'caffeine',
            'screen-time',
            'meditation',
            'noise',
            'temperature'
        )
    )
});

// Chat message schema
const chatSchema = Joi.object({
    userId: Joi.number().required(),
    message: Joi.string().max(1000).required(),
    timestamp: Joi.date().default(Date.now)
});

module.exports = {
    userSchema,
    moodSchema,
    meditationSchema,
    breathingSchema,
    goalSchema,
    sleepJournalSchema,
    chatSchema
};
