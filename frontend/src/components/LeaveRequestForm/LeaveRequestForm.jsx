import React, { useState } from 'react';
import axios from 'axios';
import './LeaveRequestForm.css';

const LeaveRequestForm = () => {
    const [leaveType, setLeaveType] = useState('');
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [reason, setReason] = useState('');
    const [isOffDay, setIsOffDay] = useState(false);
    const [statusMessage, setStatusMessage] = useState('');
    const emp_id = localStorage.getItem('emp_id'); // Adjust this if it's stored somewhere else

    const handleSubmit = async (e) => {
        e.preventDefault();

        const leaveRequestData = {
            emp_id,
            leaveType,
            from_date: startDate,
            to_date: isOffDay ? startDate : endDate,
            reason
        };

        const token = localStorage.getItem('authToken');

        try {
            const response = await axios.post(
                'http://localhost:8081/api/leave/request',
                leaveRequestData,
                { headers: { Authorization: token } }  // Send token in the headers
            );
            setStatusMessage(response.data.message);
        } catch (error) {
            setStatusMessage('Failed to submit leave request. Please try again.');
        }
    };


    return (
        <form className="leave-request-form" onSubmit={handleSubmit}>
            <div className="form-header">
                <h2>Leave Request Form</h2>
                <div className="leave-counts">
                    <div className="leave-count casual">
                        <h3>Casual Leave</h3>
                        <p>Used: 8 | Total: 10</p>
                        <p className="remaining">Remaining: 2</p>
                    </div>
                    <div className="leave-count sick">
                        <h3>Sick Leave</h3>
                        <p>Used: 2 | Total: 15</p>
                        <p className="remaining">Remaining: 13</p>
                    </div>
                </div>
            </div>

            <div className="form-group">
                <label>Select Leave Type</label>
                <select value={leaveType} onChange={(e) => setLeaveType(e.target.value)} required>
                    <option value="">Please Select</option>
                    <option value="Sick Leave">Sick Leave</option>
                    <option value="Casual Leave">Casual Leave</option>
                </select>
            </div>

            <div className="form-group">
                <label>Start Date of Leave</label>
                <div className="date-and-checkbox">
                    <input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} required />
                    <label className="off-day-label">
                        <input
                            type="checkbox"
                            checked={isOffDay}
                            onChange={(e) => {
                                setIsOffDay(e.target.checked);
                                if (e.target.checked) setEndDate('');
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
                    required={!isOffDay}
                    disabled={isOffDay}
                />
            </div>

            <div className="form-group">
                <label>Reason for Leave</label>
                <textarea value={reason} onChange={(e) => setReason(e.target.value)} rows="4" required />
            </div>

            {/* Display status message above submit button */}
            {statusMessage && (
                <div className="status-message">{statusMessage}</div>
            )}

            <button type="submit" className="submit-button">Submit</button>
        </form>
    );
};

export default LeaveRequestForm;
