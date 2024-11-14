// routes/leaveRequestRoutes.js

const express = require('express');
const router = express.Router();
const leaveRequestController = require('../controllers/leaveRequestController');
const authenticate = require('../middleware/authMiddleware');

router.post('/request', authenticate, leaveRequestController.createLeaveRequest);

module.exports = router;
