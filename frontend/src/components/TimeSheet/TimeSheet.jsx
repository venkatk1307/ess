import React, { useState } from 'react';
import './timesheet.css';

const Timesheet = () => {
    const [currentDate, setCurrentDate] = useState(new Date());
    const [selectedProject, setSelectedProject] = useState('');
    const [hoursWorked, setHoursWorked] = useState({});

    const projects = ['Blog app', 'Ecommerce app', 'ESS app'];

    const getMonthName = (date) => date.toLocaleString('default', { month: 'long' });
    const getDaysInMonth = (date) => new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();

    const days = Array.from({ length: getDaysInMonth(currentDate) }, (_, i) => i + 1);

    const goToPreviousMonth = () => {
        const prevMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() - 1);
        setCurrentDate(prevMonth);
    };

    const goToNextMonth = () => {
        const nextMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1);
        setCurrentDate(nextMonth);
    };

    const handleProjectChange = (event) => {
        setSelectedProject(event.target.value);
    };

    const handleHoursChange = (day, value) => {
        setHoursWorked((prevState) => ({
            ...prevState,
            [day]: Math.min(8, Math.max(0, value))
        }));
    };

    const handleSubmit = () => {
        // Here, you'd add submission logic (e.g., saving data to the server).
        alert('Timesheet submitted!');
    };

    return (
        <div className="timesheet-content">
            {/* Add New Entry Button and Leave Statistics */}

            {/* Project Selection */}
            <div className="project-selection">
                <p>Select Project:</p>
                {projects.map((project, index) => (
                    <label key={index} className="project-option">
                        <input
                            type="radio"
                            name="project"
                            value={project}
                            checked={selectedProject === project}
                            onChange={handleProjectChange}
                        />
                        {project}
                    </label>
                ))}
            </div>

            {/* Month Navigation with Submit Button */}
            <div className="month-navigation">
                <button onClick={goToPreviousMonth} className="month-button">◀</button>
                <span className="month-title">{getMonthName(currentDate)} {currentDate.getFullYear()}</span>
                <button onClick={goToNextMonth} className="month-button">▶</button>
                <button onClick={handleSubmit} className="submit-button">Submit</button>
            </div>

            {/* History Section */}
            <div className="history-section">
                <h3 className="history-title">History</h3>
                <table className="timesheet-table">
                    <thead>
                        <tr>
                            <th>Date</th>
                            <th>Working Hours</th>
                            <th>Hours Worked</th>
                            <th>Description</th>
                        </tr>
                    </thead>
                    <tbody>
                        {days.map((day) => (
                            <tr key={day}>
                                <td>{day}/{currentDate.getMonth() + 1}/{currentDate.getFullYear()}</td>
                                <td>8</td>
                                <td>
                                    <input
                                        type="number"
                                        min="0"
                                        max="8"
                                        placeholder="Enter hours"
                                        className="input-box"
                                        value={hoursWorked[day] || ''}
                                        onChange={(e) => handleHoursChange(day, e.target.value)}
                                    />
                                </td>
                                <td><input type="text" placeholder="Enter description" className="input-box" /></td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default Timesheet;