import React, { useState } from 'react';
import './Login.css';
import Card from '../Components/Card'; 

function Login({ onLoginSuccess }) {
    // State to toggle between Login and Sign Up
    const [isLoginMode, setIsLoginMode] = useState(true);

    // Form states
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    
    // UI states
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');

    const toggleMode = () => {
        setIsLoginMode(!isLoginMode);
        setError(''); // Clear errors when switching modes
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setError('');

        // Simulate API call to your ASP.NET backend
        setTimeout(() => {
            if (isLoginMode) {
                // --- SIGN IN LOGIC ---
                if (email && password) {
                    onLoginSuccess(); 
                } else {
                    setError('Please enter both email and password.');
                    setIsLoading(false);
                }
            } else {
                // --- SIGN UP LOGIC ---
                if (password !== confirmPassword) {
                    setError('Passwords do not match.');
                    setIsLoading(false);
                    return;
                }
                if (name && email && password) {
                    // In a real app, this creates the user in the DB, then logs them in
                    onLoginSuccess(); 
                } else {
                    setError('Please fill out all fields.');
                    setIsLoading(false);
                }
            }
        }, 1000);
    };

    return (
        <div className="login-container">
            <Card title={isLoginMode ? 'Welcome Back' : 'Join CodeCampus'}>
                
                <p className="login-subtitle">
                    {isLoginMode ? 'Sign in to access the arena' : 'Create an account to start coding'}
                </p>

                {error && <div className="error-message">{error}</div>}

                <form onSubmit={handleSubmit} className="login-form">
                    
                    {!isLoginMode && (
                        <div className="input-group">
                            <label>Full Name</label>
                            <input 
                                type="text" 
                                value={name} 
                                onChange={(e) => setName(e.target.value)} 
                                placeholder="Username"
                                required 
                            />
                        </div>
                    )}

                    <div className="input-group">
                        <label>Email</label>
                        <input 
                            type="email" 
                            value={email} 
                            onChange={(e) => setEmail(e.target.value)} 
                            placeholder="contestant@example.com"
                            required 
                        />
                    </div>

                    <div className="input-group">
                        <label>Password</label>
                        <input 
                            type="password" 
                            value={password} 
                            onChange={(e) => setPassword(e.target.value)} 
                            placeholder="••••••••"
                            required 
                        />
                    </div>

                    {!isLoginMode && (
                        <div className="input-group">
                            <label>Confirm Password</label>
                            <input 
                                type="password" 
                                value={confirmPassword} 
                                onChange={(e) => setConfirmPassword(e.target.value)} 
                                placeholder="••••••••"
                                required 
                            />
                        </div>
                    )}

                    <button type="submit" disabled={isLoading} className="login-btn">
                        {isLoading 
                            ? (isLoginMode ? 'Authenticating...' : 'Creating Account...') 
                            : (isLoginMode ? 'Enter Arena' : 'Sign Up')}
                    </button>
                </form>

                <div className="toggle-text">
                    {isLoginMode ? "Don't have an account? " : "Already have an account? "}
                    <span className="toggle-link" onClick={toggleMode}>
                        {isLoginMode ? "Sign up here" : "Sign in here"}
                    </span>
                </div>
            </Card>
        </div>
    );
}

export default Login;