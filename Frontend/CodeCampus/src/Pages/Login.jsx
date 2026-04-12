import React, { useState } from 'react';
import './Login.css';
import Card from '../Components/Card'; 
import LoginBg from '../Assets/LoginVideo.mp4';

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

            if (isLoginMode) {
                // --- LOGIN LOGIC ---
                try {
                const response = await fetch('http://localhost:5174/api/auth/login', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ email: email, password: password })
                });

                const data = await response.json();

                if (response.ok) {
                    // Success! Pass the role back to App.jsx
                    console.log("Logged in as:", data.role);
                    onLoginSuccess(data.role); 
                } else {
                    // Failed login (Unauthorized)
                    setError(data.message || 'Invalid credentials');
                    setIsLoading(false);
                }
            } catch (err) {
                console.error("Connection error:", err);
                setError('Failed to connect to the server.');
                setIsLoading(false);
            }
            } else {
                // --- SIGN UP LOGIC ---
                if (password !== confirmPassword) {
                    setError('Passwords do not match.');
                    setIsLoading(false);
                    return;
                }
                if (!name || !email || !password) {
                    setError('Please fill out all fields.');
                    setIsLoading(false);
                } try {

                const response = await fetch('http://localhost:5174/api/auth/register', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },

                    body: JSON.stringify({ name: name, email: email, password: password })
                });
                const data = await response.json();
                if (response.ok) {
                    console.log("Registered and logged in as:", data.role);
                    onLoginSuccess(data.role); 
                } else {
                    setError(data.message || 'Registration failed.');
                    setIsLoading(false);
                }
            } catch (err) {
                console.error("Connection error:", err);
                setError('Failed to connect to the server.');
                setIsLoading(false);
            }
            }
    };

    return (
       
        <div className="login-container">
            <div className="video-background-wrapper">
                {/* CRITICAL ATTRIBUTES: 
                  autoPlay: Starts immediately
                  loop: Never stops
                  muted & playsInline: REQUIRED by browsers, otherwise autoplay is blocked!
                */}
                <video autoPlay loop muted playsInline className="bg-video">
                    <source src={LoginBg} type="video/mp4" />
                </video>
                
                {/* This darkens the video so your form is still easy to read */}
                <div className="video-overlay"></div>
            </div>
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