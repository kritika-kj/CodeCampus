import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import ContestTimer from '../Components/ContestTimer';

function ContestHub() {
    const { contestId } = useParams();
    const navigate = useNavigate();

    const [contest, setContest] = useState(null);
    const [challenges, setChallenges] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchContestData = async () => {
            try {
                // 1. Fetch the specific contest data
                const contestRes = await fetch(`http://localhost:5174/api/contest/${contestId}`);
                if (!contestRes.ok) throw new Error("Contest not found");
                const contestData = await contestRes.json();
                setContest(contestData);

                // 2. Fetch the individual challenges using the comma-separated IDs
                const ids = contestData.challengeIds.split(',');
                const challengePromises = ids.map(id =>
                    fetch(`http://localhost:5174/api/challenge/${id}`).then(r => r.json())
                );

                const challengesData = await Promise.all(challengePromises);
                setChallenges(challengesData);
            } catch (error) {
                console.error("Failed to load contest hub", error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchContestData();
    }, [contestId]);

    const handleFinishContest = () => {
        // Route to the final leaderboard/results screen
        navigate(`/results/${contestId}`);
    };

    if (isLoading) return <div style={{ padding: '50px', textAlign: 'center' }}>Loading Arena...</div>;
    if (!contest) return <div style={{ padding: '50px', color: 'red' }}>Error: Contest not found.</div>;

    return (
        // <div style={{ maxWidth: '900px', margin: '40px auto', padding: '30px', backgroundColor: '#fff', borderRadius: '8px', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}>
        <div className="dashboard-container" style={{ maxWidth: '1200px', margin: '0 auto' }}>
            {/* Hub Header */}
            <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'flex-start', /* Changed from center to prevent vertical squishing */
                flexWrap: 'wrap', /* Allows wrapping on smaller screens */
                borderBottom: '2px solid #eee',
                paddingBottom: '20px',
                marginBottom: '30px'
            }}>
                <div style={{ flex: 1, minWidth: '250px', marginRight: '20px' }}>
                    <h1 style={{
                        margin: '0 0 10px 0',
                        color: '#00ff66',
                        fontSize: '2.5rem',
                        lineHeight: '1.2', /* This fixes the title overlapping the paragraph */
                        wordBreak: 'break-word' /* Prevents long random strings from breaking the layout */
                    }}>
                        {contest.title}
                    </h1>
                    <p style={{ margin: 0, color: '#a6accd', fontSize: '1rem' }}>Solve all challenges before the timer runs out.</p>
                </div>

                <div style={{ textAlign: 'right', minWidth: '150px', marginTop: '10px' }}>
                    <span style={{ display: 'block', fontSize: '0.85rem', color: '#888', marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '1px' }}>Time Remaining</span>
                    <ContestTimer
                        endTime={contest.endTime}
                        onTimeUp={handleFinishContest}
                    />
                </div>
            </div>

            {/* Problem List */}
            <h3 style={{ margin: '0 0 20px 0', color: '#f5f5f5' }}>Contest Problems</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                {challenges.map((chal, index) => (
                    <div key={chal.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '20px', backgroundColor: '#f8f9fa', border: '1px solid #ddd', borderRadius: '6px' }}>
                        <div style={{ flex: 1, marginRight: '15px' }}>
                            <h4 style={{ margin: '0 0 5px 0', color: '#007bff', fontSize: '1.2rem' }}>{index + 1}. {chal.title}</h4>
                            <span style={{ fontSize: '0.9rem', color: '#666' }}>{chal.difficulty} | {chal.points} pts</span>
                        </div>
                        <button
                            onClick={() => navigate(`/workspace/${contestId}/${chal.id}`)}
                            style={{ padding: '10px 24px', backgroundColor: '#28a745', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold', whiteSpace: 'nowrap' }}
                        >
                            Solve Problem
                        </button>
                    </div>
                ))}
            </div>

            {/* Final Submission Container */}
            <div style={{ marginTop: '40px', padding: '30px 20px', backgroundColor: '#fff3cd', border: '1px solid #ffeeba', borderRadius: '6px', textAlign: 'center' }}>
                <h4 style={{ margin: '0 0 20px 0', color: '#856404', fontSize: '1.2rem' }}>Finished with all problems?</h4>

                <div style={{ display: 'flex', justifyContent: 'center', gap: '15px', flexWrap: 'wrap' }}>
                    <button
                        onClick={handleFinishContest}
                        style={{ padding: '12px 30px', backgroundColor: '#dc3545', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold', fontSize: '1.1rem' }}
                    >
                        🏁 Submit Entire Contest
                    </button>

                    <button
                        onClick={() => navigate(`/results/${contestId}`)}
                        style={{
                            padding: '12px 30px',
                            backgroundColor: '#ffc107',
                            color: '#333',
                            border: 'none',
                            borderRadius: '4px',
                            fontWeight: 'bold',
                            fontSize: '1.1rem',
                            cursor: 'pointer'
                        }}
                    >
                        🏆 View Leaderboard
                    </button>
                </div>
            </div>
        </div>
    );
}

export default ContestHub;