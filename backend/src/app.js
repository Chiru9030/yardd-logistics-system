const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
require('dotenv').config();

const authRoutes = require('./routes/authRoutes');
const landRoutes = require('./routes/landRoutes');
const transactionRoutes = require('./routes/transactionRoutes');
const statsRoutes = require('./routes/statsRoutes');

const app = express();

// Security & Parsing Middleware
app.use(helmet());
app.use(cors({ origin: '*' }));
app.use(express.json());
app.use(morgan('dev'));

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/lands', landRoutes);
app.use('/api/transactions', transactionRoutes);
app.use('/api/stats', statsRoutes);

// Health & Info Endpoint
app.get('/api/health', (req, res) => {
    res.json({
        status: 'UP',
        service: 'Yardd Smart Logistics Platform API',
        timestamp: new Date(),
        version: '1.2.0'
    });
});

app.get('/', (req, res) => {
    res.json({
        message: 'Yardd Smart Logistics & Yard Management API is running.',
        docs: '/api/health',
        endpoints: ['/api/auth', '/api/lands', '/api/transactions', '/api/stats']
    });
});

// 404 Handler
app.use((req, res) => {
    res.status(404).json({ success: false, message: 'Resource not found' });
});

// Error Handler
app.use((err, req, res, next) => {
    console.error('Unhandled Server Error:', err);
    res.status(500).json({ success: false, message: err.message || 'Internal Server Error' });
});

const PORT = process.env.PORT || 5000;

if (require.main === module) {
    app.listen(PORT, () => {
        console.log(`🚀 Yardd Backend API running on port ${PORT}`);
    });
}

module.exports = app;
