// models/leaveRequestModel.js

const db = require('../config/db');

const createLeaveRequest = (leaveRequestData, callback) => {
    const { emp_id, leave_type, from_date, to_date, reason_for_leave } = leaveRequestData;
    const query = `
        INSERT INTO LeaveRequest (emp_id, leave_type, from_date, to_date, reason_for_leave, status)
        VALUES (?, ?, ?, ?, ?, 'Pending')
    `;
    
    // Pass the callback function correctly
    db.query(query, [emp_id, leave_type, from_date, to_date, reason_for_leave], callback);
};

module.exports = { createLeaveRequest };
