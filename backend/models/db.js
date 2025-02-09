const mysql = require('mysql2');
const config = require('../config/config');
const logger = require('../utils/monitoring').logger;

const pool = mysql.createPool({
    host: config.database.host,
    user: config.database.user,
    password: config.database.password,
    database: config.database.name,
    waitForConnections: true,
    connectionLimit: config.database.connectionLimit,
    queueLimit: 0,
    enableKeepAlive: true,
    keepAliveInitialDelay: 0
}).promise();

// Database helper functions
const db = {
    query: async (sql, params) => {
        try {
            const [results] = await pool.query(sql, params);
            return results;
        } catch (error) {
            logger.error('Database query error:', { sql, error: error.message });
            throw error;
        }
    },

    transaction: async (callback) => {
        const connection = await pool.getConnection();
        await connection.beginTransaction();

        try {
            const result = await callback(connection);
            await connection.commit();
            return result;
        } catch (error) {
            await connection.rollback();
            throw error;
        } finally {
            connection.release();
        }
    }
};

module.exports = db;
