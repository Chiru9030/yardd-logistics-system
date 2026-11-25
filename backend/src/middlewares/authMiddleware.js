const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET || 'yardd_secure_default_secret_key_2026';

function authenticate(req, res, next) {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ success: false, message: 'Authentication required. Missing Bearer token.' });
    }

    const token = authHeader.split(' ')[1];
    try {
        const decoded = jwt.verify(token, JWT_SECRET);
        req.user = decoded;
        next();
    } catch (err) {
        return res.status(401).json({ success: false, message: 'Invalid or expired token.' });
    }
}

function authorize(...roles) {
    return (req, res, next) => {
        if (!req.user || !roles.includes(req.user.role)) {
            return res.status(403).json({
                success: false,
                message: `Forbidden: role '${req.user?.role || 'anonymous'}' is not authorized. Required: ${roles.join(', ')}`
            });
        }
        next();
    };
}

module.exports = { authenticate, authorize, JWT_SECRET };
