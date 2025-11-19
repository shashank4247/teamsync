/*const express = require('express');
const router = express.Router();
const auth = require('../middlewares/authMiddleware');
const comments = require('../controllers/commentsController');

router.post('/', auth, comments.addComment);
router.get('/:issueId', auth, comments.getComments);

module.exports = router;*/
const express = require("express");
const Comment = require("../models/Comment");
const authMiddleware = require("../middlewares/authMiddleware");

const router = express.Router();

// GET comments for an issue
router.get("/:issueId", authMiddleware, async (req, res) => {
  try {
    const comments = await Comment.find({ issueId: req.params.issueId })
      .populate("userId", "name")
      .sort({ createdAt: 1 });

    res.json(comments);
  } catch (err) {
    res.status(500).json({ message: "Failed to load comments" });
  }
});

// CREATE comment
router.post("/", authMiddleware, async (req, res) => {
  try {
    const comment = await Comment.create({
      issueId: req.body.issueId,
      userId: req.user.id,
      text: req.body.text,
    });

    res.status(201).json(comment);
  } catch (err) {
    res.status(500).json({ message: "Failed to add comment" });
  }
});

// DELETE comment
router.delete("/:id", authMiddleware, async (req, res) => {
  try {
    await Comment.findByIdAndDelete(req.params.id);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ message: "Failed to delete comment" });
  }
});

module.exports = router;

