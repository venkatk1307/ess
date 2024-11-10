import React, { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import './Navbar.css';

const Navbar = ({ setIsAuthenticated }) => {
    const [isMobileMenuOpen, setMobileMenuOpen] = useState(false);
    const navigate = useNavigate();

    const toggleMobileMenu = () => {
        setMobileMenuOpen((prevState) => !prevState);
    };

    const handleLogout = () => {
        setIsAuthenticated(false); // Set isAuthenticated to false
        navigate("/"); // Navigate to login page
    };

    return (
        <nav className="navbar">
            <div className="navbar-links">
                <NavLink to="/leave-request" className="nav-link" activeClassName="active">Leave Request</NavLink>
                <NavLink to="/timesheet" className="nav-link" activeClassName="active">Timesheet</NavLink>
                <NavLink to="/holidays" className="nav-link" activeClassName="active">Holidays</NavLink>
                <NavLink to="/rules" className="nav-link" activeClassName="active">Rules & Regulations</NavLink>
                <NavLink to="/leave-approval" className="nav-link" activeClassName="active">Leave Approval</NavLink>
            </div>
            <button className="logout-button" onClick={handleLogout}>Logout</button>

            <button
                className="hamburger"
                onClick={toggleMobileMenu}
                aria-label="Toggle mobile menu"
                aria-expanded={isMobileMenuOpen}
            >
                <span></span>
                <span></span>
                <span></span>
            </button>

            {isMobileMenuOpen && (
                <div className="mobile-menu">
                    <NavLink to="/leave-request" className="nav-link" activeClassName="active" onClick={toggleMobileMenu}>Leave Request</NavLink>
                    <NavLink to="/timesheet" className="nav-link" activeClassName="active" onClick={toggleMobileMenu}>Timesheet</NavLink>
                    <NavLink to="/holidays" className="nav-link" activeClassName="active" onClick={toggleMobileMenu}>Holidays</NavLink>
                    <NavLink to="/rules" className="nav-link" activeClassName="active" onClick={toggleMobileMenu}>Rules & Regulations</NavLink>
                    <NavLink to="/leave-approval" className="nav-link" activeClassName="active" onClick={toggleMobileMenu}>Leave Approval</NavLink>
                    <button className="logout-button" onClick={() => { handleLogout(); toggleMobileMenu(); }}>Logout</button>
                </div>
            )}
        </nav>
    );
};

export default Navbar;
