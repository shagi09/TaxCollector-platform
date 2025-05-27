const { verifyToken } = require('../utils/jwt');

exports.isLogin = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Authorization token missing or malformed' });
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = verifyToken(token);
    req.user = decoded;
    req.user._id = req.user.id
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

exports.verifyAuditor = (req, res, next) => {
  try {
    const user = req.user;

    if (!user) {
      return res.status(401).json({ message: 'Unauthorized. User not found.' });
    }

    if (user.role !== 'auditor') {
      return res.status(403).json({ message: 'Forbidden. Only auditors are allowed.' });
    }

    next();
  } catch (error) {
    console.error('Auditor verification error:', error);
    return res.status(500).json({ message: 'Server error during auditor verification' });
  }
};




