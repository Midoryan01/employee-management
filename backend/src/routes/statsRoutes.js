// File: src/routes/statsRoutes.js
const express = require('express');
const router = express.Router();
const employeeController = require('../controllers/employeeController');

// Cukup '/' karena di index.js sudah ada '/api/stats'
router.get('/', employeeController.getStats); 

module.exports = router;