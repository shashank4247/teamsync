const Board = require('../models/Board');
const Issue = require('../models/Issue');

exports.createBoard = async (req, res) => {
  const { name, description } = req.body;
  try {
    const board = new Board({ name, description, owner: req.user.id, members: [req.user.id] });
    await board.save();
    res.status(201).json(board);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.getBoards = async (req, res) => {
  try {
    const boards = await Board.find({ members: req.user.id }).sort({ createdAt: -1 });
    res.json(boards);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

exports.getBoardById = async (req, res) => {
  try {
    const board = await Board.findById(req.params.id);
    if (!board) return res.status(404).json({ message: 'Board not found' });
    const issues = await Issue.find({ boardId: board._id }).sort({ order: 1, createdAt: 1 });
    res.json({ board, issues });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};
