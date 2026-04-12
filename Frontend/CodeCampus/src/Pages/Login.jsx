import React from 'react';
import Card from '../Components/Card'; // Ensure your path is correct
import './Login.css'; // Importing our enhanced CSS

const Login = ({ onLoginSuccess }) => {
    const handleLogin = (e) => {
        e.preventDefault();
        // Simulate a 1-second login delay
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
            <div className="vector-background">
                <div className="solid-center-orb"></div>
                <div className="orbital-ring ring-3"></div>
                <div className="orbital-ring ring-2"></div>
                <div className="orbital-ring ring-1"></div>
                
                <div className="vector-badge badge-left">
                    <span className="badge-dot"></span> 

                    <span className="cycling-text"></span>
                </div>
                <div className="vector-badge badge-right">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#4af626" strokeWidth="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line><polyline points="10 9 9 9 8 9"></polyline></svg>
                </div>
            </div>
            <div className="login-card-wrapper">
                <Card title="Enter The Arena">
                    <p className="login-subtitle">Authenticate to access your workspace.</p>
                    <form onSubmit={handleLogin} className="login-form">
                        <div className="form-group">
                            <label>Email</label>
                            <input type="email" placeholder="contestant@example.com" />
                        </div>
                        <div className="form-group">
                            <label>Password</label>
                            <input type="password" placeholder="••••••••" />
                        </div>
                        <button type="submit" className="btn-primary">Initialize Link</button>
                    </form>
                    <p className="signup-text">New contestant? <a href="#">Register here</a></p>
                </Card>
            </div>
        </div>
    );
};

export default Login;