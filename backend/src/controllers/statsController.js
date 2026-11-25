const store = require('../services/storeService');

exports.getStats = async (req, res) => {
    try {
        const stats = await store.getStats();
        res.json({ success: true, data: stats });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};

exports.getAuditLogs = async (req, res) => {
    try {
        const logs = await store.getAuditLogs();
        res.json({ success: true, count: logs.length, data: logs });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};
