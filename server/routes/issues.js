const express = require('express');
const router = express.Router();
const auth = require('../middlewares/authMiddleware');
const issues = require('../controllers/issuesController');

// 🟢 GET ALL ISSUES OF A BOARD (THE ROUTE YOU WERE MISSING)
router.get('/board/:boardId', auth, issues.getBoardIssues);

// CREATE ISSUE
router.post('/', auth, issues.createIssue);

// UPDATE ISSUE
router.patch('/:id', auth, issues.updateIssue);

// MOVE ISSUE
router.post('/:id/move', auth, issues.moveIssue);

// DELETE ISSUE
router.delete('/:id', auth, issues.deleteIssue);

// GET ACTIVITY LOGS
router.get('/:id/activity', auth, issues.getIssueActivity);

module.exports = router;
