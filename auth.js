// auth.js - Authentication middleware and utilities
require('dotenv').config(); // Add this line

const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

// Use environment variables for security
const JWT_SECRET = process.env.JWT_SECRET || 'maher_chinese_admin_secret_key_2024';
const ADMIN_USERNAME = process.env.ADMIN_USERNAME || 'admin';
const ADMIN_PASSWORD_HASH = process.env.ADMIN_PASSWORD_HASH || '$2a$10$lf5FrMs6XPI84amlaVXtPuCPk8bcY96lrx/3Qyy3pVX5MCwKeN68G';

const ADMIN_CREDENTIALS = {
    username: ADMIN_USERNAME,
    password: ADMIN_PASSWORD_HASH
};

// Generate JWT token
function generateToken(payload) {
    return jwt.sign(payload, JWT_SECRET, { expiresIn: '24h' });
}

// Verify JWT token
function verifyToken(token) {
    try {
        return jwt.verify(token, JWT_SECRET);
    } catch (error) {
        return null;
    }
}

// Hash password (for initial setup)
async function hashPassword(password) {
    return await bcrypt.hash(password, 10);
}

// Verify password
async function verifyPassword(password, hashedPassword) {
    return await bcrypt.compare(password, hashedPassword);
}

// Authentication middleware
function authenticateToken(req, res, next) {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

    if (!token) {
        return res.status(401).json({ error: 'Access token required' });
    }

    const decoded = verifyToken(token);
    if (!decoded) {
        return res.status(403).json({ error: 'Invalid or expired token' });
    }

    req.user = decoded;
    next();
}

module.exports = {
    generateToken,
    verifyToken,
    hashPassword,
    verifyPassword,
    authenticateToken,
    ADMIN_CREDENTIALS,
    JWT_SECRET
};
