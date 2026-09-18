const express = require('express');
const { chatWithAI } = require('../controllers/aiController');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

const router = express.Router();

// Middleware to attach user if token present (optional auth)
const optionalAuth = async (req, res, next) => {
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    const token = req.headers.authorization.split(' ')[1];
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET || 'argoconnect_super_secret_jwt_key_2026_change_in_production');
      req.user = await User.findById(decoded.id).select('-password');
    } catch (e) {
      // ignore invalid token in optional auth
    }
  }
  next();
};

router.post('/chat', optionalAuth, chatWithAI);

module.exports = router;
