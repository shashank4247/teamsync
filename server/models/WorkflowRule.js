const mongoose = require('mongoose');

const WorkflowRuleSchema = new mongoose.Schema({
    name: { type: String, required: true },
    trigger: { type: String, enum: ['create', 'update'], required: true },
    condition: {
        field: { type: String, required: true }, // e.g., 'priority', 'status'
        operator: { type: String, enum: ['equals', 'not_equals'], default: 'equals' },
        value: { type: String, required: true }
    },
    action: {
        type: { type: String, enum: ['assign', 'move', 'set_priority'], required: true },
        value: { type: String, required: true } // userId, status, or priority value
    },
    enabled: { type: Boolean, default: true },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
}, { timestamps: true });

module.exports = mongoose.model('WorkflowRule', WorkflowRuleSchema);
