// routes/leaveRequestRoutes.js

const express = require('express');
const router = express.Router();
const leaveRequestController = require('../controllers/leaveController');

router.post('/request', leaveRequestController.createLeaveRequest);

module.exports = router;
