import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import backgroundImage from '../assets/button-bg.png';

function StudentSubmissionDetails() {
    const { contestId, userId } = useParams();
    const navigate = useNavigate();
    const [submissions, setSubmissions] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchSubmissions = async () => {
            try {
                const response = await fetch(`http://localhost:5174/api/contest/${userId}/viewsubmissions/${contestId}`);
                if (response.ok) {
                    const data = await response.json();
                    setSubmissions(Array.isArray(data) ? data : []);
                }
            } catch (error) {
                console.error('Failed to load student submissions:', error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchSubmissions();
    }, [contestId, userId]);

    if (isLoading) return <div style={{ padding: '50px', textAlign: 'center' }}>Loading student details...</div>;

    return (
        // <div style={{ minHeight: '100vh', maxWidth: '900px', margin: '0 auto', padding: '20px', backgroundImage: `url(${backgroundImage})`, backgroundSize: 'cover', backgroundPosition: 'center' }}>
        <div className="dashboard-container">   
        <button
                onClick={() => navigate(`/results/${contestId}`, { state: { viewMode: 'mod' } })}
                style={{ marginBottom: '20px', background: 'none', border: 'none', color: '#4ade80', cursor: 'pointer', textDecoration: 'underline', fontSize: '1rem', fontWeight: 600 }}
            >
                Back to Leaderboard
            </button>
            <h2 style={{ color: '#e2e8f0', marginBottom: '20px' }}>Student #{userId} Submission Details</h2>

            {submissions.length === 0 ? (
                <div style={{ padding: '20px', color: '#cbd5e1', textAlign: 'center', background: 'rgba(15, 23, 42, 0.65)', borderRadius: '10px' }}>
                    No submission data found for this student.
                </div>
            ) : (
                <div style={{ background: 'rgb(15, 23, 42)', borderRadius: '10px', overflow: 'hidden', border: '1px solid rgba(74, 222, 128, 0.25)' }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                        <thead>
                            <tr style={{ backgroundColor: 'rgba(20, 20, 20, 0.9)' }}>
                                <th style={thStyle}>Challenge</th>
                                <th style={thStyle}>Awarded Points</th>
                                <th style={thStyle}>Status</th>
                                <th style={thStyle}>Feedback</th>
                                <th style={thStyle}>Submitted At</th>
                                <th style={thStyle}>Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {submissions.map((submission) => (
                                <tr key={submission.id} style={{ borderBottom: '1px solid rgba(148, 163, 184, 0.2)' }}>
                                    <td style={tdStyle}>{submission.challengeTitle || `Challenge #${submission.challengeId}`}</td>
                                    <td style={tdStyle}>{submission.awardedPoints}</td>
                                    <td style={tdStyle}>{submission.status || 'Submitted'}</td>
                                    <td style={{ ...tdStyle, whiteSpace: 'pre-wrap' }}>{submission.feedback || 'No feedback'}</td>
                                    <td style={tdStyle}>{new Date(submission.createdAt).toLocaleString()}</td>
                                    <td style={tdStyle}>
                                        <button
                                            onClick={() => navigate(`/mod/student/${contestId}/${userId}/${submission.challengeId}`)}
                                            style={{ padding: '6px 12px', backgroundColor: '#3b82f6', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold', whiteSpace: 'nowrap' }}
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

export default StudentSubmissionDetails;
