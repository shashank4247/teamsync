const WorkflowRule = require('../models/WorkflowRule');
const Issue = require('../models/Issue');
const ActivityLog = require('../models/ActivityLog');

// Helper to log automation activity
async function logAutomation(issueId, ruleName, actionDetails) {
    try {
        await ActivityLog.create({
            issueId,
            userId: null, // System action
            action: 'automation',
            details: { rule: ruleName, ...actionDetails }
        });
    } catch (e) {
        console.error('Automation log error:', e);
    }
}

// Evaluate rules for a specific trigger and issue
exports.evaluateRules = async (issue, trigger) => {
    try {
        const rules = await WorkflowRule.find({ trigger, enabled: true });

        for (const rule of rules) {
            let match = false;
            const { field, operator, value } = rule.condition;
            const issueValue = issue[field];

            // Simple comparison logic
            if (operator === 'equals') {
                match = String(issueValue) === String(value);
            } else if (operator === 'not_equals') {
                match = String(issueValue) !== String(value);
            }

            if (match) {
                console.log(`Rule "${rule.name}" matched for issue ${issue._id}`);

                // Perform Action
                const updates = {};
                if (rule.action.type === 'assign') {
                    updates.assignee = rule.action.value;
                } else if (rule.action.type === 'move') {
                    updates.status = rule.action.value;
                } else if (rule.action.type === 'set_priority') {
                    updates.priority = rule.action.value;
                }

                if (Object.keys(updates).length > 0) {
                    await Issue.findByIdAndUpdate(issue._id, updates);
                    await logAutomation(issue._id, rule.name, { action: rule.action.type, updates });
                    console.log(`Applied action ${rule.action.type} to issue ${issue._id}`);
                }
            }
        }
    } catch (err) {
        console.error("Error evaluating workflow rules:", err);
    }
};

// CRUD Controllers
exports.getRules = async (req, res) => {
    try {
        const rules = await WorkflowRule.find().sort({ createdAt: -1 });
        res.json(rules);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

exports.createRule = async (req, res) => {
    try {
        const rule = new WorkflowRule({ ...req.body, createdBy: req.user.id });
        await rule.save();
        res.status(201).json(rule);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
};

exports.updateRule = async (req, res) => {
    try {
        const rule = await WorkflowRule.findByIdAndUpdate(req.params.id, req.body, { new: true });
        res.json(rule);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
};

exports.deleteRule = async (req, res) => {
    try {
        await WorkflowRule.findByIdAndDelete(req.params.id);
        res.json({ message: 'Rule deleted' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};
