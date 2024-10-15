const mongoose = require('mongoose');

const actionHistorySchema = new mongoose.Schema({
    device: String,
    action: String,
    timestamp: { type: Date, default: Date.now }
});

const ActionHistory = mongoose.model('ActionHistory', actionHistorySchema);

module.exports = ActionHistory;
