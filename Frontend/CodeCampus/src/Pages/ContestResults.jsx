import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';

function ContestResults() {
    const { contestId } = useParams();
    const navigate = useNavigate();
    const location = useLocation();
    
    // 1. Extract the viewMode from the router state (defaults to contestant if directly visited)
    const viewMode = location.state?.viewMode || 'contestant';
    const isAdmin = viewMode === 'admin';

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
        <div style={{ padding: '40px', maxWidth: '900px', margin: '0 auto', fontFamily: 'sans-serif' }}>
            <h1 style={{ textAlign: 'center', marginBottom: '30px' }}>Contest #{contestId} Leaderboard</h1>

            {leaderboard.length === 0 ? (
                <p style={{ textAlign: 'center', color: '#666' }}>No successful submissions yet.</p>
            ) : (
                <table style={{ width: '100%', borderCollapse: 'collapse', backgroundColor: 'white', boxShadow: '0 1px 3px rgba(0,0,0,0.2)' }}>
                    <thead>
                        <tr style={{ backgroundColor: '#007bff', color: 'white', textAlign: 'left' }}>
                            <th style={{ padding: '12px' }}>Rank</th>
                            <th style={{ padding: '12px' }}>Player</th>
                            <th style={{ padding: '12px' }}>Challenges Solved</th>
                            <th style={{ padding: '12px' }}>Score</th>
                            
                            {/* 2. Conditionally render the Admin Header */}
                            {isAdmin && <th style={{ padding: '12px' }}>Actions</th>}
                        </tr>
                    </thead>
                    <tbody>
                        {leaderboard.map((student, index) => {
                            const medal = index === 0 ? '🥇' : index === 1 ? '🥈' : index === 2 ? '🥉' : '';

                            return (
                                <tr key={student.userId} style={{ borderBottom: '1px solid #ddd' }}>
                                    <td style={{ padding: '12px', fontWeight: 'bold' }}>
                                        {medal ? `${medal} #${student.rank}` : `#${student.rank}`}
                                    </td>
                                    <td style={{ padding: '12px' }}>{student.name}</td>
                                    <td style={{ padding: '12px' }}>{student.problemsSolved}</td>
                                    <td style={{ padding: '12px', color: '#28a745', fontWeight: 'bold' }}>
                                        {student.score} pts
                                    </td>
                                    
                                    {/* 3. Conditionally render the Admin Action Button */}
                                    {isAdmin && (
                                        <td style={{ padding: '12px' }}>
                                            <button 
                                                onClick={() => navigate(`/admin/student/${student.userId}`)}
                                                style={{ padding: '6px 12px', backgroundColor: '#17a2b8', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', fontSize: '0.85rem' }}
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
            )}
            
            <div style={{ textAlign: 'center', marginTop: '30px' }}>
                <button
                    onClick={() => navigate(isAdmin ? '/dashboard' : '/dashboard/review')}
                    style={{ padding: '10px 20px', backgroundColor: '#333', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
                >
                    Return to Dashboard
                </button>
            </div>
        </div>
    );
}

export default ContestResults;