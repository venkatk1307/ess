import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './LeaveRequestForm.css';

const LeaveRequestForm = () => {
    const [leaveType, setLeaveType] = useState('');
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [reason, setReason] = useState('');
    const [isOffDay, setIsOffDay] = useState(false);
    const [statusMessage, setStatusMessage] = useState('');
    const [leaveBalances, setLeaveBalances] = useState({ sick_leave: 10, casual_leave: 10 });

    const emp_id = localStorage.getItem('emp_id');

    useEffect(() => {
        fetchLeaveBalances();
    }, []);

    const fetchLeaveBalances = async () => {
        try {
            const token = localStorage.getItem('authToken');
            const response = await axios.get('http://localhost:8081/api/leave/balances', {
                headers: { Authorization: token }
            });
            setLeaveBalances(response.data);
        } catch (error) {
            console.error('Error fetching leave balances:', error);
            setStatusMessage('Failed to fetch leave balances');
        }
    };

    const calculateDays = () => {
        if (!startDate || (!isOffDay && !endDate)) return 0;
        if (isOffDay) return 0.5;

        const start = new Date(startDate);
        const end = new Date(endDate);
        return Math.ceil((end - start) / (1000 * 60 * 60 * 24)) + 1;
    };

    const getAvailableBalance = () => {
        if (!leaveType) return 0;
        return leaveType === 'Sick Leave' ?
            leaveBalances.sick_leave :
            leaveBalances.casual_leave;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const days = calculateDays();
        const availableBalance = getAvailableBalance();

        if (days === 0) {
            setStatusMessage('Please select valid dates');
            return;
        }

        if (days > availableBalance) {
            setStatusMessage(`Insufficient leave balance. Available: ${availableBalance}, Requested: ${days}`);
            return;
        }

        const leaveRequestData = {
            emp_id,
            leave_type: leaveType,
            from_date: startDate,
            to_date: isOffDay ? startDate : endDate,
            reason_for_leave: reason
        };

        const token = localStorage.getItem('authToken');

        try {
            const response = await axios.post(
                'http://localhost:8081/api/leave/request',
                leaveRequestData,
                {
                    headers: {
                        'Authorization': token,
                        'Content-Type': 'application/json'
                    }
                }
            );

            setStatusMessage(response.data.message);

            // Update local leave balances
            setLeaveBalances(prev => ({
                ...prev,
                [leaveType === 'Sick Leave' ? 'sick_leave' : 'casual_leave']:
                    prev[leaveType === 'Sick Leave' ? 'sick_leave' : 'casual_leave'] - days
            }));

            // Reset form
            setLeaveType('');
            setStartDate('');
            setEndDate('');
            setReason('');
            setIsOffDay(false);

            // Refresh leave balances
            fetchLeaveBalances();
        } catch (error) {
            console.error('Leave request error:', error.response?.data || error);
            setStatusMessage(
                error.response?.data?.message ||
                'Failed to submit leave request. Please try again.'
            );
        }
    };

    return (
        <form className="leave-request-form" onSubmit={handleSubmit}>
            <div className="form-header">
                <h2>Leave Request Form</h2>
                <div className="leave-counts">
                    <div className="leave-count sick">
                        <h3>Sick Leave</h3>
                        <p>Available: {leaveBalances.sick_leave}</p>
                    </div>
                    <div className="leave-count casual">
                        <h3>Casual Leave</h3>
                        <p>Available: {leaveBalances.casual_leave}</p>
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
                    <option value="Sick Leave">Sick Leave</option>
                    <option value="Casual Leave">Casual Leave</option>
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
                <textarea
                    value={reason}
                    onChange={(e) => setReason(e.target.value)}
                    rows="4"
                    required
                />
            </div>

            {leaveType && (
                <div className="leave-info">
                    <p>Days requested: {calculateDays()}</p>
                    <p>Available balance: {getAvailableBalance()}</p>
                </div>
            )}

            {statusMessage && (
                <div className="status-message">{statusMessage}</div>
            )}

            <button type="submit" className="submit-button">Submit</button>
        </form>
    );
};

export default LeaveRequestForm;