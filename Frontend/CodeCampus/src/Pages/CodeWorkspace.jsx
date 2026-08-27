// import React, { useState, useEffect } from 'react';
// import ContestTimer from '../Components/ContestTimer'; 
// import { useNavigate, useParams } from 'react-router-dom';
// import Editor from '@monaco-editor/react';

// function CodeWorkspace() {
//     const navigate = useNavigate();
    
//     // Using your original state variables
//     const [result, setResult] = useState(null); 
//     const [isEvaluating, setIsEvaluating] = useState(false);

//     // const { id } = useParams();
//     const { contestId, challengeId } = useParams();

//     const [challengeData, setChallengeData] = useState(null);
//     const [isLoading, setIsLoading] = useState(true);

//     const [isSubmitting, setIsSubmitting] = useState(false);

//     const [language, setLanguage] = useState('csharp');
//     const [code, setCode] = useState('// Write your code here...\nusing System;\n\npublic class Program {\n    public static void Main() {\n        Console.WriteLine("Hello CodeCampus!");\n    }\n}');

//     useEffect(() => {
//         const fetchChallenge = async () => {
//             try {
//                 // const response = await fetch(`http://localhost:5174/api/challenge/${id}`);
//                 const response = await fetch(`http://localhost:5174/api/challenge/${challengeId}`);
//                 if (response.ok) {
//                     const data = await response.json();
//                     setChallengeData(data); 
//                 } else {
//                     console.error("Challenge not found");
//                 }
//             } catch (error) {
//                 console.error("Failed to fetch from C# backend", error);
//             } finally {
//                 setIsLoading(false);
//             }
//         };

//         fetchChallenge();
//     }, [id]); 

//     const handleRunCode = async () => {
//         setIsEvaluating(true);
//         setResult(null); 

//         try {
//             const response = await fetch('http://localhost:5174/api/submission/run', {
//                 method: 'POST',
//                 headers: { 'Content-Type': 'application/json' },
//                 body: JSON.stringify({
//                     challengeId: parseInt(id), 
//                     sourceCode: code, 
//                     language: language 
//                 })
//             });

//             const data = await response.json();
//             setResult(data); 
//         } catch (error) {
//             setResult({ status: 'Error', feedback: 'Failed to connect to server.' });
//         } finally {
//             setIsEvaluating(false); 
//         }
//     };
//     const handleSubmitCode = async () => {
//         setIsSubmitting(true);
        
//         try {
            
//             const response = await fetch('http://localhost:5174/api/submission/submit', {
//                 method: 'POST',
//                 headers: { 'Content-Type': 'application/json' },
//                 body: JSON.stringify({
//                     challengeId: parseInt(id), 
//                     sourceCode: code, 
//                     language: language 
//                 })
//             });

//             if (response.ok) {
//                 // Instantly route them to a results page!
//                 navigate(`/results/${id}`); 
//             } else {
//                 alert("Failed to submit code.");
//                 setIsSubmitting(false);
//             }
//         } catch (error) {
//             console.error("Server error during submission", error);
//             setIsSubmitting(false);
//         }
//     };

//     if (isLoading) {
//         return <div style={{ padding: '50px', textAlign: 'center', backgroundColor: '#f4f4f4', height: '100vh' }}>Loading Arena...</div>;
//     }

//     if (!challengeData) {
//         return <div style={{ padding: '50px', textAlign: 'center', backgroundColor: '#f4f4f4', height: '100vh', color: 'red' }}>Error: Challenge not found!</div>;
//     }

//     return (
//         <div style={{ display: 'flex', height: '100vh', backgroundColor: '#f4f4f4' }}>

//             {/* LEFT SIDE: The Problem Description */}
//             <div style={{ flex: 1, padding: '30px', overflowY: 'auto', borderRight: '1px solid #ddd', backgroundColor: 'white' }}>
//                 <button onClick={() => navigate('/dashboard')} style={{ marginBottom: '20px', background: 'none', border: 'none', color: '#007bff', cursor: 'pointer', textDecoration: 'underline', padding: 0 }}>
//                     ← Back to Dashboard
//                 </button>

//                 <h1 style={{ marginTop: 0, marginBottom: '20px', color: '#333' }}>{challengeData.title}</h1>
//                 <span style={{ padding: '4px 8px', borderRadius: '4px', backgroundColor: '#d4edda', color: '#155724', fontWeight: 'bold', fontSize: '0.85rem' }}>
//                     {challengeData.difficulty} | {challengeData.points} pts
//                 </span>

