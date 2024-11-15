// routes/leaveRequestRoutes.js
const express = require('express');
const router = express.Router();
const leaveRequestController = require('../controllers/leaveRequestController');
const authenticate = require('../middleware/authMiddleware');

router.post('/request', authenticate, leaveRequestController.createLeaveRequest);
router.get('/all', authenticate, leaveRequestController.getAllLeaveRequests);
router.post('/update-status', authenticate, leaveRequestController.updateLeaveStatus);
router.get('/balances', authenticate, leaveRequestController.getLeaveBalances);

module.exports = router;