// frontend/src/components/LeaveRequestForm/LeaveRequestForm.jsx

import React, { useState } from 'react';
import './LeaveRequestForm.css';

const LeaveRequestForm = () => {
    const [leaveType, setLeaveType] = useState('');
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [reason, setReason] = useState('');
    const [isOffDay, setIsOffDay] = useState(false);

    // State for leave Remaining
    const totalCasualLeaves = 10;
    const usedCasualLeaves = 8;
    const totalSickLeaves = 15;
    const usedSickLeaves = 2;

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log({ leaveType, startDate, endDate, reason, isOffDay });
    };

    return (
        <form className="leave-request-form" onSubmit={handleSubmit}>
            <div className="form-header">
                <h2>Leave Request Form</h2>
                <div className="leave-counts">
                    <div className="leave-count casual">
                        <h3>Casual Leave</h3>
                        <p>Used: {usedCasualLeaves} | Total: {totalCasualLeaves}</p>
                        <p className="remaining">Remaining: {totalCasualLeaves - usedCasualLeaves}</p>
                    </div>
                    <div className="leave-count sick">
                        <h3>Sick Leave</h3>
                        <p>Used: {usedSickLeaves} | Total: {totalSickLeaves}</p>
                        <p className="remaining">Remaining: {totalSickLeaves - usedSickLeaves}</p>
                    </div>
                </div>
            </div>

            <div className="form-group">
                <label>Select Leave Type</label>
                <select
                    value={leaveType}
                    onChange={(e) => setLeaveType(e.target.value)}
                    required
                >
                    <option value="">Please Select</option>
                    <option value="sick">Sick Leave</option>
                    <option value="casual">Casual Leave</option>
                </select>
            </div>

            <div className="form-group">
                <label>Start Date of Leave</label>
                <div className="date-and-checkbox">
                    <input
                        type="date"
                        value={startDate}
                        onChange={(e) => setStartDate(e.target.value)}
                        required
                    />
                    <label className="off-day-label">
                        <input
                            type="checkbox"
                            checked={isOffDay}
                            onChange={(e) => {
                                setIsOffDay(e.target.checked);
                                if (e.target.checked) setEndDate(''); // Clear end date if half day is selected
                            }}
                        />
                        Half day
                    </label>
                </div>
            </div>

            <div className="form-group">
                <label>End Date of Leave</label>
                <input
                    type="date"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    required={!isOffDay}  // Only required if not a half day
                    disabled={isOffDay}    // Disable input if half day is selected
                />
            </div>

            <div className="form-group">
                <label>Reason for Leave</label>
                <textarea
                    value={reason}
                    onChange={(e) => setReason(e.target.value)}
                    rows="4"
                    required
                ></textarea>
            </div>

            <button type="submit" className="submit-button">Submit</button>
        </form>
    );
};

export default LeaveRequestForm;
