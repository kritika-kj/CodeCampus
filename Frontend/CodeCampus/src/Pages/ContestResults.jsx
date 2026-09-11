import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';

function ContestResults() {
    const { contestId } = useParams();
    const navigate = useNavigate();
    const location = useLocation();

    // 1. Extract the viewMode from the router state (defaults to contestant if directly visited)
    const viewMode = location.state?.viewMode || 'contestant';
    const isModerator = viewMode === 'mod';

    const [leaderboard, setLeaderboard] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchLeaderboard = async () => {
            try {
                const response = await fetch(`http://localhost:5174/api/contest/${contestId}/leaderboard`);
                if (response.ok) {
                    const data = await response.json();
                    setLeaderboard(data);
                }
            } catch (error) {
                console.error("Failed to load leaderboard:", error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchLeaderboard();
        const pollInterval = setInterval(fetchLeaderboard, 10000);
        return () => clearInterval(pollInterval);
    }, [contestId]);

    if (isLoading) return <div style={{ padding: '50px', textAlign: 'center' }}>Calculating final scores...</div>;

    return (
        // <div style={{ padding: '40px', maxWidth: '900px', margin: '0 auto', fontFamily: 'sans-serif' }}>
        <div className="dashboard-container">
            <h1 style={{ textAlign: 'center', marginBottom: '30px' }}>Contest #{contestId} Leaderboard</h1>

            {leaderboard.length === 0 ? (
                <p style={{ textAlign: 'center', color: '#666' }}>No successful submissions yet.</p>
            ) : (
                <div style={{ background: 'rgb(15, 23, 42)', borderRadius: '10px', overflow: 'hidden', border: '1px solid rgba(74, 222, 128, 0.25)' }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                        <thead>
                            <tr style={{ backgroundColor: 'rgba(20, 20, 20, 0.9)' }}>
                                <th style={thStyle}>Rank</th>
                                <th style={thStyle}>Player</th>
                                <th style={thStyle}>Challenges Solved</th>
                                <th style={thStyle}>Score</th>

                                {isModerator && <th style={thStyle}>Actions</th>}
                            </tr>
                        </thead>
                        <tbody>
                            {leaderboard.map((student, index) => {
                                const medal = index === 0 ? '🥇' : index === 1 ? '🥈' : index === 2 ? '🥉' : '';

                                return (
                                    <tr key={student.userId} style={{ borderBottom: '1px solid rgba(148, 163, 184, 0.2)' }}>
                                        <td style={{ ...tdStyle, fontWeight: 'bold' }}>
                                            {medal ? `${medal} #${student.rank}` : `#${student.rank}`}
                                        </td>
                                        <td style={tdStyle}>{student.name}</td>
                                        <td style={tdStyle}>{student.problemsSolved}</td>
                                        <td style={{ ...tdStyle, color: '#4ade80', fontWeight: 'bold' }}>
                                            {student.score} pts
                                        </td>

                                        {isModerator && (
                                            <td style={tdStyle}>
                                                <button
                                                    onClick={() => navigate(`/mod/student/${contestId}/${student.userId}`)}
                                                    style={{ padding: '6px 12px', backgroundColor: '#3b82f6', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold', whiteSpace: 'nowrap' }}
                                                >
                                                    View Details
                                                </button>
                                            </td>
                                        )}
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
            )}

            <div style={{ textAlign: 'center', marginTop: '30px' }}>
                <button
                    onClick={() => navigate(isModerator ? '/dashboard/review' : '/dashboard')}
                    style={{ padding: '10px 20px', backgroundColor: '#333', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
                >
                    Return to Dashboard
                </button>
            </div>
        </div>
    );
}

export default ContestResults;

const thStyle = { padding: '12px 15px', borderBottom: '1px solid rgba(148, 163, 184, 0.2)', color: '#4ade80', fontWeight: 'bold' };
const tdStyle = { padding: '12px 15px', verticalAlign: 'top', color: '#e2e8f0', background: 'rgba(15, 23, 42, 0.2)' };