const authenticate = require('../middleware/authMiddleware');
const leaveRequestModel = require('../models/leaveModel');

exports.createLeaveRequest = (req, res) => {
    const { leaveType, from_date, to_date, reason } = req.body;
    const emp_id = req.user.emp_id;  // Get emp_id from the authenticated user

    const leaveRequestData = {
        emp_id,
        leave_type: leaveType,
        from_date,
        to_date,
        reason_for_leave: reason
    };

    leaveRequestModel.createLeaveRequest(leaveRequestData, (err, result) => {
        if (err) {
            return res.status(500).json({ message: 'Failed to submit leave request' });
        }
        res.status(200).json({ message: 'Leave request submitted successfully' });
    });
};
