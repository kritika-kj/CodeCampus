import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Editor from '@monaco-editor/react';

function CodeWorkspace() {
    const navigate = useNavigate();
    
    // We will eventually fetch this data from C#, but here is a placeholder to build the UI!
    const mockChallenge = {
        title: "Find the Missing Number",
        difficulty: "Easy",
        points: 20,
        description: "You are given an array containing N distinct numbers taken from the range 0 to N. Find the one number that is missing.",
        inputFormat: "The first line contains an integer N.\nThe second line contains N space-separated integers.",
        outputFormat: "Print a single integer representing the missing number.",
        sampleInput: "3\n3 0 1",
        sampleOutput: "2"
    };

    // State for the code editor
    const [language, setLanguage] = useState('csharp');
    const [code, setCode] = useState('// Write your code here...\nusing System;\n\npublic class Program {\n    public static void Main() {\n        Console.WriteLine("Hello CodeCampus!");\n    }\n}');

    const handleRunCode = () => {
        alert("Sending code to C# execution engine...");
        // We will build the execution logic later!
    };

    return (
        <div style={{ display: 'flex', height: '100vh', backgroundColor: '#f4f4f4' }}>
            
            {/* LEFT SIDE: The Problem Description */}
            <div style={{ flex: 1, padding: '30px', overflowY: 'auto', borderRight: '1px solid #ddd', backgroundColor: 'white' }}>
                <button onClick={() => navigate('/dashboard')} style={{ marginBottom: '20px', background: 'none', border: 'none', color: '#007bff', cursor: 'pointer', textDecoration: 'underline', padding: 0 }}>
                    ← Back to Dashboard
                </button>
                
                <h1 style={{ marginTop: 0, marginBottom: '10px' }}>{mockChallenge.title}</h1>
                <span style={{ padding: '4px 8px', borderRadius: '4px', backgroundColor: '#d4edda', color: '#155724', fontWeight: 'bold', fontSize: '0.85rem' }}>
                    {mockChallenge.difficulty} | {mockChallenge.points} pts
                </span>

                <h3 style={{ marginTop: '30px', borderBottom: '1px solid #eee', paddingBottom: '10px' }}>Problem Statement</h3>
                <p style={{ lineHeight: '1.6', color: '#333' }}>{mockChallenge.description}</p>

                <h3 style={{ marginTop: '30px', borderBottom: '1px solid #eee', paddingBottom: '10px' }}>Input Format</h3>
                <p style={{ whiteSpace: 'pre-line', color: '#555', fontFamily: 'monospace', backgroundColor: '#f8f9fa', padding: '10px', borderRadius: '4px' }}>{mockChallenge.inputFormat}</p>

                <h3 style={{ marginTop: '30px', borderBottom: '1px solid #eee', paddingBottom: '10px' }}>Output Format</h3>
                <p style={{ whiteSpace: 'pre-line', color: '#555', fontFamily: 'monospace', backgroundColor: '#f8f9fa', padding: '10px', borderRadius: '4px' }}>{mockChallenge.outputFormat}</p>

                <div style={{ display: 'flex', gap: '20px', marginTop: '30px' }}>
                    <div style={{ flex: 1 }}>
                        <h4 style={{ marginBottom: '5px' }}>Sample Input</h4>
                        <pre style={{ backgroundColor: '#2d2d2d', color: '#fff', padding: '15px', borderRadius: '4px', margin: 0 }}>{mockChallenge.sampleInput}</pre>
                    </div>
                    <div style={{ flex: 1 }}>
                        <h4 style={{ marginBottom: '5px' }}>Expected Output</h4>
                        <pre style={{ backgroundColor: '#2d2d2d', color: '#fff', padding: '15px', borderRadius: '4px', margin: 0 }}>{mockChallenge.sampleOutput}</pre>
                    </div>
                </div>
            </div>

            {/* RIGHT SIDE: The Code Editor */}
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