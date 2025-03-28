const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');

// OPTIONS preflight
router.options('/register', (req, res) => {
  res.header('Access-Control-Allow-Methods', 'POST').send();
});

router.options('/login', (req, res) => {
  res.header('Access-Control-Allow-Methods', 'POST').send();
});

// Auth routes
router.post('/register', authController.register);
router.post('/login', authController.login);

module.exports = router;