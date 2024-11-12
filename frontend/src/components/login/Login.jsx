// frontend/src/components/login/Login.jsx

import React, { useState } from 'react';
import axios from 'axios';
import './Login.css';
import { useNavigate } from 'react-router-dom';
import '@fortawesome/fontawesome-free/css/all.min.css';

const Login = ({ setIsAuthenticated }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);

    const navigate = useNavigate();

    const handleSubmit = async (event) => {
        event.preventDefault();

        const loginData = { email, password };
        setLoading(true);

        try {
            const response = await axios.post('http://localhost:8081/api/auth/login', loginData);

            if (response.status === 200) {
                // Save token to localStorage
                localStorage.setItem('token', response.data.token);
                setIsAuthenticated(true);

                // Redirect to leave-request page
                navigate('/leave-request');
            }
        } catch (error) {
            setError(error.response && error.response.status === 401
                ? 'Invalid email or password'
                : 'Something went wrong, please try again'
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="login-container">
            <h2 className="form-title">Login</h2>
            <form className="login-form" onSubmit={handleSubmit}>
                <div className="input-wrapper">
                    <i className="fa-regular fa-envelope"></i>
                    <input
                        type="email"
                        placeholder="Enter your email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        className="input-field"
                    />
                </div>
                <div className="input-wrapper">
                    <i className="fas fa-lock"></i>
                    <input
                        type="password"
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
