const store = require('../services/storeService');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { JWT_SECRET } = require('../middlewares/authMiddleware');

exports.register = async (req, res) => {
    try {
        const { email, password, role = 'BUYER', name } = req.body;
        if (!email || !password) {
            return res.status(400).json({ success: false, message: 'Email and password are required.' });
        }

        const existing = await store.findUserByEmail(email);
        if (existing) {
            return res.status(409).json({ success: false, message: 'User with this email already exists.' });
        }

        const password_hash = await bcrypt.hash(password, 10);
        const newUser = await store.createUser({
            email,
            password_hash,
            role,
            name: name || email.split('@')[0]
        });

        const token = jwt.sign(
            { id: newUser.id, email: newUser.email, role: newUser.role, name: newUser.name },
            JWT_SECRET,
            { expiresIn: '7d' }
        );

        res.status(201).json({
            success: true,
            message: 'User registered successfully',
            token,
            user: { id: newUser.id, email: newUser.email, role: newUser.role, name: newUser.name }
        });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};

exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            return res.status(400).json({ success: false, message: 'Email and password are required.' });
        }

        const user = await store.findUserByEmail(email);
        if (!user) {
            return res.status(401).json({ success: false, message: 'Invalid credentials.' });
        }

        const match = await bcrypt.compare(password, user.password_hash);
        if (!match) {
            return res.status(401).json({ success: false, message: 'Invalid credentials.' });
        }

        const token = jwt.sign(
            { id: user.id, email: user.email, role: user.role, name: user.name },
            JWT_SECRET,
            { expiresIn: '7d' }
        );

        res.json({
            success: true,
            message: 'Authentication successful',
            token,
            user: { id: user.id, email: user.email, role: user.role, name: user.name }
        });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};

exports.getMe = async (req, res) => {
    try {
        const user = await store.findUserById(req.user.id);
        if (!user) return res.status(404).json({ success: false, message: 'User not found' });
        res.json({
            success: true,
            user: { id: user.id, email: user.email, role: user.role, name: user.name }
        });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};
