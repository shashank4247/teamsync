// server/routes/auth.js
const express = require('express');
const { body } = require('express-validator');
const router = express.Router();
const authController = require('../controllers/authController');

// POST /api/auth/register
router.post(
  '/register',
  [
    body('name').notEmpty().withMessage('Name required'),
    body('email').isEmail().withMessage('Valid email required'),
    body('password').isLength({ min: 6 }).withMessage('Password min 6 chars'),
  ],
  authController.register
);

// POST /api/auth/login
router.post(
  '/login',
  [
    body('email').isEmail(),
    body('password').notEmpty(),
  ],
  authController.login
);

module.exports = router;
