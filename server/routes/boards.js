const express = require('express');
const router = express.Router();
const auth = require('../middlewares/authMiddleware');
const boards = require('../controllers/boardsController');

router.post('/', auth, boards.createBoard);
router.get('/', auth, boards.getBoards);
router.get('/:id', auth, boards.getBoardById);

module.exports = router;
