import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './Dashboard.css';

function AllContestPage() {
    const navigate = useNavigate();
    const [contests, setContests] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchContests = async () => {
            try {
                const token = sessionStorage.getItem('codeCampusToken');
                const response = await fetch('http://localhost:5174/api/Contest/allcontest', {
                    method: 'GET',
                    headers: {
                        // 'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    }
                });
                if (response.ok) {
                    const data = await response.json();
                    setContests(data);
                } else {
                    console.error('Failed to fetch contests:', response.status);
                    setContests([]);
                }
            } catch (error) {
                console.error('Error fetching contests:', error);
                setContests([]);
            } finally {
                setIsLoading(false);
            }
        };

        fetchContests();
    }, []);

    const handleViewDetails = (contestId) => {
        navigate(`/results/${contestId}`, { state: { viewMode: 'mod' } });
    };

    if (isLoading) {
        return (
            <div style={{ padding: '50px', textAlign: 'center', color: '#e2e8f0' }}>
                Loading contests...
            </div>
        );
    }

    return (
        // <div className="dashboard-container" style={{ maxWidth: '1200px', margin: '0 auto' }}>
        <div style={{ maxWidth: '900px', margin: '0 auto', padding: '20px' }}>
            <h1 style={{ color: '#4ade80', fontSize: '2rem', margin: '0 0 30px 0' }}>All Contests</h1>

            {contests.length === 0 ? (
                <div style={{
                    padding: '40px',
                    textAlign: 'center',
                    background: 'rgba(15, 23, 42, 0.65)',
                    borderRadius: '10px',
                    border: '1px solid rgba(74, 222, 128, 0.25)',
                    color: '#cbd5e1'
                }}>
                    <p style={{ fontSize: '1.1rem', margin: 0 }}>No contests found</p>
                </div>
            ) : (
                <div style={{
                    background: 'rgba(15, 23, 42, 0.65)',
                    borderRadius: '10px',
                    overflow: 'hidden',
                    border: '1px solid rgba(74, 222, 128, 0.25)'
                }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                        <thead>
                            <tr style={{ backgroundColor: 'rgba(20, 20, 20, 0.9)' }}>
                                <th style={thStyle}>Contest ID</th>
                                <th style={thStyle}>Title</th>
                                <th style={thStyle}>Start Time</th>
                                <th style={thStyle}>Student Count</th>
                                <th style={thStyle}>Action</th>

                            </tr>
                        </thead>
                        <tbody>
                            {contests.map((contest) => (
                                <tr key={contest.id} style={{ borderBottom: '1px solid rgba(148, 163, 184, 0.2)' }}>
                                    <td style={tdStyle}>{contest.id}</td>
                                    <td style={tdStyle}><strong>{contest.title || 'Untitled'}</strong></td>
                                    <td style={tdStyle}>
                                        {contest.startTime ? new Date(contest.startTime).toLocaleDateString() : '-'}
                                    </td>
                                    <td style={tdStyle}>{contest.studentCount || 0}</td>
                                    <td style={tdStyle}>
                                        <button
                                            onClick={() => handleViewDetails(contest.id)}
                                            style={{
                                                padding: '6px 12px',
                                                backgroundColor: '#3b82f6',
                                                color: 'white',
                                                border: 'none',
                                                borderRadius: '4px',
                                                cursor: 'pointer',
                                                fontSize: '0.9rem'
                                            }}
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

const thStyle = {
    padding: '12px 15px',
    borderBottom: '1px solid rgba(148, 163, 184, 0.2)',
    color: '#4ade80',
    fontWeight: 'bold'
};

const tdStyle = {
    padding: '12px 15px',
    verticalAlign: 'top',
    color: '#e2e8f0',
    background: 'rgba(15, 23, 42, 0.2)'
};

export default AllContestPage;