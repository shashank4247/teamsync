// server/controllers/issuesController.js
const Issue = require('../models/Issue');
const Comment = require('../models/Comment');
const ActivityLog = require('../models/ActivityLog');
const { evaluateRules } = require('./workflowController');

// helper to emit if socket available
function emit(req, event, payload) {
  try {
    const io = req.app.get('io');
    if (io && payload && payload.boardId) io.to(`board:${payload.boardId}`).emit(event, payload);
  } catch (e) {
    console.error('emit error', e.message);
  }
}

// Helper to create log
async function logActivity(issueId, userId, action, details = {}) {
  try {
    await ActivityLog.create({ issueId, userId, action, details });
  } catch (e) {
    console.error('ActivityLog error:', e.message);
  }
}

exports.getBoardIssues = async (req, res) => {
  try {
    const { boardId } = req.params;

    const list = await Issue.find({ boardId })
      .populate('assignee', 'name email')
      .sort({ order: 1 })
      .lean();

    res.json(list);
  } catch (err) {
    console.error("getBoardIssues", err);
    res.status(500).json({ message: "Server error" });
  }
};

exports.createIssue = async (req, res) => {
  try {
    const { boardId, title, description, priority, assignee, status } = req.body;
    const max = await Issue.findOne({ boardId, status }).sort({ order: -1 }).select('order').lean();
    const order = max ? max.order + 1 : 1;
    const issue = new Issue({
      boardId,
      title,
      description,
      priority: priority || 'medium',
      assignee: assignee || null,
      status: status || 'todo',
      order,
      createdBy: req.user.id
    });
    await issue.save();

    // populate minimal user fields if needed (optional)
    const out = await Issue.findById(issue._id).populate('assignee', 'name email').lean();

    // Log creation
    await logActivity(issue._id, req.user.id, 'created', { after: { title, status, priority } });

    // Trigger Automation
    evaluateRules(out, 'create');

    // emit to board room
    emit(req, 'issue-created', out);

    res.status(201).json(out);
  } catch (err) {
    console.error('createIssue', err);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.updateIssue = async (req, res) => {
  try {
    const { id } = req.params;
    const delta = req.body;

    const oldIssue = await Issue.findById(id).lean();
    if (!oldIssue) return res.status(404).json({ message: 'Issue not found' });

    const issue = await Issue.findByIdAndUpdate(id, delta, { new: true }).populate('assignee', 'name email').lean();

    // Log updates
    const changes = {};
    for (const key in delta) {
      if (JSON.stringify(oldIssue[key]) !== JSON.stringify(issue[key])) {
        changes[key] = { from: oldIssue[key], to: issue[key] };
      }
    }

    if (Object.keys(changes).length > 0) {
      await logActivity(issue._id, req.user.id, 'updated', { changes });
    }

    // Trigger Automation
    evaluateRules(issue, 'update');

    // emit update
    emit(req, 'issue-updated', issue);

    res.json(issue);
  } catch (err) {
    console.error('updateIssue', err);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.moveIssue = async (req, res) => {
  try {
    const { id } = req.params;
    const { toStatus, toOrder } = req.body;
    const issue = await Issue.findById(id);
    if (!issue) return res.status(404).json({ message: 'Issue not found' });

    const oldStatus = issue.status;
    issue.status = toStatus;
    issue.order = toOrder;
    await issue.save();

    const out = await Issue.findById(id).populate('assignee', 'name email').lean();

    if (oldStatus !== toStatus) {
      await logActivity(id, req.user.id, 'moved', { before: { status: oldStatus }, after: { status: toStatus } });
    }

    // emit move event (clients can refresh or update)
    emit(req, 'issue-moved', { issueId: out._id, boardId: out.boardId, toStatus, toOrder, issue: out });

    res.json(out);
  } catch (err) {
    console.error('moveIssue', err);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.deleteIssue = async (req, res) => {
  try {
    const issue = await Issue.findByIdAndDelete(req.params.id).lean();
    if (!issue) return res.status(404).json({ message: 'Issue not found' });

    // remove comments (optional)
    await Comment.deleteMany({ issueId: issue._id });

    // emit delete
    emit(req, 'issue-deleted', { issueId: issue._id, boardId: issue.boardId });

    res.json({ message: 'Deleted', issueId: issue._id });
  } catch (err) {
    console.error('deleteIssue', err);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.getIssueActivity = async (req, res) => {
  try {
    const { id } = req.params;
    const logs = await ActivityLog.find({ issueId: id })
      .populate('userId', 'name email')
      .sort({ timestamp: -1 })
      .lean();
    res.json(logs);
  } catch (err) {
    console.error('getIssueActivity', err);
    res.status(500).json({ message: 'Server error' });
  }
};
