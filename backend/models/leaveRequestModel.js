// models/leaveRequestModel.js

const db = require('../config/db');

const createLeaveRequest = (leaveRequestData, callback) => {
    // First get a new leave_id (you might want to use auto-increment in MySQL instead)
    const getMaxIdQuery = 'SELECT MAX(leave_id) as maxId FROM LeaveRequest';
    
    db.query(getMaxIdQuery, (err, results) => {
        if (err) return callback(err);
        
        const newLeaveId = (results[0].maxId || 0) + 1;
        const { emp_id, leave_type, from_date, to_date, reason_for_leave } = leaveRequestData;
        
        const insertQuery = `
            INSERT INTO LeaveRequest (
                leave_id, emp_id, leave_type, from_date, to_date, 
                reason_for_leave, status, created_at
            )
            VALUES (?, ?, ?, ?, ?, ?, 'Pending', CURRENT_TIMESTAMP)
        `;
        
        db.query(
            insertQuery,
            [newLeaveId, emp_id, leave_type, from_date, to_date, reason_for_leave],
            callback
        );
    });
};

const getAllLeaveRequests = (callback) => {
    const query = `
        SELECT 
            lr.leave_id,
            lr.emp_id,
            m.emp_name,
            lr.leave_type,
            lr.from_date,
            lr.to_date,
            lr.status,
            lr.reason_for_leave,
            lr.reason_for_reject,
            lr.created_at,
            m.sick_leave as remaining_sick_leave,
            m.casual_leave as remaining_casual_leave
        FROM LeaveRequest lr
        JOIN Master m ON lr.emp_id = m.emp_id
        ORDER BY lr.created_at DESC
    `;
    
    db.query(query, callback);
};

const updateLeaveStatus = (leaveId, status, rejectionReason, callback) => {
    // First get the leave request details to update leave balances
    const getLeaveQuery = `
        SELECT lr.*, m.sick_leave, m.casual_leave 
        FROM LeaveRequest lr
        JOIN Master m ON lr.emp_id = m.emp_id
        WHERE lr.leave_id = ?
    `;
    
    db.query(getLeaveQuery, [leaveId], (err, results) => {
        if (err) return callback(err);
        if (!results.length) return callback(new Error('Leave request not found'));
        
        const leaveRequest = results[0];
        
        // Calculate days between from_date and to_date
        const fromDate = new Date(leaveRequest.from_date);
        const toDate = new Date(leaveRequest.to_date);
        const days = Math.ceil((toDate - fromDate) / (1000 * 60 * 60 * 24)) + 1;
        
        if (status === 'Approved') {
            // Update leave balances in Master table
            const updateBalanceQuery = `
                UPDATE Master 
                SET ${leaveRequest.leave_type === 'Sick Leave' ? 'sick_leave' : 'casual_leave'} = 
                    ${leaveRequest.leave_type === 'Sick Leave' ? 'sick_leave' : 'casual_leave'} - ?
                WHERE emp_id = ?
            `;
            
            db.query(updateBalanceQuery, [days, leaveRequest.emp_id], (err) => {
                if (err) return callback(err);
                
                // Update leave request status
                const updateStatusQuery = `
                    UPDATE LeaveRequest 
                    SET status = ?, reason_for_reject = NULL
                    WHERE leave_id = ?
                `;
                
                db.query(updateStatusQuery, [status, leaveId], callback);
            });
        } else {
            // Just update the status and rejection reason
            const updateStatusQuery = `
                UPDATE LeaveRequest 
                SET status = ?, reason_for_reject = ?
                WHERE leave_id = ?
            `;
            
            db.query(updateStatusQuery, [status, rejectionReason, leaveId], callback);
        }
    });
};

const getLeaveBalances = (empId, callback) => {
    const query = `
        SELECT sick_leave, casual_leave
        FROM Master
        WHERE emp_id = ?
    `;
    
    db.query(query, [empId], callback);
};

module.exports = { 
    createLeaveRequest, 
    getAllLeaveRequests, 
    updateLeaveStatus,
    getLeaveBalances
};
