const express = require('express');
const router = express.Router();
const auth = require('../middlewares/authMiddleware');
const workflowController = require('../controllers/workflowController');

router.get('/', auth, workflowController.getRules);
router.post('/', auth, workflowController.createRule);
router.patch('/:id', auth, workflowController.updateRule);
router.delete('/:id', auth, workflowController.deleteRule);

module.exports = router;
