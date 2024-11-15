// controllers/leaveRequestController.js

const leaveRequestModel = require('../models/leaveRequestModel');

exports.createLeaveRequest = async (req, res) => {
    console.log('Received leave request:', req.body); // Debug log

    const { leave_type, from_date, to_date, reason_for_leave } = req.body;
    const emp_id = req.user.emp_id;

    // Input validation
    if (!leave_type || !from_date || !to_date || !reason_for_leave) {
        return res.status(400).json({
            message: 'Missing required fields',
            required: ['leave_type', 'from_date', 'to_date', 'reason_for_leave'],
            received: req.body
        });
    }

    // Validate leave type
    if (!['Sick Leave', 'Casual Leave'].includes(leave_type)) {
        return res.status(400).json({
            message: 'Invalid leave type. Must be either "Sick Leave" or "Casual Leave"',
            received: leave_type
        });
    }

    // Validate dates
    const start = new Date(from_date);
    const end = new Date(to_date);

    if (isNaN(start.getTime()) || isNaN(end.getTime())) {
        return res.status(400).json({
            message: 'Invalid date format',
            received: { from_date, to_date }
        });
    }

    if (end < start) {
        return res.status(400).json({
            message: 'End date cannot be before start date',
            received: { from_date, to_date }
        });
    }

    try {
        // Calculate number of days
        const days = Math.ceil((end - start) / (1000 * 60 * 60 * 24)) + 1;

        // Get current leave balances
        leaveRequestModel.getLeaveBalances(emp_id, (err, results) => {
            if (err) {
                console.error('Error fetching leave balances:', err);
                return res.status(500).json({ message: 'Failed to fetch leave balances' });
            }

            if (!results.length) {
                return res.status(404).json({ message: 'Employee not found' });
            }

            const balance = results[0];
            const availableBalance = leave_type === 'Sick Leave' ?
                balance.sick_leave : balance.casual_leave;

            // Check if enough leaves are available
            if (days > availableBalance) {
                return res.status(400).json({
                    message: `Insufficient ${leave_type} balance. Available: ${availableBalance}, Requested: ${days}`,
                    available: availableBalance,
                    requested: days
                });
            }

            // If validation passes, create leave request
            const leaveRequestData = {
                emp_id,
                leave_type,
                from_date,
                to_date,
                reason_for_leave
            };

            leaveRequestModel.createLeaveRequest(leaveRequestData, (err, result) => {
                if (err) {
                    console.error('Error creating leave request:', err);
                    return res.status(500).json({ message: 'Failed to submit leave request' });
                }
                res.status(200).json({
                    message: 'Leave request submitted successfully',
                    remainingBalance: availableBalance - days
                });
            });
        });
    } catch (error) {
        console.error('Error processing leave request:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};
exports.getAllLeaveRequests = (req, res) => {
    leaveRequestModel.getAllLeaveRequests((err, results) => {
        if (err) {
            console.error('Error fetching leave requests:', err);
            return res.status(500).json({ message: 'Failed to fetch leave requests' });
        }
        res.status(200).json(results);
    });
};

exports.updateLeaveStatus = (req, res) => {
    const { leaveId, status, rejectionReason } = req.body;

    // Validate status against ENUM values
    if (!['Approved', 'Rejected'].includes(status)) {
        return res.status(400).json({ message: 'Invalid status' });
    }

    leaveRequestModel.updateLeaveStatus(
        leaveId,
        status,
        rejectionReason,
        (err, result) => {
            if (err) {
                console.error('Error updating leave status:', err);
                return res.status(500).json({ message: 'Failed to update leave status' });
            }
            res.status(200).json({ message: 'Leave status updated successfully' });
        }
    );
};

exports.getLeaveBalances = (req, res) => {
    const emp_id = req.user.emp_id;  // From authentication middleware

    leaveRequestModel.getLeaveBalances(emp_id, (err, results) => {
        if (err) {
            console.error('Error fetching leave balances:', err);
            return res.status(500).json({ message: 'Failed to fetch leave balances' });
        }
        if (!results.length) {
            return res.status(404).json({ message: 'Employee not found' });
        }
        res.status(200).json(results[0]);
    });
};