const express = require('express');
const router = express.Router();
const stockController = require('../controllers/stockController');
const authController = require('../controllers/authController');

// Get stock recommendations
router.post('/recommend', authController.verifyToken, stockController.getRecommendations);

module.exports = router;