import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import './Dashboard.css';

function ViewChallengeDetails() {
    const { contestId, challengeId } = useParams();
    const navigate = useNavigate();
    const [challengeDetails, setChallengeDetails] = useState(null);
    const activeUserId = sessionStorage.getItem('userId');

    useEffect(() => {
        const fetchChallengeDetails = async () => {
            try {
                const response = await fetch(`http://localhost:5174/api/contest/${activeUserId}/${contestId}/${challengeId}/viewchallenge`);
                if (response.ok) {
                    const data = await response.json();
                    setChallengeDetails(data);
                } else {
                    console.error('Challenge not found');
                }
            } catch (error) {
                console.error('Failed to load challenge details:', error);
            }
        };
        fetchChallengeDetails();
    }, [challengeId, contestId, activeUserId]);

    if (!challengeDetails) return <div style={{ padding: '50px', textAlign: 'center', color: '#e2e8f0' }}>Loading challenge details...</div>;

    return (
        <div className="dashboard-container">
            <button
                onClick={() => navigate(-1)}
                style={{ marginBottom: '20px', background: 'none', border: 'none', color: '#4ade80', cursor: 'pointer', textDecoration: 'underline', fontSize: '1rem', fontWeight: 600 }}
            >
                ← Back
            </button>

            <h2 style={{ color: '#e2e8f0', marginBottom: '20px' }}>{challengeDetails.title}</h2>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 300px', gap: '20px', height: 'calc(100vh - 300px)' }}>
                {/* Source Code Section - Majority */}
                <div style={{ background: 'rgba(15, 23, 42, 0.65)', borderRadius: '10px', border: '1px solid rgba(74, 222, 128, 0.25)', padding: '20px', overflow: 'auto' }}>
                    <pre style={{ margin: 0, fontFamily: 'Courier New, monospace', fontSize: '13px', color: '#e2e8f0', lineHeight: '1.6', whiteSpace: 'pre-wrap', wordWrap: 'break-word' }}>
                        {challengeDetails.sourceCode || 'No source code provided'}
                    </pre>
                </div>

                {/* Status & Points Section - Small */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                    <div style={{ background: 'rgba(15, 23, 42, 0.65)', borderRadius: '10px', border: '1px solid rgba(74, 222, 128, 0.25)', padding: '15px' }}>
                        <p style={{ margin: '0 0 10px 0', color: '#cbd5e1', fontSize: '0.9rem' }}>
                            <strong style={{ color: '#4ade80' }}>Status</strong>
                        </p>
                        <p style={{ margin: 0, color: '#e2e8f0', fontWeight: 600 }}>
                            {challengeDetails.status || 'Pending'}
                        </p>
                    </div>

                    <div style={{ background: 'rgba(15, 23, 42, 0.65)', borderRadius: '10px', border: '1px solid rgba(74, 222, 128, 0.25)', padding: '15px' }}>
                        <p style={{ margin: '0 0 10px 0', color: '#cbd5e1', fontSize: '0.9rem' }}>
                            <strong style={{ color: '#4ade80' }}>Awarded Points</strong>
                        </p>
                        <p style={{ margin: 0, color: '#e2e8f0', fontWeight: 600, fontSize: '1.3rem' }}>
                            {challengeDetails.awardedPoints || 0}
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default ViewChallengeDetails;
