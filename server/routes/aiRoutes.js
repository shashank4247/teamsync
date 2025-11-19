const express = require('express');
const router = express.Router();
const aiController = require('../controllers/aiController');

router.post('/analyze', aiController.analyzeIssue);
router.post('/suggest', aiController.aiSuggest);

module.exports = router;