//                 <h3 style={{ marginTop: '30px', borderBottom: '1px solid #eee', paddingBottom: '10px' }}>Problem Statement</h3>
//                 <p style={{ lineHeight: '1.6', color: '#333' }}>{challengeData.description}</p>

//                 <h3 style={{ marginTop: '30px', borderBottom: '1px solid #eee', paddingBottom: '10px' }}>Input Format</h3>
//                 <p style={{ whiteSpace: 'pre-line', color: '#555', fontFamily: 'monospace', backgroundColor: '#f8f9fa', padding: '10px', borderRadius: '4px' }}>{challengeData.inputFormat}</p>

//                 <h3 style={{ marginTop: '30px', borderBottom: '1px solid #eee', paddingBottom: '10px' }}>Output Format</h3>
//                 <p style={{ whiteSpace: 'pre-line', color: '#555', fontFamily: 'monospace', backgroundColor: '#f8f9fa', padding: '10px', borderRadius: '4px' }}>{challengeData.outputFormat}</p>

//                 <div style={{ display: 'flex', gap: '20px', marginTop: '30px' }}>
//                     <div style={{ flex: 1 }}>
//                         <h4 style={{ marginBottom: '5px' }}>Sample Input</h4>
//                         <pre style={{ backgroundColor: '#2d2d2d', color: '#fff', padding: '15px', borderRadius: '4px', margin: 0 }}>{challengeData.sampleInput}</pre>
//                     </div>
//                     <div style={{ flex: 1 }}>
//                         <h4 style={{ marginBottom: '5px' }}>Expected Output</h4>
//                         <pre style={{ backgroundColor: '#2d2d2d', color: '#fff', padding: '15px', borderRadius: '4px', margin: 0 }}>{challengeData.sampleOutput}</pre>
//                     </div>
//                 </div>
//             </div>

//             {/* RIGHT SIDE: The Code Editor + Output Container */}
//             <div style={{ flex: 1, display: 'flex', flexDirection: 'column', backgroundColor: '#1e1e1e' }}>

//                 {/* Editor Header / Controls */}
//                 <div style={{ padding: '10px 20px', backgroundColor: '#2d2d2d', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
//                     <select
//                         value={language}
//                         onChange={(e) => setLanguage(e.target.value)}
//                         style={{ padding: '8px', borderRadius: '4px', backgroundColor: '#444', color: 'white', border: '1px solid #555' }}
//                     >
//                         <option value="csharp">C# (.NET 8)</option>
//                         <option value="java">Java</option>
//                         <option value="python">Python</option>
//                     </select>

//                     {/* Timer automatically fires handleSubmitCode at 00:00:00 */}
//                     <ContestTimer 
//                         endTime="2026-12-31T23:59:00Z" 
//                         onTimeUp={handleSubmitCode} 
//                     />

//                     {/* Button Container */}
//                     <div style={{ display: 'flex', gap: '10px' }}>
//                         <button
//                             onClick={handleRunCode}
//                             disabled={isEvaluating || isSubmitting}
//                             style={{ 
//                                 padding: '8px 16px', 
//                                 backgroundColor: '#444', 
//                                 color: 'white', 
//                                 border: '1px solid #666', 
//                                 borderRadius: '4px', 
//                                 cursor: (isEvaluating || isSubmitting) ? 'not-allowed' : 'pointer' 
//                             }}
//                         >
//                             {isEvaluating ? 'Running...' : '▶ Run Code'}
//                         </button>
                        
//                         <button
//                             onClick={handleSubmitCode}
//                             disabled={isEvaluating || isSubmitting}
//                             style={{ 
//                                 padding: '8px 20px', 
//                                 backgroundColor: '#28a745', 
//                                 color: 'white', 
//                                 border: 'none', 
//                                 borderRadius: '4px', 
//                                 fontWeight: 'bold', 
//                                 cursor: (isEvaluating || isSubmitting) ? 'not-allowed' : 'pointer' 
//                             }}
//                         >
//                             {isSubmitting ? 'Submitting...' : '🚀 Final Submit'}
//                         </button>
//                     </div>
//                 </div>

