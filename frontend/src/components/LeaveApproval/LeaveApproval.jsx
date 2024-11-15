import React, { useState, useEffect } from 'react';
import { format } from 'date-fns';
import axios from 'axios';
import './leaveapproval.css';
const LeaveApprovalPage = () => {
    const [leaveRequests, setLeaveRequests] = useState([]);
    const [rejectReason, setRejectReason] = useState('');
    const [showPopup, setShowPopup] = useState(false);
    const [currentRequest, setCurrentRequest] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [filterStatus, setFilterStatus] = useState('all');
    const [dateRange, setDateRange] = useState('all');

    useEffect(() => {
        fetchLeaveRequests();
    }, []);

    const fetchLeaveRequests = async () => {
        try {
            const token = localStorage.getItem('authToken');
            const response = await axios.get('http://localhost:8081/api/leave/all', {
                headers: { Authorization: token }
            });
            setLeaveRequests(response.data);
            setLoading(false);
        } catch (err) {
            setError('Failed to fetch leave requests');
            setLoading(false);
        }
    };

    const handleApprove = async (leaveId) => {
        try {
            const token = localStorage.getItem('authToken');
            await axios.post(
                'http://localhost:8081/api/leave/update-status',
                {
                    leaveId,
                    status: 'Approved'
                },
                {
                    headers: { Authorization: token }
                }
            );
            fetchLeaveRequests();
        } catch (err) {
            setError('Failed to approve leave request');
        }
    };

    const handleReject = async () => {
        try {
            const token = localStorage.getItem('authToken');
            await axios.post(
                'http://localhost:8081/api/leave/update-status',
                {
                    leaveId: currentRequest.leave_id,
                    status: 'Rejected',
                    rejectionReason: rejectReason
                },
                {
                    headers: { Authorization: token }
                }
            );
            setShowPopup(false);
            setRejectReason('');
            fetchLeaveRequests();
        } catch (err) {
            setError('Failed to reject leave request');
        }
    };

    const filterRequests = (requests) => {
        let filteredRequests = [...requests];

        // Filter by status
        if (filterStatus !== 'all') {
            filteredRequests = filteredRequests.filter(request => request.status === filterStatus);
        }

        // Filter by date range
        const today = new Date();
        switch (dateRange) {
            case 'today':
                filteredRequests = filteredRequests.filter(request =>
                    new Date(request.created_at).toDateString() === today.toDateString()
                );
                break;
            case 'week':
                const weekAgo = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);
                filteredRequests = filteredRequests.filter(request =>
                    new Date(request.created_at) >= weekAgo
                );
                break;
            case 'month':
                const monthAgo = new Date(today.getTime() - 30 * 24 * 60 * 60 * 1000);
                filteredRequests = filteredRequests.filter(request =>
                    new Date(request.created_at) >= monthAgo
                );
                break;
            default:
                break;
        }

        return filteredRequests;
    };

    const getLeaveBadgeClass = (leaveType) => {
        return leaveType === 'Sick Leave' ? 'sick-leave-badge' : 'casual-leave-badge';
    };

    if (loading) return <div>Loading...</div>;
    if (error) return <div className="error-message">{error}</div>;

    const filteredRequests = filterRequests(leaveRequests);

    return (
        <div className="leave-approval-page">
            <h1>Leave Approval Dashboard</h1>

            <div className="filters">
                <div className="filter-group">
                    <label>Status:</label>
                    <select
                        value={filterStatus}
                        onChange={(e) => setFilterStatus(e.target.value)}
                        className="filter-select"
                    >
                        <option value="all">All Status</option>
                        <option value="Pending">Pending</option>
                        <option value="Approved">Approved</option>
                        <option value="Rejected">Rejected</option>
                    </select>
                </div>

                <div className="filter-group">
                    <label>Date Range:</label>
                    <select
                        value={dateRange}
                        onChange={(e) => setDateRange(e.target.value)}
                        className="filter-select"
                    >
                        <option value="all">All Time</option>
                        <option value="today">Today</option>
                        <option value="week">Last Week</option>
                        <option value="month">Last Month</option>
                    </select>
                </div>
            </div>

            <div className="leave-requests-container">
                {filteredRequests.map((request) => (
                    <div className="leave-card" key={request.leave_id}>
                        <div className="user-info">
                            <div className="user-avatar">👤</div>
                            <div className="user-details">
                                <span className="user-name">{request.emp_name}</span>
                                <span className={`leave-type ${getLeaveBadgeClass(request.leave_type)}`}>
                                    {request.leave_type}
                                </span>
                                <div className="leave-dates">
                                    <span>From: {format(new Date(request.from_date), 'MMM dd, yyyy')}</span>
                                    <span>To: {format(new Date(request.to_date), 'MMM dd, yyyy')}</span>
                                </div>
                                <p className="leave-reason">{request.reason_for_leave}</p>
                                <span className="request-date">
                                    Requested on: {format(new Date(request.created_at), 'MMM dd, yyyy')}
                                </span>
                                {request.status !== 'Pending' && (
                                    <span className={`status-badge ${request.status.toLowerCase()}`}>
                                        {request.status}
                                    </span>
                                )}
                                {request.reason_for_reject && (
                                    <p className="rejection-reason">
                                        Rejection reason: {request.reason_for_reject}
                                    </p>
                                )}
                            </div>
                        </div>
                        {request.status === 'Pending' && (
                            <div className="action-buttons">
                                <button
                                    className="reject-button"
                                    onClick={() => {
                                        setCurrentRequest(request);
                                        setShowPopup(true);
                                    }}
                                >
                                    Reject
                                </button>
                                <button
                                    className="approve-button"
                                    onClick={() => handleApprove(request.leave_id)}
                                >
                                    Approve
                                </button>
                            </div>
                        )}
                    </div>
                ))}
                {filteredRequests.length === 0 && (
                    <p className="no-requests">No leave requests found</p>
                )}
            </div>

            {showPopup && (
                <div className="popup-overlay">
                    <div className="popup">
                        <h3>Reject Leave Request</h3>
                        <p>Rejecting leave request for {currentRequest.emp_name}</p>
                        <textarea
                            rows="4"
                            placeholder="Enter reason for rejection"
                            value={rejectReason}
                            onChange={(e) => setRejectReason(e.target.value)}
                            required
                        ></textarea>
                        <div className="popup-buttons">
                            <button
                                className="submit-button"
                                onClick={handleReject}
                                disabled={!rejectReason.trim()}
                            >
                                Submit
                            </button>
                            <button
                                className="cancel-button"
                                onClick={() => {
                                    setShowPopup(false);
                                    setRejectReason('');
                                }}
                            >
                                Cancel
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default LeaveApprovalPage;