// routes/leaveRoutes.js

const express = require('express');
const router = express.Router();
const leaveRequestController = require('../controllers/leaveController');
const authenticate = require('../middleware/authMiddleware');

router.post('/request', authenticate, leaveRequestController.createLeaveRequest);

module.exports = router;
