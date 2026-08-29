import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

function ContestManager() {
    const navigate = useNavigate();

    // UI State
    const [viewMode, setViewMode] = useState('list');

    // Data State
    const [availableChallenges, setAvailableChallenges] = useState([]);
    const [activeContests, setActiveContests] = useState([]); // <-- NEW: State for the list view

    // New Contest Form State
    const [contestTitle, setContestTitle] = useState('');
    const [selectedChallengeIds, setSelectedChallengeIds] = useState([]);
    const [statusMessage, setStatusMessage] = useState('');
    const [selectedContestId, setSelectedContestId] = useState(null);

    //datetime
    const [durationInMinutes, setDurationInMinutes] = useState(60);
    const [isSaved, setIsSaved] = useState(false);

    // Fetch available challenges for the creation form
    useEffect(() => {
        const fetchChallenges = async () => {
            try {
                const response = await fetch('http://localhost:5174/api/challenge');
                if (response.ok) {
                    const data = await response.json();
                    setAvailableChallenges(data);
                }
            } catch (error) {
                console.error("Failed to load challenges");
            }
        };
        fetchChallenges();
    }, []);

    // <-- NEW: Fetch Active Contests whenever we switch to 'list' mode
    useEffect(() => {
        if (viewMode === 'list') {
            const fetchActiveContests = async () => {
                try {
                    const response = await fetch('http://localhost:5174/api/contest/all');
                    if (response.ok) {
                        const data = await response.json();
                        setActiveContests(data);
                    }
                } catch (error) {
                    console.error("Failed to load active contests");
                }
            };
            fetchActiveContests();
        }
    }, [viewMode]);

    useEffect(() => {
        if (viewMode === 'edit' && selectedContestId) {
            const fetchContestDetails = async () => {
                try {
                    const response = await fetch(`http://localhost:5174/api/contest/${selectedContestId}`);
                    if (response.ok) {
                        const data = await response.json();
                        setContestTitle(data.title);
                        setDurationInMinutes(data.durationInMinutes);
                        if (data.challengeIds) {
                            const parsedIds = data.challengeIds.split(',').map(id => parseInt(id.trim()));
                            setSelectedChallengeIds(parsedIds);
                        }
                    }
                } catch (error) {
                    console.error("Failed to load contest details");
                }
            };
            fetchContestDetails();
        }
    }, [viewMode, selectedContestId]);

    // Handle Checkbox clicks
    const handleCheckboxChange = (challengeId) => {
        setSelectedChallengeIds(prev => {
            if (prev.includes(challengeId)) {
                return prev.filter(id => id !== challengeId); // Uncheck
            } else {
                return [...prev, challengeId]; // Check
            }
        });
    };
    const handleEditContest = (contestId) => {
        setSelectedContestId(contestId);
        setViewMode('edit');
    };
    const handleProcessContest = async (startImmediately) => {
        if (!contestTitle || selectedChallengeIds.length === 0 || durationInMinutes <= 0) {
            setStatusMessage('❌ Please provide a title, a valid duration, and select at least one challenge.');
            return;
        }

        setStatusMessage(startImmediately ? '🚀 Launching Contest...' : '💾 Saving Draft...');

        // Package the data, injecting the boolean from the button click
        const payload = {
            title: contestTitle,
            challengeIds: selectedChallengeIds.join(','),
            durationInMinutes: durationInMinutes,
            isActive: startImmediately
        };

        try {
            let response;
            if (viewMode === 'edit') {
                response = await fetch(`http://localhost:5174/api/contest/${selectedContestId}`, {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ id: selectedContestId, ...payload })
                });
            } else {
                // Create brand new record
                response = await fetch('http://localhost:5174/api/contest/create', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(payload)
                });
            }

            if (response.ok) {
                // Clear the form and return to the list
                setContestTitle('');
                setSelectedChallengeIds([]);
                setSelectedContestId(null);
                setStatusMessage('');
                setViewMode('list');
            } else {
                setStatusMessage('❌ Failed to process contest.');
            }
        } catch (error) {
            setStatusMessage('❌ Server error. Is C# running?');
        }

    };


    return (
        <div style={{ maxWidth: '900px', margin: '0 auto', padding: '20px' }}>
            <button onClick={() => navigate('/dashboard')} style={{ marginBottom: '20px', background: 'none', border: 'none', color: '#007bff', cursor: 'pointer', textDecoration: 'underline' }}>
                ← Back to Dashboard Menu
            </button>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                <h2>{viewMode === 'list' ? 'Active & Past Contests' : 'Draft a New Contest'}</h2>
                <button
                    onClick={() => setViewMode(viewMode === 'list' ? 'create' : 'list')}
                    style={{ padding: '10px 20px', backgroundColor: viewMode === 'list' ? '#28a745' : '#6c757d', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold' }}
                >
                    {viewMode === 'list' ? '+ Create Contest' : 'Cancel'}
                </button>
            </div>

            {/* ========================================= */}
            {/* VIEW 1: THE LIST VIEW                     */}
            {/* ========================================= */}
            {viewMode === 'list' && (
                <div style={{ background: 'white', borderRadius: '8px', border: '1px solid #ddd', overflow: 'hidden' }}>
                    {/* <-- NEW: Actually check if we have data, and draw the table! */}
                    {activeContests.length === 0 ? (
                        <p style={{ padding: '20px', textAlign: 'center', color: '#666' }}>No active contests. Click "+ Create Contest" to group your challenges together and open the Arena!</p>
                    ) : (
                        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                            <thead>
                                <tr style={{ backgroundColor: '#f8f9fa', borderBottom: '2px solid #ddd' }}>
                                    <th style={thStyle}>ID</th>
                                    <th style={thStyle}>Contest Title</th>
                                    <th style={thStyle}>Problems Included</th>
                                    <th style={thStyle}>Status</th>
                                </tr>
                            </thead>
                            <tbody>
                                {activeContests.map(c => (
                                    <tr key={c.id} style={{ borderBottom: '1px solid #eee' }}>
                                        <td style={tdStyle}>#{c.id}</td>
                                        <td style={{ ...tdStyle, fontWeight: 'bold', color: '#333' }}>{c.title}</td>
                                        {/* Count the commas to see how many problems there are! */}
                                        <td style={tdStyle}>{c.challengeIds.split(',').length} Problems</td>
                                        <td style={tdStyle}>
                                            {c.isActive ? (
                                                <span style={{ padding: '4px 8px', borderRadius: '12px', backgroundColor: '#d4edda', color: '#155724', fontSize: '0.85rem', fontWeight: 'bold' }}>Active</span>
                                            ) : (
                                                <span style={{ padding: '4px 8px', borderRadius: '12px', backgroundColor: '#f5d7d7', color: '#615859', fontSize: '0.85rem', fontWeight: 'bold' }}>Inactive</span>
                                            )}
                                        </td>
                                        <td style={tdStyle}>
                                            <button
                                                onClick={() => handleEditContest(c.id)}
                                                style={{ padding: '6px 12px', backgroundColor: '#3b82f6', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold' }}
                                            >
                                                View Details
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    )}
                </div>
            )}

            {/* ========================================= */}
            {/* VIEW 2: THE CREATION FORM                 */}
            {/* ========================================= */}
            {(viewMode === 'create' || viewMode === 'edit') && (
                <div style={{ background: '#ffffff', borderRadius: '8px', border: '1px solid #ddd', padding: '25px' }}>

                    <label style={labelStyle}>Contest Title</label>
                    <input type="text" placeholder="e.g., Weekly Algorithm Sprint #12" value={contestTitle} onChange={(e) => setContestTitle(e.target.value)} style={inputStyle} />
                    <label style={{ ...labelStyle, marginTop: '20px' }}>Contest Duration (in minutes)</label>
                    <input
                        type="number"
                        min="1"
                        placeholder="e.g., 90"
                        value={durationInMinutes}
                        onChange={(e) => setDurationInMinutes(parseInt(e.target.value) || 0)}
                        style={inputStyle}
                    />
                    <label style={{ ...labelStyle, marginTop: '20px' }}>Select Challenges to Include</label>
                    <p style={{ color: '#666', fontSize: '0.9rem', marginBottom: '15px' }}>Choose the problems contestants will need to solve during this event.</p>

                    <div style={{ border: '1px solid #eee', borderRadius: '4px', maxHeight: '300px', overflowY: 'auto' }}>
                        {availableChallenges.length === 0 ? (
                            <p style={{ padding: '15px', color: '#dc3545' }}>No challenges found in database. Please create challenges first.</p>
                        ) : (
                            availableChallenges.map(c => (
                                <label key={c.id} style={{ display: 'flex', alignItems: 'center', padding: '15px', borderBottom: '1px solid #eee', cursor: 'pointer', backgroundColor: selectedChallengeIds.includes(c.id) ? '#f0f8ff' : 'white' }}>
                                    <input type="checkbox" checked={selectedChallengeIds.includes(c.id)} onChange={() => handleCheckboxChange(c.id)} style={{ transform: 'scale(1.5)', marginRight: '15px', cursor: 'pointer' }} />
                                    <div>
                                        <span style={{ fontWeight: 'bold', display: 'block', color: '#333' }}>{c.title}</span>
                                        <span style={{ fontSize: '0.85rem', color: '#666' }}>{c.difficulty} | {c.points} pts</span>
                                    </div>
                                </label>
                            ))
                        )}
                    </div>

                    <div style={{ marginTop: '30px', borderTop: '1px solid #ddd', paddingTop: '20px', display: 'flex', justifyContent: 'flex-end', alignItems: 'center' }}>
                        <span style={{ fontWeight: 'bold', color: 'red' }}>{statusMessage}</span>
                        <div style={{ display: 'flex', gap: '15px' }}>
                            <button
                                onClick={() => handleProcessContest(false)}
                                style={{ padding: '12px 24px', backgroundColor: '#6c757d', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold', fontSize: '1rem' }}
                            >
                                💾 Save as Draft
                            </button>

                            <button
                                onClick={() => handleProcessContest(true)}
                                style={{ padding: '12px 24px', backgroundColor: '#007bff', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold', fontSize: '1rem' }}
                            >
                                🚀 Save & Start
                            </button>
                        </div>
                    </div>

                </div>
            )}
        </div>
    );
}

// STYLES
const inputStyle = { display: 'block', width: '100%', padding: '12px', borderRadius: '4px', border: '1px solid #ccc', boxSizing: 'border-box', fontSize: '1rem' };
const labelStyle = { display: 'block', fontWeight: 'bold', marginBottom: '8px', color: '#333' };
const thStyle = { padding: '12px 15px', color: '#555', fontWeight: 'bold' };
const tdStyle = { padding: '12px 15px', verticalAlign: 'middle' };

export default ContestManager;