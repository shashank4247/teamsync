const mongoose = require('mongoose');

const issueSchema = new mongoose.Schema({
  boardId: { type: mongoose.Schema.Types.ObjectId, ref: 'Board', index: true },
  title: { type: String, required: true },
  description: String,
  tags: { type: [String], default: [] },
  status: { type: String, enum: ['todo','in-progress','done'], default: 'todo' },
  priority: { type: String, enum: ['low','medium','high'], default: 'medium' },
  assignee: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null },
  order: { type: Number, default: 0 },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

issueSchema.pre('save', function(next){
  this.updatedAt = Date.now();
  next();
});

module.exports = mongoose.model('Issue', issueSchema);
