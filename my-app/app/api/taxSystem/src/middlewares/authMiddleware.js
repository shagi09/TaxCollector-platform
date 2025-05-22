const { verifyToken } = require('../utils/jwt');

exports.authMiddleware = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Authorization token missing or malformed' });
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = verifyToken(token);
    req.user = decoded;
    next();
  } catch (err) {
    return res.status(401).json({ error: 'Invalid or expired token' });
  }
};

// middleware/authMiddleware.js
exports.verifyCityOfficial = (req, res, next) => {
  const user = req.user;
  if (user && user.role === 'official') {
    return next();
  }
  return res.status(403).json({ error: 'Access denied. Officials only.' });
};


