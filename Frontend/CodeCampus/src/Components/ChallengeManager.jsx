import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

function ChallengeManager() {
    const navigate = useNavigate();
    
    // --- STATE MANAGEMENT ---
    const [viewMode, setViewMode] = useState('list'); // 'list' or 'create'
    const [challenges, setChallenges] = useState([]);
    const [isLoading, setIsLoading] = useState(false);

    // Form State 
    const [activeTab, setActiveTab] = useState('General');
    const [title, setTitle] = useState('');
    const [difficulty, setDifficulty] = useState('Easy');
    const [points, setPoints] = useState(10);
    const [description, setDescription] = useState('');
    const [inputFormat, setInputFormat] = useState('');
    const [outputFormat, setOutputFormat] = useState('');
    const [constraints, setConstraints] = useState('');
    const [statusMessage, setStatusMessage] = useState('');

    // --- NEW: Dynamic Test Cases State ---
    const [testCases, setTestCases] = useState([
        { inputData: '', expectedOutput: '', isHidden: false }
    ]);

    // --- FETCH DATA ---
    useEffect(() => {
        if (viewMode === 'list') {
            fetchChallenges();
        }
    }, [viewMode]);

    const fetchChallenges = async () => {
        setIsLoading(true);
        try {
            const response = await fetch('http://localhost:5174/api/challenge');
            if (response.ok) {
                const data = await response.json();
                setChallenges(data);
            } else {
                console.error("Failed to fetch challenges");
            }
        } catch (error) {
            console.error("Server error:", error);
        }
        setIsLoading(false);
    };

    // --- TEST CASE HANDLERS ---
    const handleTestCaseChange = (index, field, value) => {
        const updated = [...testCases];
        updated[index][field] = value;
        setTestCases(updated);
    };

    const addTestCase = () => {
        // Defaults new test cases to hidden so students don't see all of them
        setTestCases([...testCases, { inputData: '', expectedOutput: '', isHidden: true }]);
    };

    const removeTestCase = (index) => {
        const updated = testCases.filter((_, i) => i !== index);
        setTestCases(updated);
    };

    // --- SUBMIT DATA ---
    const handlePublish = async () => {
        setStatusMessage('Publishing...');
        try {
            const response = await fetch('http://localhost:5174/api/challenge/create', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                // Notice we are sending testCases instead of sampleInput/Output
                body: JSON.stringify({ 
                    title, description, difficulty, points, 
                    inputFormat, outputFormat, constraints, 
                    testCases 
                }) 
            });

            if (response.ok) {
                // Clear form and go back to list
                setTitle(''); setDescription(''); setInputFormat(''); setOutputFormat(''); setConstraints(''); 
                setTestCases([{ inputData: '', expectedOutput: '', isHidden: false }]);
                setStatusMessage('');
                setViewMode('list'); 
            } else {
                setStatusMessage('❌ Failed to publish challenge.');
            }
        } catch (error) {
            setStatusMessage('❌ Server error.');
        }
    };

    // Helper for tabs
    const TabButton = ({ name }) => (
        <button onClick={() => setActiveTab(name)} style={{ padding: '10px 20px', cursor: 'pointer', border: 'none', background: 'none', borderBottom: activeTab === name ? '3px solid #007bff' : '3px solid transparent', fontWeight: activeTab === name ? 'bold' : 'normal', color: activeTab === name ? '#007bff' : '#555' }}>
            {name}
        </button>
    );

    return (
        <div style={{ maxWidth: '900px', margin: '0 auto', padding: '20px' }}>
            <button onClick={() => navigate('/dashboard')} style={{ marginBottom: '20px', background: 'none', border: 'none', color: '#007bff', cursor: 'pointer', textDecoration: 'underline' }}>
                ← Back to Dashboard Menu
            </button>
            
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                <h2>{viewMode === 'list' ? 'Challenge Repository' : 'Create Modular Challenge'}</h2>
                <button 
                    onClick={() => setViewMode(viewMode === 'list' ? 'create' : 'list')}
                    style={{ padding: '10px 20px', backgroundColor: viewMode === 'list' ? '#28a745' : '#6c757d', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold' }}
                >
                    {viewMode === 'list' ? '+ Create New Challenge' : 'Cancel & Return'}
                </button>
            </div>

            {/* ========================================= */}
            {/* VIEW 1: THE LIST VIEW                     */}
            {/* ========================================= */}
            {viewMode === 'list' && (
                <div style={{ background: 'white', borderRadius: '8px', border: '1px solid #ddd', overflow: 'hidden' }}>
                    {isLoading ? (
                        <p style={{ padding: '20px', textAlign: 'center' }}>Loading challenges...</p>
                    ) : challenges.length === 0 ? (
                        <p style={{ padding: '20px', textAlign: 'center', color: '#666' }}>No challenges found. Create one!</p>
                    ) : (
                        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                            <thead>
                                <tr style={{ backgroundColor: '#f8f9fa', borderBottom: '2px solid #ddd' }}>
                                    <th style={thStyle}>ID</th>
                                    <th style={thStyle}>Title</th>
                                    <th style={thStyle}>Difficulty</th>
                                    <th style={thStyle}>Points</th>
                                    {/* <th style={thStyle}>Actions</th> */}
                                </tr>
                            </thead>
                            <tbody>
                                {challenges.map(c => (
                                    <tr key={c.id} style={{ borderBottom: '1px solid #eee' }}>
                                        <td style={tdStyle}>#{c.id}</td>
                                        <td style={{...tdStyle, fontWeight: 'bold', color: '#333'}}>{c.title}</td>
                                        <td style={tdStyle}>
                                            <span style={{ 
                                                padding: '4px 8px', borderRadius: '12px', fontSize: '0.85rem', fontWeight: 'bold',
                                                backgroundColor: c.difficulty === 'Easy' ? '#d4edda' : c.difficulty === 'Medium' ? '#fff3cd' : '#f8d7da',
                                                color: c.difficulty === 'Easy' ? '#155724' : c.difficulty === 'Medium' ? '#856404' : '#721c24'
                                            }}>
                                                {c.difficulty}
                                            </span>
                                        </td>
                                        <td style={tdStyle}>{c.points} pts</td>
                                        {/* <td style={tdStyle}>
                                            <button style={{...actionBtnStyle, color: '#007bff'}}>Edit</button>
                                            <button style={{...actionBtnStyle, color: '#dc3545'}}>Delete</button>
                                        </td> */}
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
            {viewMode === 'create' && (
                <div style={{ background: '#ffffff', borderRadius: '8px', border: '1px solid #ddd', overflow: 'hidden' }}>
                    <div style={{ display: 'flex', borderBottom: '1px solid #ddd', backgroundColor: '#f8f9fa' }}>
                        <TabButton name="General" />
                        <TabButton name="Problem Statement" />
                        <TabButton name="Constraints & Formats" />
                        <TabButton name="Test Cases" />
                    </div>

                    <div style={{ padding: '25px' }}>
                        {activeTab === 'General' && (
                            <div>
                                <label style={labelStyle}>Challenge Title</label>
                                <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} style={inputStyle} />
                                <div style={{ display: 'flex', gap: '15px' }}>
                                    <div style={{ flex: 1 }}>
                                        <label style={labelStyle}>Difficulty</label>
                                        <select value={difficulty} onChange={(e) => setDifficulty(e.target.value)} style={inputStyle}>
                                            <option value="Easy">Easy</option><option value="Medium">Medium</option><option value="Hard">Hard</option>
                                        </select>
                                    </div>
                                    <div style={{ flex: 1 }}>
                                        <label style={labelStyle}>Points Awarded</label>
                                        <input type="number" value={points} onChange={(e) => setPoints(Number(e.target.value))} style={inputStyle} />
                                    </div>
                                </div>
                            </div>
                        )}
                        {activeTab === 'Problem Statement' && (
                            <div><label style={labelStyle}>The Story / Explanation</label><textarea rows="8" value={description} onChange={(e) => setDescription(e.target.value)} style={inputStyle}></textarea></div>
                        )}
                        {activeTab === 'Constraints & Formats' && (
                            <div>
                                <label style={labelStyle}>Input Format</label><textarea rows="3" value={inputFormat} onChange={(e) => setInputFormat(e.target.value)} style={inputStyle}></textarea>
                                <label style={labelStyle}>Constraints</label><input type="text" value={constraints} onChange={(e) => setConstraints(e.target.value)} style={inputStyle} />
                                <label style={labelStyle}>Output Format</label><textarea rows="3" value={outputFormat} onChange={(e) => setOutputFormat(e.target.value)} style={inputStyle}></textarea>
                            </div>
                        )}
                        
                        {/* THE DYNAMIC TEST CASES TAB */}
                        {activeTab === 'Test Cases' && (
                            <div>
                                {testCases.map((tc, index) => (
                                    <div key={index} style={{ display: 'flex', gap: '15px', marginBottom: '20px', padding: '15px', border: '1px solid #ddd', borderRadius: '6px', backgroundColor: '#f8f9fa' }}>
                                        <div style={{ flex: 1 }}>
                                            <label style={labelStyle}>Input {index + 1}</label>
                                            <textarea rows="4" value={tc.inputData} onChange={(e) => handleTestCaseChange(index, 'inputData', e.target.value)} style={{...inputStyle, marginBottom: '10px', fontFamily: 'monospace'}}></textarea>
                                            
                                            <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', color: '#555' }}>
                                                <input 
                                                    type="checkbox" 
                                                    checked={tc.isHidden} 
                                                    onChange={(e) => handleTestCaseChange(index, 'isHidden', e.target.checked)} 
                                                />
                                                Hidden Test Case (For Grading Only)
                                            </label>
                                        </div>
                                        <div style={{ flex: 1 }}>
                                            <label style={labelStyle}>Expected Output {index + 1}</label>
                                            <textarea rows="4" value={tc.expectedOutput} onChange={(e) => handleTestCaseChange(index, 'expectedOutput', e.target.value)} style={{...inputStyle, marginBottom: '10px', fontFamily: 'monospace'}}></textarea>
                                            
                                            {/* Only show delete button if there is more than 1 test case */}
                                            {testCases.length > 1 && (
                                                <div style={{ textAlign: 'right' }}>
                                                    <button onClick={() => removeTestCase(index)} style={{ padding: '6px 12px', backgroundColor: '#dc3545', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', fontSize: '0.85rem' }}>
                                                        Remove
                                                    </button>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                ))}
                                
                                <button onClick={addTestCase} type="button" style={{ padding: '10px 20px', backgroundColor: '#007bff', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold' }}>
                                    + Add Another Test Case
                                </button>
                            </div>
                        )}
                    </div>

                    <div style={{ padding: '20px', borderTop: '1px solid #ddd', backgroundColor: '#f8f9fa', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <span style={{ fontWeight: 'bold', color: statusMessage.includes('✅') ? 'green' : 'red' }}>{statusMessage}</span>
                        <button onClick={handlePublish} style={{ padding: '10px 24px', backgroundColor: '#28a745', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold', fontSize: '1rem' }}>
                            Publish to Database
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}

// Styles
const inputStyle = { display: 'block', width: '100%', marginBottom: '20px', padding: '10px', borderRadius: '4px', border: '1px solid #ccc', boxSizing: 'border-box', fontSize: '1rem' };
const labelStyle = { display: 'block', fontWeight: 'bold', marginBottom: '8px', color: '#333' };
const thStyle = { padding: '12px 15px', color: '#555', fontWeight: 'bold' };
const tdStyle = { padding: '12px 15px', verticalAlign: 'middle' };
const actionBtnStyle = { background: 'none', border: 'none', cursor: 'pointer', marginRight: '15px', fontWeight: 'bold', textDecoration: 'underline' };

export default ChallengeManager;