import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
// import './Dashboard.css';

function ViewContestDetails() {
    const { contestId } = useParams();
    const navigate = useNavigate();
    const [contestDetails, setContestDetails] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const activeUserId = sessionStorage.getItem('userId');

    useEffect(() => {
        const fetchContestDetails = async () => {
            try {
                const response = await fetch(`http://localhost:5174/api/contest/${activeUserId}/viewsubmissions/${contestId}`);
                if (response.ok) {
                    const data = await response.json();
                    setContestDetails(Array.isArray(data) ? data : []);
                } else {
                    console.error('Contest not found');
                    setContestDetails([]);
                }
            } catch (error) {
                console.error('Failed to load contest details:', error);
                setContestDetails([]);
            } finally {
                setIsLoading(false);
            }
        };

        fetchContestDetails();
    }, [contestId, activeUserId]);

    const ViewChallengeDetails = (contestId, challengeId) => {
        navigate(`/dashboard/submissions/${contestId}/${challengeId}/details`);
    };

    if (isLoading) return <div style={{ padding: '50px', textAlign: 'center' }}>Loading contest details...</div>;

    return (
        // <div className="dashboard-container contest-details-page">
        <div style={{ maxWidth: '900px', margin: '0 auto', padding: '20px' }}>
            <button
                onClick={() => navigate('/dashboard/submissions')}
                style={{ marginBottom: '20px', background: 'none', border: 'none', color: '#4ade80', cursor: 'pointer', textDecoration: 'underline', fontSize: '1rem', fontWeight: 600 }}
            >
                ← Back to Submissions
            </button>

            <h2 style={{ color: '#e2e8f0', marginBottom: '20px' }}>Contest Submission Details</h2>

            {contestDetails.length === 0 ? (
                <div style={{ padding: '20px', color: '#cbd5e1', textAlign: 'center', background: 'rgba(15, 23, 42, 0.65)', borderRadius: '10px' }}>No submission data found for this contest.</div>
            ) : (
                <div style={{ background: 'rgba(15, 23, 42, 0.65)', borderRadius: '10px', overflow: 'hidden', border: '1px solid rgba(74, 222, 128, 0.25)' }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                        <thead>
                            <tr style={{ backgroundColor: 'rgba(20, 20, 20, 0.9)' }}>
                                <th style={thStyle}>ID</th>
                                <th style={thStyle}>Challenge</th>
                                <th style={thStyle}>Awarded Points</th>
                                <th style={thStyle}>Feedback</th>
                                <th style={thStyle}>Created At</th>
                                <th style={thStyle}>Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {contestDetails.map((item) => (
                                <tr key={item.id} style={{ borderBottom: '1px solid rgba(148, 163, 184, 0.2)' }}>
                                    <td style={tdStyle}>{item.id}</td>
                                    <td style={tdStyle}>{item.challengeTitle || `Challenge #${item.challengeId}`}</td>
                                    <td style={tdStyle}>{item.awardedPoints}</td>
                                    <td style={{ ...tdStyle, maxWidth: '420px', whiteSpace: 'pre-wrap' }}>{item.feedback || 'No feedback'}</td>
                                    <td style={tdStyle}>{new Date(item.createdAt).toLocaleString()}</td>
                                    <td style={tdStyle}>
                                        <button 
                                            onClick={() => ViewChallengeDetails(contestId, item.challengeId)}
                                            style={{ padding: '6px 12px', backgroundColor: '#3b82f6', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
                                        >
                                            View Details
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
}

const thStyle = { padding: '12px 15px', borderBottom: '1px solid rgba(148, 163, 184, 0.2)', color: '#4ade80', fontWeight: 'bold' };
const tdStyle = { padding: '12px 15px', verticalAlign: 'top', color: '#e2e8f0', background: 'rgba(15, 23, 42, 0.2)' };

export default ViewContestDetails;