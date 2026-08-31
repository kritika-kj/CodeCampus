import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

function Submissions() {
    const [submissions, setSubmissions] = useState([]);
    const activeUserId = sessionStorage.getItem('userId')
    useEffect(() => {
        const fetchSubmissions = async () => {
            try {
                const response = await fetch(`http://localhost:5174/api/Contest/${activeUserId}/viewsubmissions`);
                if (response.ok) {
                    const data = await response.json();
                    setSubmissions(data);
                } else {
                    console.error("No contest found");
                }
            } catch (error) {
                console.error("Failed to load submissions:", error);
            }
        };
        fetchSubmissions();
    }, []);
    // const GetSubmissionDetails = async (contestId) => {
    //     try {
    // };
    return (
        <div style={{ maxWidth: '900px', margin: '0 auto', padding: '20px' }}>
            <button onClick={() => navigate('/dashboard')} style={{ marginBottom: '20px', background: 'none', border: 'none', color: '#007bff', cursor: 'pointer', textDecoration: 'underline' }}>
                ← Back to Dashboard Menu
            </button>
            <div style={{ background: 'white', borderRadius: '8px', border: '1px solid #ddd', overflow: 'hidden' }}>
                {submissions.length === 0 ? (
                    <p style={{ padding: '20px', textAlign: 'center', color: '#666' }}>No submissions found.</p>
                ) : (
                    <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                        <thead>
                            <tr style={{ backgroundColor: '#f8f9fa', borderBottom: '2px solid #ddd' }}>
                                <th style={thStyle}>ID</th>
                                <th style={thStyle}>Contest Title</th>
                                <th style={thStyle}>Total Points</th>
                                <th style={thStyle}>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {submissions.map(s => (
                                <tr key={s.contestId} style={{ borderBottom: '1px solid #eee' }}>
                                    <td style={tdStyle}>#{s.contestId}</td>
                                    <td style={{ ...tdStyle, fontWeight: 'bold', color: '#333' }}>{s.contestTitle}</td>
                                    <td style={tdStyle}>{s.totalPoints}</td>
                                    <td style={tdStyle}>
                                        <button 
                                        onClick={() => GetSubmissionDetails(s.contestId)}
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
        </div>
    )

}
const inputStyle = { display: 'block', width: '100%', padding: '12px', borderRadius: '4px', border: '1px solid #ccc', boxSizing: 'border-box', fontSize: '1rem' };
const labelStyle = { display: 'block', fontWeight: 'bold', marginBottom: '8px', color: '#000000' };
const thStyle = {  padding: '12px 15px', color: '#060606', fontWeight: 'bold' };
const tdStyle = { padding: '12px 15px', verticalAlign: 'middle',fontWeight: 'bold', color: '#686565'  };

export default Submissions;