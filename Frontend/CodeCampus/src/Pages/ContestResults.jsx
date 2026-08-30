import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

function ContestResults() {
    const { contestId } = useParams();
    const navigate = useNavigate();
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
                        </tr>
                    </thead>
                    <tbody>
                        {leaderboard.map((student, index) => {
                            const displayName = student.name || student.userName || `Student ${student.userId}`;
                            const score = student.score ?? student.totalScore ?? 0;
                            const medal = index === 0 ? '🥇' : index === 1 ? '🥈' : index === 2 ? '🥉' : '';

                            return (
                                <tr key={student.userId} style={{ borderBottom: '1px solid #ddd' }}>
                                    <td style={{ padding: '12px', fontWeight: 'bold' }}>{medal ? `${medal} #${student.rank ?? index + 1}` : `#${student.rank ?? index + 1}`}</td>
                                    <td style={{ padding: '12px' }}>{displayName}</td>
                                    <td style={{ padding: '12px' }}>{student.problemsSolved ?? 0}</td>
                                    <td style={{ padding: '12px', color: '#28a745', fontWeight: 'bold' }}>{score} pts</td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            )}

            <div style={{ textAlign: 'center', marginTop: '30px' }}>
                <button 
                    onClick={() => navigate('/dashboard')}
                    style={{ padding: '10px 20px', backgroundColor: '#333', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
                >
                    Return to Dashboard
                </button>
            </div>
        </div>
    );
}

export default ContestResults;