// controllers/leaveRequestController.js

const leaveRequestModel = require('../models/leaveModel');

exports.createLeaveRequest = (req, res) => {
    const { emp_id, leaveType, from_date, to_date, reason } = req.body;

    const leaveRequestData = {
        emp_id,
        leave_type: leaveType,
        from_date,
        to_date,
        reason_for_leave: reason
    };

    // Use a callback function to handle the query result
    leaveRequestModel.createLeaveRequest(leaveRequestData, (err, result) => {
        if (err) {
            return res.status(500).json({ message: 'Failed to submit leave request' });
        }
        res.status(200).json({ message: 'Leave request submitted successfully' });
    });
};
