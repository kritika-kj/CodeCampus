import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';

function ContestResults() {
    const { contestId } = useParams();
    const navigate = useNavigate();

    return (
        <div style={{ padding: '50px', textAlign: 'center', fontFamily: 'sans-serif' }}>
            <h1>Contest #{contestId} Complete!</h1>
            <p>The leaderboard and final scores will go here.</p>
            <button 
                onClick={() => navigate('/dashboard')}
                style={{ padding: '10px 20px', backgroundColor: '#007bff', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', marginTop: '20px' }}
            >
                Return to Dashboard
            </button>
        </div>
    );
}

export default ContestResults;