import React, { useState } from 'react';
import axios from 'axios';
import './Login.css';
import { useNavigate } from 'react-router-dom'; // Import useNavigate for redirection

const Login = ({ setIsAuthenticated }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);

    const navigate = useNavigate(); // Initialize useNavigate for redirection

    const handleSubmit = async (event) => {
        event.preventDefault();

        const loginData = {
            email: email,
            password: password,
        };

        setLoading(true); // Set loading state to true when submitting

        try {
            // Attempt to login
            const response = await axios.post('http://localhost:8081/login', loginData);

            // If login is successful (status 200)
            if (response.status === 200) {
                setIsAuthenticated(true); // Set authentication status
                navigate('/timesheet');    // Redirect to the timesheet page
            }
        } catch (error) {
            // Handle error based on response
            if (error.response && error.response.status === 401) {
                setError('Invalid email or password'); // Display error message
            } else {
                setError('Something went wrong, please try again'); // Display generic error message
            }
        } finally {
            setLoading(false); // Set loading state to false after the request completes
        }
    };

    return (
        <div className="login-container">
            <h2 className="form-title">Login</h2>
            <form className="login-form" onSubmit={handleSubmit}>
                <div className="input-wrapper">
                    {/* Email Icon */}
                    <i className="fas fa-envelope"></i>
                    <input
                        type="email"
                        id="email"
                        placeholder="Enter your email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        className="input-field"
                    />
                </div>
                <div className="input-wrapper">
                    {/* Password Icon */}
                    <i className="fas fa-lock"></i>
                    <input
                        type="password"
                        id="password"
                        placeholder="Enter your password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        className="input-field"
                    />
                </div>
                <button type="submit" disabled={loading} className="login-button">
                    {loading ? 'Logging in...' : 'Login'}
                </button>
                {error && <div className="login-status error">{error}</div>}
            </form>
        </div>
    );
};

export default Login;
