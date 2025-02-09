const bcrypt = require('bcrypt');
const db = require('../models/db');
const auth = require('../middleware/auth');
const logger = require('../utils/monitoring').logger;
const { monitorUserActivity } = require('../utils/monitoring');

class UserService {
    async register(userData) {
        const { name, email, password, age } = userData;

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create user in transaction
        return await db.transaction(async (connection) => {
            // Check if email exists
            const existingUser = await connection.query(
                'SELECT id FROM users WHERE email = ?',
                [email]
            );

            if (existingUser[0].length > 0) {
                throw { status: 409, message: 'Email already registered' };
            }

            // Insert user
            const [result] = await connection.query(
                'INSERT INTO users (name, email, password, age) VALUES (?, ?, ?, ?)',
                [name, email, hashedPassword, age]
            );

            // Get user data
            const [user] = await connection.query(
                'SELECT id, name, email, age FROM users WHERE id = ?',
                [result.insertId]
            );

            logger.info('User registered successfully', { userId: result.insertId });

            // Generate token
            const token = auth.generateToken(user[0]);

            return {
                user: user[0],
                token
            };
        });
    }

    async login(credentials) {
        const { email, password } = credentials;

        // Get user with password
        const users = await db.query(
            'SELECT * FROM users WHERE email = ?',
            [email]
        );

        if (users.length === 0) {
            throw { status: 401, message: 'Invalid email or password' };
        }

        // Verify password
        const validPassword = await bcrypt.compare(password, users[0].password);
        if (!validPassword) {
            throw { status: 401, message: 'Invalid email or password' };
        }

        // Monitor user activity
        const cleanup = monitorUserActivity(users[0].id);
        // Note: cleanup should be called when user logs out

        const { password: _, ...userWithoutPassword } = users[0];
        const token = auth.generateToken(userWithoutPassword);

        logger.info('User logged in', { userId: users[0].id });

        return {
            user: userWithoutPassword,
            token
        };
    }

    async updateProfile(userId, updateData) {
        const allowedUpdates = ['name', 'age', 'preferences'];
        const updates = Object.keys(updateData)
            .filter(key => allowedUpdates.includes(key))
            .reduce((obj, key) => {
                obj[key] = updateData[key];
                return obj;
            }, {});

        if (Object.keys(updates).length === 0) {
            throw { status: 400, message: 'No valid update fields provided' };
        }

        const setClause = Object.keys(updates)
            .map(key => `${key} = ?`)
            .join(', ');
        const values = [...Object.values(updates), userId];

        await db.query(
            `UPDATE users SET ${setClause} WHERE id = ?`,
            values
        );

        const updatedUser = await db.query(
            'SELECT id, name, email, age, preferences FROM users WHERE id = ?',
            [userId]
        );

        logger.info('User profile updated', { userId });

        return updatedUser[0];
    }

    async getProfile(userId) {
        const user = await db.query(
            'SELECT id, name, email, age, preferences FROM users WHERE id = ?',
            [userId]
        );

        if (user.length === 0) {
            throw { status: 404, message: 'User not found' };
        }

        return user[0];
    }

    async deleteAccount(userId) {
        await db.transaction(async (connection) => {
            // Delete user data from related tables
            await connection.query('DELETE FROM mood_entries WHERE user_id = ?', [userId]);
            await connection.query('DELETE FROM meditation_sessions WHERE user_id = ?', [userId]);
            await connection.query('DELETE FROM breathing_patterns WHERE user_id = ?', [userId]);
            await connection.query('DELETE FROM users WHERE id = ?', [userId]);
        });

        logger.info('User account deleted', { userId });
    }
}

module.exports = new UserService();