//                 {/* THE ACTUAL MONACO EDITOR */}
//                 <div style={{ flex: 1 }}>
//                     <Editor
//                         height="100%"
//                         theme="vs-dark"
//                         language={language}
//                         value={code}
//                         onChange={(value) => setCode(value)}
//                         options={{
//                             minimap: { enabled: false },
//                             fontSize: 16,
//                             padding: { top: 20 }
//                         }}
//                     />
//                 </div>
//                 {/* OUTPUT RESULT SECTION (Now using strict inline styles!) */}
//                 <div style={{ padding: '20px', backgroundColor: '#1e1e1e', color: '#d4d4d4', borderTop: '1px solid #444', minHeight: '200px', overflowY: 'auto' }}>
//                     <h3 style={{ color: '#888', margin: '0 0 15px 0', fontSize: '16px', textTransform: 'uppercase', letterSpacing: '1px' }}>Test Output</h3>

//                     {isEvaluating ? (
//                         <div style={{ color: '#4da6ff', fontStyle: 'italic' }}>Running code in sandbox...</div>
//                     ) : result ? (
//                         <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
//                             <p style={{ margin: 0, fontSize: '15px' }}>
//                                 <strong style={{ color: '#fff' }}>Status: </strong>
//                                 <span style={{
//                                     color: result.status === 'Passed' ? '#28a745' : 
//                                            result.status === 'Failed' ? '#dc3545' : 
//                                            '#ffc107',
//                                     fontWeight: 'bold'
//                                 }}>
//                                     {result.status}
//                                 </span>
//                             </p>

//                             <div style={{ backgroundColor: '#000', color: '#00ff00', padding: '15px', borderRadius: '4px', fontFamily: 'monospace', fontSize: '14px', whiteSpace: 'pre-wrap', border: '1px solid #333' }}>
//                                 {result.feedback}
//                             </div>
//                         </div>
//                     ) : (
//                         <div style={{ color: '#777', fontStyle: 'italic' }}>
//                             Run your code to see the execution results here.
//                         </div>
//                     )}
//                 </div>
//             </div>

//         </div>
//     );
// }

// export default CodeWorkspace;







import React, { useState, useEffect } from 'react';
import ContestTimer from '../Components/ContestTimer'; 
import { useNavigate, useParams } from 'react-router-dom';
import Editor from '@monaco-editor/react';

