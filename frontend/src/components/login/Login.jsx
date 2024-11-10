import React, { useState } from 'react';
import './Login.css';
import { Navigate } from 'react-router-dom';

const InputField = ({ type, placeholder, icon, value, onChange, isPasswordShown, togglePasswordVisibility }) => (
    <div className="input-wrapper">
        <input
            type={isPasswordShown ? 'text' : type}
            placeholder={placeholder}
            className="input-field"
            required
            value={value}
            onChange={onChange}
        />
        <i className="material-symbols-outlined">{icon}</i>
        {type === 'password' && (
            <i onClick={togglePasswordVisibility} className="material-symbols-outlined eye-icon">
                {isPasswordShown ? 'visibility' : 'visibility_off'}
            </i>
        )}
    </div>
);

const Login = ({ setIsAuthenticated }) => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loginStatus, setLoginStatus] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [redirect, setRedirect] = useState(false);
    const [isPasswordShown, setIsPasswordShown] = useState(false);

    const handleLogin = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setLoginStatus("");

        try {
            const response = await fetch('http://localhost:3001/api/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email, password }),
            });

            const data = await response.json();

            if (response.ok) {
                setLoginStatus("Login successful!");
                setIsAuthenticated(true);
                setRedirect(true);
                // Clear input fields after successful login
                setEmail('');
                setPassword('');
            } else {
                setLoginStatus(data.message || "Invalid email or password");
            }
        } catch (error) {
            console.error('Login error:', error);
            setLoginStatus("An error occurred. Please try again.");
        } finally {
            setIsLoading(false);
        }
    };

    if (redirect) {
        return <Navigate to="/" />;
    }

    return (
        <div className="login-container">
            <h2 className="form-title">Login</h2>

            <form className="login-form" onSubmit={handleLogin}>
                <InputField
                    type="email"
                    placeholder="Email"
                    icon="mail"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                />
                <InputField
                    type="password"
                    placeholder="Password"
                    icon="lock"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    isPasswordShown={isPasswordShown}
                    togglePasswordVisibility={() => setIsPasswordShown(prevState => !prevState)}
                />
                <a href="#" className="forgot-pass-link">Forgot Password?</a>

                <button className="login-button" type="submit" disabled={isLoading}>
                    {isLoading ? (
                        <span className="spinner"></span> // Optional: Add a spinner element
                    ) : (
                        'Log In'
                    )}
                </button>
            </form>
            {loginStatus && (
                <p className={`login-status ${loginStatus === "Login successful!" ? "success" : "error"}`}>
                    {loginStatus}
                </p>
            )}
        </div>
    );
};

export default Login;
