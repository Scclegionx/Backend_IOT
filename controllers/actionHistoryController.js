const ActionHistory = require('../models/actionHistoryModel');

// Sort theo timestamp
exports.sortByTimestamp = async (req, res) => {
    try {
        const { order = 'asc' } = req.query;
        const sortOrder = order === 'desc' ? -1 : 1;

        const actionHistories = await ActionHistory.find().sort({ timestamp: sortOrder });
        res.json(actionHistories);
    } catch (error) {
        res.status(500).json({ error: 'Failed to sort by timestamp' });
    }
};