function CodeWorkspace() {
    const navigate = useNavigate();
    
    const [result, setResult] = useState(null); 
    const [isEvaluating, setIsEvaluating] = useState(false);

    // EXACT MATCH: Using 'id' so it perfectly aligns with your App.jsx route parameters
    const { contestId, challengeId } = useParams();

    const [challengeData, setChallengeData] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const [language, setLanguage] = useState('csharp');
    const [code, setCode] = useState('// Write your code here...\nusing System;\n\npublic class Program {\n    public static void Main() {\n        Console.WriteLine("Hello CodeCampus!");\n    }\n}');

    // Dynamically grabs your logged-in User ID from your existing login system
    const activeUserId = sessionStorage.getItem('userId') ? parseInt(sessionStorage.getItem('userId')) : 1;

    useEffect(() => {
        const fetchChallenge = async () => {
            try {
                // Now fetching with the correctly extracted 'id'
                const response = await fetch(`http://localhost:5174/api/challenge/${challengeId}`);
                if (response.ok) {
                    const data = await response.json();
                    setChallengeData(data); 
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
    }, [challengeId]); 

    const handleRunCode = async () => {
        setIsEvaluating(true);
        setResult(null); 

        try {
            const response = await fetch('http://localhost:5174/api/submission/run', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    challengeId: parseInt(challengeId), // Maps the URL 'id' to the C# 'challengeId'
                    sourceCode: code, 
                    language: language 
                })
            });

            const data = await response.json();
            setResult(data); 
        } catch (error) {
            setResult({ status: 'Error', feedback: 'Failed to connect to server.' });
        } finally {
            setIsEvaluating(false); 
        }
    };

    const handleSubmitCode = async () => {
        setIsSubmitting(true);
        
        try {
            const response = await fetch('http://localhost:5174/api/submission/submit', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    userId: activeUserId,       // Linked to your existing login flow
                    challengeId: parseInt(challengeId),  // Maps the URL 'id' to the C# 'challengeId'
                    contestId: parseInt(contestId), 
                    sourceCode: code, 
                    language: language 
                })
            });

            if (response.ok) {
                // Routes back to the contest hub when done instead of the main dashboard
                navigate(`/contest/${contestId}`); 
            } else {
                alert("Failed to submit code.");
                setIsSubmitting(false);
            }
        } catch (error) {
            console.error("Server error during submission", error);
            setIsSubmitting(false);
        }
    };

    if (isLoading) {
        return <div style={{ padding: '50px', textAlign: 'center', backgroundColor: '#f4f4f4', height: '100vh' }}>Loading Arena...</div>;
    }

    if (!challengeData) {
        return <div style={{ padding: '50px', textAlign: 'center', backgroundColor: '#f4f4f4', height: '100vh', color: 'red' }}>Error: Challenge not found!</div>;
    }

    return (
        <div style={{ display: 'flex', height: '100vh', backgroundColor: '#f4f4f4' }}>

            {/* LEFT SIDE: The Problem Description */}
            <div style={{ flex: 1, padding: '30px', overflowY: 'auto', borderRight: '1px solid #ddd', backgroundColor: 'white' }}>
                
                {/* Updated back button to return to the specific contest instead of kicking them out of the event entirely */}
                <button onClick={() => navigate(`/contest/${contestId}`)} style={{ marginBottom: '20px', background: 'none', border: 'none', color: '#007bff', cursor: 'pointer', textDecoration: 'underline', padding: 0 }}>
                    ← Back to Contest
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

            {/* RIGHT SIDE: The Code Editor + Output Container */}
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

                    <ContestTimer 
                        endTime="2026-12-31T23:59:00Z" 
                        onTimeUp={handleSubmitCode} 
                    />

                    <div style={{ display: 'flex', gap: '10px' }}>
                        <button
                            onClick={handleRunCode}
                            disabled={isEvaluating || isSubmitting}
                            style={{ 
                                padding: '8px 16px', 
                                backgroundColor: '#444', 
                                color: 'white', 
                                border: '1px solid #666', 
                                borderRadius: '4px', 
                                cursor: (isEvaluating || isSubmitting) ? 'not-allowed' : 'pointer' 
                            }}
                        >
                            {isEvaluating ? 'Running...' : '▶ Run Code'}
                        </button>
                        
                        <button
                            onClick={handleSubmitCode}
                            disabled={isEvaluating || isSubmitting}
                            style={{ 
                                padding: '8px 20px', 
                                backgroundColor: '#28a745', 
                                color: 'white', 
                                border: 'none', 
                                borderRadius: '4px', 
                                fontWeight: 'bold', 
                                cursor: (isEvaluating || isSubmitting) ? 'not-allowed' : 'pointer' 
                            }}
                        >
                            {isSubmitting ? 'Submitting...' : '🚀 Final Submit'}
                        </button>
                    </div>
                </div>

                <div style={{ flex: 1 }}>
                    <Editor
                        height="100%"
                        theme="vs-dark"
                        language={language}
                        value={code}
                        onChange={(value) => setCode(value)}
                        options={{ minimap: { enabled: false }, fontSize: 16, padding: { top: 20 } }}
                    />
                </div>
                
                <div style={{ padding: '20px', backgroundColor: '#1e1e1e', color: '#d4d4d4', borderTop: '1px solid #444', minHeight: '200px', overflowY: 'auto' }}>
                    <h3 style={{ color: '#888', margin: '0 0 15px 0', fontSize: '16px', textTransform: 'uppercase', letterSpacing: '1px' }}>Test Output</h3>

                    {isEvaluating ? (
                        <div style={{ color: '#4da6ff', fontStyle: 'italic' }}>Running code in sandbox...</div>
                    ) : result ? (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                            <p style={{ margin: 0, fontSize: '15px' }}>
                                <strong style={{ color: '#fff' }}>Status: </strong>
                                <span style={{
                                    color: result.status === 'Passed' ? '#28a745' : 
                                           result.status === 'Failed' ? '#dc3545' : '#ffc107',
                                    fontWeight: 'bold'
                                }}>
                                    {result.status}
                                </span>
                            </p>
                            <div style={{ backgroundColor: '#000', color: '#00ff00', padding: '15px', borderRadius: '4px', fontFamily: 'monospace', fontSize: '14px', whiteSpace: 'pre-wrap', border: '1px solid #333' }}>
                                {result.feedback}
                            </div>
                        </div>
                    ) : (
                        <div style={{ color: '#777', fontStyle: 'italic' }}>
                            Run your code to see the execution results here.
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

export default CodeWorkspace;