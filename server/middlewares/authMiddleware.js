// server/middlewares/authMiddleware.js
const jwt = require('jsonwebtoken');
const JWT_SECRET = process.env.JWT_SECRET || 'dev_secret';

module.exports = (req, res, next) => {
  const authHeader = req.headers.authorization || '';
  const token = authHeader.startsWith('Bearer ') ? authHeader.split(' ')[1] : null;
  if (!token) return res.status(401).json({ message: 'No token' });

  try {
    const payload = jwt.verify(token, JWT_SECRET);
    req.user = payload; // { id, email, iat, exp }
    next();
  } catch (err) {
    return res.status(401).json({ message: 'Invalid token' });
  }
};
