// server/controllers/authController.js
const { validationResult } = require('express-validator');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

const JWT_SECRET = process.env.JWT_SECRET || 'dev_secret';
const SALT_ROUNDS = 10;

exports.register = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

  const { name, email, password } = req.body;
  try {
    const existing = await User.findOne({ email });
    if (existing) return res.status(400).json({ message: 'Email already registered' });

    const passwordHash = await bcrypt.hash(password, SALT_ROUNDS);
    const user = new User({ name, email, passwordHash });
    await user.save();

    const token = jwt.sign({ id: user._id, email: user.email }, JWT_SECRET, { expiresIn: '7d' });
    res.status(201).json({
      user: { id: user._id, name: user.name, email: user.email, role: user.role },
      token,
    });
  } catch (err) {
    console.error('Register error', err);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.login = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: 'Invalid credentials' });

    const match = await bcrypt.compare(password, user.passwordHash);
    if (!match) return res.status(400).json({ message: 'Invalid credentials' });

    const token = jwt.sign({ id: user._id, email: user.email }, JWT_SECRET, { expiresIn: '7d' });
    res.json({
      user: { id: user._id, name: user.name, email: user.email, role: user.role },
      token,
    });
  } catch (err) {
    console.error('Login error', err);
    res.status(500).json({ message: 'Server error' });
  }
};
