/*const Comment = require('../models/Comment');

exports.addComment = async (req, res) => {
  try {
    const { issueId, text } = req.body;
    const comment = new Comment({ issueId, text, author: req.user.id });
    await comment.save();
    res.status(201).json(comment);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

exports.getComments = async (req, res) => {
  try {
    const { issueId } = req.params;
    const comments = await Comment.find({ issueId }).sort({ createdAt: 1 }).populate('author', 'name');
    res.json(comments);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};*/
// server/controllers/commentsController.js
const Comment = require('../models/Comment');

function emit(req, event, payload) {
  try {
    const io = req.app.get('io');
    if (io && payload && payload.issueId) io.to(`board:${payload.boardId}`).emit(event, payload);
  } catch (e) {
    console.error('emit error', e.message);
  }
}

exports.addComment = async (req, res) => {
  try {
    const { issueId, text } = req.body;
    // require text
    if (!text || !text.trim()) return res.status(400).json({ message: 'Comment text required' });

    const comment = new Comment({ issueId, text, author: req.user.id });
    await comment.save();

    // populate author name for frontend convenience
    const out = await Comment.findById(comment._id).populate('author', 'name').lean();

    // emit to board room - we need boardId: fetch issue's boardId
    // optional: comment model doesn't store boardId, so client should include boardId in request body or we can populate it via Issue lookup.
    // For simplicity, expect client to include boardId in the request body (we will send it from frontend).
    const boardId = req.body.boardId;
    emit(req, 'comment-added', { ...out, boardId });

    res.status(201).json(out);
  } catch (err) {
    console.error('addComment', err);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.getComments = async (req, res) => {
  try {
    const { issueId } = req.params;
    const comments = await Comment.find({ issueId }).sort({ createdAt: 1 }).populate('author', 'name').lean();
    res.json(comments);
  } catch (err) {
    console.error('getComments', err);
    res.status(500).json({ message: 'Server error' });
  }
};

