import React, { useState } from 'react';
import './LeaveApproval.css';

const LeaveApprovalPage = () => {
    const [rejectReason, setRejectReason] = useState('');
    const [showPopup, setShowPopup] = useState(false);
    const [currentRequest, setCurrentRequest] = useState(null);

    const leaveRequestsToday = [
        { name: 'Bharath', type: 'Casual Leave', date: '20/10/2024' },
        { name: 'Dinesh', type: 'Sick Leave', date: '20/10/2024' },
        { name: 'John', type: 'Casual Leave', date: '20/10/2024' }
    ];

    const leaveRequestsYesterday = [
        { name: 'Suriya', type: 'Sick Leave', date: '20/10/2024' },
        { name: 'Murali', type: 'Casual Leave', date: '20/10/2024' }
    ];

    const handleApprove = (name) => {
        console.log(`${name}'s leave approved!`);
    };

    const handleRejectClick = (request) => {
        setCurrentRequest(request);
        setShowPopup(true);
    };

    const handleReject = () => {
        console.log(`${currentRequest.name}'s leave rejected! Reason: ${rejectReason}`);
        setRejectReason('');
        setShowPopup(false);
    };

    const handleClosePopup = () => {
        setShowPopup(false);
        setRejectReason('');
    };

    return (
        <div className="leave-approval-page">
            <h1>Leave Approval for Manager</h1>

            <div className="leave-section">
                <h2>Today</h2>
                {leaveRequestsToday.map((request, index) => (
                    <div className={`leave-card ${request.type.replace(' ', '-').toLowerCase()}`} key={index}>
                        <div className="user-info">
                            <div className="user-avatar">👤</div>
                            <div className="user-details">
                                <span className="user-name">{request.name}</span>
                                <span className="leave-type">{request.type}</span>
                                <span className="leave-date">on {request.date}</span>
                            </div>
                        </div>
                        <div>

                            <button className="approve-button reject-button" onClick={() => handleRejectClick(request)}>Reject</button>
                            <button className="approve-button" onClick={() => handleApprove(request.name)}>Approve</button>
                        </div>
                    </div>
                ))}
            </div>

            <div className="leave-section">
                <h2>Yesterday</h2>
                {leaveRequestsYesterday.map((request, index) => (
                    <div className={`leave-card ${request.type.replace(' ', '-').toLowerCase()}`} key={index}>
                        <div className="user-info">
                            <div className="user-avatar">👤</div>
                            <div className="user-details">
                                <span className="user-name">{request.name}</span>
                                <span className="leave-type">{request.type}</span>
                                <span className="leave-date">on {request.date}</span>
                            </div>
                        </div>
                        <div>

                            <button className="approve-button reject-button" onClick={() => handleRejectClick(request)}>Reject</button>
                            <button className="approve-button" onClick={() => handleApprove(request.name)}>Approve</button>
                        </div>
                    </div>
                ))}
            </div>

            {showPopup && (
                <div className="popup-overlay">
                    <div className="popup">
                        <h3>Reject Leave Request</h3>
                        <textarea
                            rows="4"
                            placeholder="Enter reason for rejection"
                            value={rejectReason}
                            onChange={(e) => setRejectReason(e.target.value)}
                        ></textarea>
                        <button onClick={handleReject}>Submit</button>
                        <button onClick={handleClosePopup}>Cancel</button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default LeaveApprovalPage;
