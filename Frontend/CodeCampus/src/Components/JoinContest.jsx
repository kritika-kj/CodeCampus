import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

function JoinContest() {
    const navigate = useNavigate();
    
    const [activeContests, setActiveContests] = useState([]);
    const [selectedContest, setSelectedContest] = useState(null);
    const [isLoading, setIsLoading] = useState(true);

    // Fetch the live contests when the page loads
    useEffect(() => {
        const fetchContests = async () => {
            try {
                const response = await fetch('http://localhost:5174/api/contest/active');
                if (response.ok) {
                    const data = await response.json();
                    setActiveContests(data);
                }
            } catch (error) {
                console.error("Failed to load active contests", error);
            } finally {
                setIsLoading(false);
            }
        };
        fetchContests();
    }, []);

    return (
        <div style={{ maxWidth: '900px', margin: '0 auto', padding: '20px' }}>
            <button 
                onClick={() => selectedContest ? setSelectedContest(null) : navigate('/dashboard')} 
                style={{ marginBottom: '20px', background: 'none', border: 'none', color: '#007bff', cursor: 'pointer', textDecoration: 'underline' }}
            >
                ← {selectedContest ? 'Back to Contests' : 'Back to Dashboard Menu'}
            </button>

            {/* ========================================= */}
            {/* VIEW 1: THE LOBBY (List of Contests)      */}
            {/* ========================================= */}
            {!selectedContest && (
                <>
                    <h2 style={{ marginBottom: '20px' }}>Available Contests</h2>
                    
                    {isLoading ? (
                        <p>Loading the arena...</p>
                    ) : activeContests.length === 0 ? (
                        <div style={{ background: 'white', padding: '30px', borderRadius: '8px', textAlign: 'center', border: '1px solid #ddd' }}>
                            <h3 style={{ color: '#666' }}>No active contests right now.</h3>
                            <p style={{ color: '#999' }}>Check back later when the moderators launch a new event!</p>
                        </div>
                    ) : (
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '20px' }}>
                            {activeContests.map(contest => (
                                <div key={contest.id} style={{ background: 'white', padding: '25px', borderRadius: '12px', border: '1px solid #e2e8f0', boxShadow: '0 4px 6px rgba(0,0,0,0.05)', display: 'flex', flexDirection: 'column' }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '15px' }}>
                                        <h3 style={{ margin: 0, color: '#334155', fontSize: '1.4rem' }}>{contest.title}</h3>
                                        <span style={{ padding: '4px 8px', borderRadius: '12px', backgroundColor: '#d4edda', color: '#155724', fontSize: '0.85rem', fontWeight: 'bold' }}>Live</span>
                                    </div>
                                    <p style={{ color: '#64748b', marginBottom: '25px', flex: 1 }}>
                                        This contest contains <strong>{contest.challengeIds.split(',').length}</strong> coding challenges.
                                    </p>
                                    <button 
                                        onClick={() => setSelectedContest(contest)}
                                        style={{ width: '100%', padding: '12px', backgroundColor: '#3b82f6', color: 'white', border: 'none', borderRadius: '6px', fontWeight: 'bold', cursor: 'pointer', fontSize: '1.1rem' }}
                                    >
                                        Enter Contest
                                    </button>
                                </div>
                            ))}
                        </div>
                    )}
                </>
            )}

            {/* ========================================= */}
            {/* VIEW 2: INSIDE THE CONTEST                */}
            {/* ========================================= */}
            {selectedContest && (
                <div style={{ background: 'white', padding: '40px', borderRadius: '12px', border: '1px solid #e2e8f0', boxShadow: '0 4px 6px rgba(0,0,0,0.05)' }}>
                    <h2 style={{ marginTop: 0, fontSize: '2rem', color: '#334155', borderBottom: '2px solid #f1f5f9', paddingBottom: '15px', marginBottom: '30px' }}>
                        {selectedContest.title}
                    </h2>
                    
                    <p style={{ fontSize: '1.1rem', color: '#64748b', marginBottom: '30px' }}>
                        Select a problem below to enter the coding workspace. You can solve them in any order!
                    </p>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                        {/* We split the "1,2,3" string and map a button for every ID! */}
                        {selectedContest.challengeIds.split(',').map((id, index) => (
                            <div key={id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '20px', backgroundColor: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '8px' }}>
                                <div>
                                    <h3 style={{ margin: 0, color: '#334155' }}>Problem #{index + 1}</h3>
                                    <span style={{ color: '#64748b', fontSize: '0.9rem' }}>Database ID: {id}</span>
                                </div>
                                <button 
                                    onClick={() => navigate(`/workspace/${id}`)}
                                    style={{ padding: '10px 24px', backgroundColor: '#10b981', color: 'white', border: 'none', borderRadius: '6px', fontWeight: 'bold', cursor: 'pointer' }}
                                >
                                    Launch Arena ⚡
                                </button>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}

export default JoinContest;