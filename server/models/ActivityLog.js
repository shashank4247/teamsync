const mongoose = require('mongoose');

const ActivityLogSchema = new mongoose.Schema({
    issueId: { type: mongoose.Schema.Types.ObjectId, ref: 'Issue', required: true },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    action: { type: String, required: true }, // 'created', 'updated', 'deleted', 'moved'
    details: {
        before: { type: Object },
        after: { type: Object },
        field: { type: String } // optional, for specific field updates
    },
    timestamp: { type: Date, default: Date.now }
});

module.exports = mongoose.model('ActivityLog', ActivityLogSchema);
