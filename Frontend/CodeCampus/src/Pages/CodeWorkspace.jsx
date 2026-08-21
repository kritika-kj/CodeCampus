import React, { useState, useEffect } from 'react'; // Added useEffect
import { useNavigate, useParams } from 'react-router-dom'; // Added useParams
import Editor from '@monaco-editor/react';

function CodeWorkspace() {
    const navigate = useNavigate();

    const [isEvaluating, setIsEvaluating] = useState(false);
    const [result, setResult] = useState(null); // { status, feedback }

    // 1. THIS IS THE MAGIC HOOK! It grabs the ID from the URL (e.g., localhost:5173/workspace/5)
    const { id } = useParams();

    // 2. State to hold the real data from C#
    const [challengeData, setChallengeData] = useState(null);
    const [isLoading, setIsLoading] = useState(true);

    // State for the code editor
    const [language, setLanguage] = useState('csharp');
    const [code, setCode] = useState('// Write your code here...\nusing System;\n\npublic class Program {\n    public static void Main() {\n        Console.WriteLine("Hello CodeCampus!");\n    }\n}');

    // 3. Go get the real data from C# as soon as the page loads!
    useEffect(() => {
        const fetchChallenge = async () => {
            try {
                // Notice how we put the 'id' variable right at the end of the URL!
                const response = await fetch(`http://localhost:5174/api/challenge/${id}`);
                if (response.ok) {
                    const data = await response.json();
                    setChallengeData(data); // Save the database info to state
                } else {
                    console.error("Challenge not found");
                }
            } catch (error) {
                console.error("Failed to fetch from C# backend", error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchChallenge();
    }, [id]); // This array tells React to re-run this if the 'id' in the URL ever changes

    const handleRunCode = async () => {
        setIsEvaluating(true);
        setResult(null); // Clear previous result

        try {
            const response = await fetch('http://localhost:5174/api/submission/run', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    challengeId: id, // from useParams
                    sourceCode: code, // from Monaco editor
                    language: language // e.g., 'csharp'
                })
            });

            const data = await response.json();
            setResult(data);
        } catch (error) {
            setResult({ status: 'Error', feedback: 'Failed to connect to server.' });
        } finally {
            setIsEvaluating(false);
        }
    }

    // If we are still waiting for C# to respond, show a loading screen
    if (isLoading) {
        return <div style={{ padding: '50px', textAlign: 'center', backgroundColor: '#f4f4f4', height: '100vh' }}>Loading Arena...</div>;
    }

    // If C# couldn't find the problem, show an error
    if (!challengeData) {
        return <div style={{ padding: '50px', textAlign: 'center', backgroundColor: '#f4f4f4', height: '100vh', color: 'red' }}>Error: Challenge not found!</div>;
    }

    return (
        <div style={{ display: 'flex', height: '100vh', backgroundColor: '#f4f4f4' }}>

            {/* LEFT SIDE: The Problem Description (NOW DYNAMIC!) */}
            <div style={{ flex: 1, padding: '30px', overflowY: 'auto', borderRight: '1px solid #ddd', backgroundColor: 'white' }}>
                <button onClick={() => navigate('/dashboard')} style={{ marginBottom: '20px', background: 'none', border: 'none', color: '#007bff', cursor: 'pointer', textDecoration: 'underline', padding: 0 }}>
                    ← Back to Dashboard
                </button>

                <h1 style={{ marginTop: 0, marginBottom: '20px', color: '#333' }}>{challengeData.title}</h1>
                <span style={{ padding: '4px 8px', borderRadius: '4px', backgroundColor: '#d4edda', color: '#155724', fontWeight: 'bold', fontSize: '0.85rem' }}>
                    {challengeData.difficulty} | {challengeData.points} pts
                </span>

                <h3 style={{ marginTop: '30px', borderBottom: '1px solid #eee', paddingBottom: '10px' }}>Problem Statement</h3>
                <p style={{ lineHeight: '1.6', color: '#333' }}>{challengeData.description}</p>

                <h3 style={{ marginTop: '30px', borderBottom: '1px solid #eee', paddingBottom: '10px' }}>Input Format</h3>
                <p style={{ whiteSpace: 'pre-line', color: '#555', fontFamily: 'monospace', backgroundColor: '#f8f9fa', padding: '10px', borderRadius: '4px' }}>{challengeData.inputFormat}</p>

                <h3 style={{ marginTop: '30px', borderBottom: '1px solid #eee', paddingBottom: '10px' }}>Output Format</h3>
                <p style={{ whiteSpace: 'pre-line', color: '#555', fontFamily: 'monospace', backgroundColor: '#f8f9fa', padding: '10px', borderRadius: '4px' }}>{challengeData.outputFormat}</p>

                <div style={{ display: 'flex', gap: '20px', marginTop: '30px' }}>
                    <div style={{ flex: 1 }}>
                        <h4 style={{ marginBottom: '5px' }}>Sample Input</h4>
                        <pre style={{ backgroundColor: '#2d2d2d', color: '#fff', padding: '15px', borderRadius: '4px', margin: 0 }}>{challengeData.sampleInput}</pre>
                    </div>
                    <div style={{ flex: 1 }}>
                        <h4 style={{ marginBottom: '5px' }}>Expected Output</h4>
                        <pre style={{ backgroundColor: '#2d2d2d', color: '#fff', padding: '15px', borderRadius: '4px', margin: 0 }}>{challengeData.sampleOutput}</pre>
                    </div>
                </div>
            </div>

            {/* RIGHT SIDE: The Code Editor (Stays the same!) */}
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', backgroundColor: '#1e1e1e' }}>

                {/* Editor Header / Controls */}
                <div style={{ padding: '10px 20px', backgroundColor: '#2d2d2d', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <select
                        value={language}
                        onChange={(e) => setLanguage(e.target.value)}
                        style={{ padding: '8px', borderRadius: '4px', backgroundColor: '#444', color: 'white', border: '1px solid #555' }}
                    >
                        <option value="csharp">C# (.NET 8)</option>
                        <option value="java">Java</option>
                        <option value="python">Python</option>
                    </select>

                    <button
                        onClick={handleRunCode}
                        style={{ padding: '8px 20px', backgroundColor: '#28a745', color: 'white', border: 'none', borderRadius: '4px', fontWeight: 'bold', cursor: 'pointer' }}
                    >
                        ▶ Run Code
                    </button>
                </div>

                {/* THE ACTUAL MONACO EDITOR */}
                <div style={{ flex: 1 }}>
                    <Editor
                        height="100%"
                        theme="vs-dark"
                        language={language}
                        value={code}
                        onChange={(value) => setCode(value)}
                        options={{
                            minimap: { enabled: false },
                            fontSize: 16,
                            padding: { top: 20 }
                        }}
                    />
                </div>
            </div>

        </div>
    );
}

export default CodeWorkspace;