/*const mongoose = require('mongoose');

const commentSchema = new mongoose.Schema({
  issueId: { type: mongoose.Schema.Types.ObjectId, ref: 'Issue', index: true },
  author: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  text: { type: String, required: true },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Comment', commentSchema);*/
const mongoose = require("mongoose");

const CommentSchema = new mongoose.Schema(
  {
    issueId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Issue",
      required: true,
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    text: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Comment", CommentSchema);
