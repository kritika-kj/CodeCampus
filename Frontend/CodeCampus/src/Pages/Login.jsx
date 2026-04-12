import React from 'react';
import Card from '../Components/Card'; // Ensure your path is correct
import './Login.css'; // Importing our enhanced CSS

const Login = ({ onLoginSuccess }) => {
    const handleLogin = (e) => {
        e.preventDefault();
        // Simulate a 1-second login delay
        setTimeout(() => {
            onLoginSuccess();
        }, 1000);
    };

    return (
        <div className="login-container">
            
            {/* --- THE CRISP ORBITAL BACKGROUND (Translated from the video) --- */}
            <div className="vector-background">
                {/* 1. The main centered orb shape (The horizon) */}
                <div className="solid-center-orb"></div>
                
                {/* 2. The concentric orbital rings */}
                <div className="orbital-ring ring-3"></div>
                <div className="orbital-ring ring-2"></div>
                <div className="orbital-ring ring-1"></div>
                
                {/* 3. The floating UI badges (Stylized in Hacker Green) */}
                <div className="vector-badge badge-left">
                    <span className="badge-dot"></span> 
                    {/* The text cycles: APPROVING, MAKING, CHECKING via CSS */}
                    <span className="cycling-text"></span>
                </div>
                <div className="vector-badge badge-right">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#4af626" strokeWidth="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line><polyline points="10 9 9 9 8 9"></polyline></svg>
                </div>
            </div>
            {/* --- END BACKGROUND --- */}

            {/* Existing Login Card Content (centered) */}
            <div className="login-card-wrapper">
                <Card title="Enter The Arena">
                    <p className="login-subtitle">Authenticate to access your workspace.</p>
                    <form onSubmit={handleLogin} className="login-form">
                        <div className="form-group">
                            <label htmlFor="email">Email</label>
                            <input type="email" id="email" placeholder="contestant@example.com" />
                        </div>
                        <div className="form-group">
                            <label htmlFor="password">Password</label>
                            <input type="password" id="password" placeholder="********" />
                        </div>
                        <button type="submit" className="login-btn">Initialize Link</button>
                    </form>
                    <p className="signup-text">New contestant? <a href="#">Register here</a></p>
                </Card>
            </div>
        </div>
    );
};

export default Login;