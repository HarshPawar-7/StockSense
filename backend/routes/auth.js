const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');

// Register new user
router.post('/register', authController.register);

// Login user
router.post('/login', authController.login);

// Protected test route
router.get('/test', authController.verifyToken, (req, res) => {
  res.json({ message: 'Protected route accessed successfully' });
});

module.exports = router;