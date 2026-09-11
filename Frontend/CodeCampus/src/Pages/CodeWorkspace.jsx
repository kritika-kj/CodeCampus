import React, { useState, useEffect } from 'react';
import ContestTimer from '../Components/ContestTimer';
import { useNavigate, useParams } from 'react-router-dom';
import Editor from '@monaco-editor/react';
const BOILERPLATE_CODE = {
    csharp: 'using System;\n\npublic class Program {\n    public static void Main() {\n        // Write your code here...\n    }\n}',
    java: 'public class Main {\n    public static void main(String[] args) {\n        // Write your code here...\n    }\n}',
    python: '# Write your code here...\n'
};

function CodeWorkspace() {
    const navigate = useNavigate();

    const [result, setResult] = useState(null);
    const [isEvaluating, setIsEvaluating] = useState(false);

    // EXACT MATCH: Using 'id' so it perfectly aligns with your App.jsx route parameters
    const { contestId, challengeId } = useParams();
    const [contest, setContest] = useState(null);
    const [challengeData, setChallengeData] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const [language, setLanguage] = useState('csharp');
    const [code, setCode] = useState(BOILERPLATE_CODE.csharp);

    useEffect(() => {
        setCode(BOILERPLATE_CODE[language] || BOILERPLATE_CODE.csharp);
    }, [language]);

    // useEffect(() => {
    //     const fetchChallenge = async () => {
    //         try {
    //             const response = await fetch(`http://localhost:5174/api/challenge/${challengeId}`);
    //             if (response.ok) {
    //                 const data = await response.json();
    //                 setChallengeData(data);
    //             } else {
    //                 console.error("Challenge not found");
    //             }
    //         } catch (error) {
    //             console.error("Failed to fetch from C# backend", error);
    //         } finally {
    //             setIsLoading(false);
    //         }
    //     };

    //     fetchChallenge();
    // }, [challengeId]);
    useEffect(() => {
        const fetchWorkspaceData = async () => {
            try {
                const [challengeRes, contestRes] = await Promise.all([
                    fetch(`http://localhost:5174/api/challenge/${challengeId}`),
                    fetch(`http://localhost:5174/api/contest/${contestId}`)
                ]);

                if (challengeRes.ok) {
                    setChallengeData(await challengeRes.json());
                } else {
                    console.error("Challenge not found");
                }

                if (contestRes.ok) {
                    setContest(await contestRes.json());
                } else {
                    console.error("Contest not found");
                }
            } catch (error) {
                console.error("Failed to fetch workspace data", error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchWorkspaceData();
    }, [challengeId, contestId]);

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

        const activeUserId = Number(sessionStorage.getItem('userId') || 1);

        try {
            const response = await fetch('http://localhost:5174/api/submission/submit', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    userId: activeUserId,
                    challengeId: parseInt(challengeId),
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

            <div style={{ flex: 1, padding: '40px', overflowY: 'auto', borderRight: '1px solid #e2e8f0', backgroundColor: '#ffffff', fontFamily: 'system-ui, -apple-system, sans-serif' }}>

                <button onClick={() => navigate(`/contest/${contestId}`)} style={{ display: 'inline-flex', alignItems: 'center', marginBottom: '24px', background: 'none', border: 'none', color: '#64748b', cursor: 'pointer', fontSize: '0.9rem', padding: 0, fontWeight: '500', transition: 'color 0.2s' }}>
                    ← Back to Contest
                </button>

                <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '32px', flexWrap: 'wrap' }}>
                    <h1 style={{ margin: 0, color: '#0f172a', fontSize: '2.2rem', fontWeight: '800', letterSpacing: '-0.5px' }}>
                        {challengeData.title}
                    </h1>
                    <span style={{ padding: '6px 14px', borderRadius: '999px', backgroundColor: '#dcfce7', color: '#166534', fontWeight: '700', fontSize: '0.75rem', letterSpacing: '0.5px', textTransform: 'uppercase' }}>
                        {challengeData.difficulty} | {challengeData.points} pts
                    </span>
                </div>

                <h3 style={{ margin: '0 0 12px 0', color: '#334155', fontSize: '1.25rem', fontWeight: '700', borderBottom: '2px solid #f1f5f9', paddingBottom: '10px' }}>
                    Problem Statement
                </h3>
                <p style={{ lineHeight: '1.7', color: '#475569', fontSize: '1.05rem', margin: '0 0 32px 0' }}>
                    {challengeData.description}
                </p>

                <h3 style={{ margin: '0 0 12px 0', color: '#334155', fontSize: '1.25rem', fontWeight: '700', borderBottom: '2px solid #f1f5f9', paddingBottom: '10px' }}>
                    Input Format
                </h3>
                <p style={{ whiteSpace: 'pre-line', color: '#0f172a', fontFamily: 'Consolas, monospace', backgroundColor: '#f8fafc', padding: '16px', borderRadius: '8px', border: '1px solid #e2e8f0', fontSize: '0.95rem', margin: '0 0 32px 0' }}>
                    {challengeData.inputFormat}
                </p>

                <h3 style={{ margin: '0 0 12px 0', color: '#334155', fontSize: '1.25rem', fontWeight: '700', borderBottom: '2px solid #f1f5f9', paddingBottom: '10px' }}>
                    Output Format
                </h3>
                <p style={{ whiteSpace: 'pre-line', color: '#0f172a', fontFamily: 'Consolas, monospace', backgroundColor: '#f8fafc', padding: '16px', borderRadius: '8px', border: '1px solid #e2e8f0', fontSize: '0.95rem', margin: '0 0 40px 0' }}>
                    {challengeData.outputFormat}
                </p>
                <h3 style={{ margin: '0 0 12px 0', color: '#334155', fontSize: '1.25rem', fontWeight: '700', borderBottom: '2px solid #f1f5f9', paddingBottom: '10px' }}>
                    Constraints
                </h3>
                <p style={{ whiteSpace: 'pre-line', color: '#0f172a', fontFamily: 'Consolas, monospace', backgroundColor: '#f8fafc', padding: '16px', borderRadius: '8px', border: '1px solid #e2e8f0', fontSize: '0.95rem', margin: '0 0 40px 0' }}>
                    {challengeData.constraints}
                </p>

                <h3 style={{ margin: '0 0 16px 0', color: '#334155', fontSize: '1.25rem', fontWeight: '700', borderBottom: '2px solid #f1f5f9', paddingBottom: '10px' }}>
                    Sample Test Cases
                </h3>

                {challengeData.testCases && challengeData.testCases.map((tc, index) => (
                    <div key={tc.id} style={{ display: 'flex', gap: '20px', marginBottom: '20px', padding: '20px', backgroundColor: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '8px' }}>

                        <div style={{ flex: 1 }}>
                            <h4 style={{ margin: '0 0 10px 0', color: '#64748b', fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                                Input {index + 1}
                            </h4>
                            <pre style={{ backgroundColor: '#ffffff', color: '#0f172a', padding: '12px 16px', borderRadius: '6px', margin: 0, fontFamily: 'Consolas, monospace', border: '1px solid #cbd5e1', fontSize: '0.95rem' }}>
                                {tc.inputData}
                            </pre>
                        </div>

                        <div style={{ flex: 1 }}>
                            <h4 style={{ margin: '0 0 10px 0', color: '#64748b', fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                                Expected Output {index + 1}
                            </h4>
                            <pre style={{ backgroundColor: '#ffffff', color: '#0f172a', padding: '12px 16px', borderRadius: '6px', margin: 0, fontFamily: 'Consolas, monospace', border: '1px solid #cbd5e1', fontSize: '0.95rem' }}>
                                {tc.expectedOutput}
                            </pre>
                        </div>

                    </div>
                ))}
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
                    {contest && (
                        <ContestTimer
                            endTime={contest.endTime}
                            onTimeUp={handleSubmitCode}
                        />
                    )}

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
                <div
                    style={{ flex: 1 }}
                    onCopyCapture={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                    }}
                    onPasteCapture={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                    }}
                    onCutCapture={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                    }}
                >
                    {/* <div style={{ flex: 1 }}> */}
                    <Editor
                        height="100%"
                        theme="vs-dark"
                        language={language}
                        value={code}
                        onChange={(newValue) => setCode(newValue)}
                        options={{ minimap: { enabled: false }, fontSize: 16, padding: { top: 20 }, quickSuggestions: false, suggestOnTriggerCharacters: false, parameterHints: { enabled: false }, wordBasedSuggestions: 'off', snippetSuggestions: 'none' }}
                    />
                    {/* </div> */}
                </div>
                <div style={{ padding: '20px', backgroundColor: '#1e1e1e', color: '#d4d4d4', borderTop: '1px solid #444', minHeight: '200px', overflowY: 'auto' }}>
                    <h3 style={{ color: '#888', margin: '0 0 15px 0', fontSize: '16px', textTransform: 'uppercase', letterSpacing: '1px' }}>Test Output</h3>

                    {isEvaluating ? (
                        <div style={{ color: '#4da6ff', fontStyle: 'italic' }}>Evaluating test cases...</div>
                    ) : result ? (
                        result.status === 'Error' ? (
                            // 🚨 THIS IS THE NEW ERROR CATCHER 🚨
                            <div style={{ padding: '15px', backgroundColor: 'rgba(220, 53, 69, 0.1)', border: '1px solid #dc3545', borderRadius: '4px' }}>
                                <h3 style={{ color: '#dc3545', margin: '0 0 10px 0' }}>🚨 Execution Error</h3>
                                <pre style={{ whiteSpace: 'pre-wrap', wordBreak: 'break-word', fontFamily: 'monospace', color: '#ff8a8a', margin: 0 }}>
                                    {result.feedback}
                                </pre>
                            </div>
                        ) : (
                            // ✅ THIS IS YOUR EXISTING GRADING UI ✅
                            <div style={{ padding: '15px', backgroundColor: '#2d2d2d', borderRadius: '4px', border: '1px solid #444' }}>
                                <h3 style={{
                                    color: result.status === 'Passed' ? '#28a745' : '#dc3545',
                                    margin: '0 0 15px 0'
                                }}>
                                    {result.status === 'Passed' ? '✅ Accepted' : '❌ Wrong Answer'}
                                </h3>

                                <p style={{ margin: '0 0 15px 0', fontSize: '1.1rem', color: '#d4d4d4' }}>
                                    Passed: <strong>{result.passedTests ?? 0} / {result.totalTests ?? 0}</strong>
                                </p>

                                {typeof result.scorePercentage === 'number' && (
                                    <p style={{ margin: '0 0 15px 0', color: '#4da6ff', fontWeight: 'bold' }}>
                                        Score: {result.scorePercentage}%
                                        {typeof result.awardedPoints === 'number' ? ` • Awarded ${result.awardedPoints} pts` : ''}
                                    </p>
                                )}

                                {result.testResults && (
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                                        {result.testResults.map((tc) => (
                                            <div key={tc.testNumber} style={{
                                                padding: '10px',
                                                backgroundColor: '#1e1e1e',
                                                borderLeft: `4px solid ${tc.passed ? '#28a745' : '#dc3545'}`,
                                                color: '#d4d4d4',
                                                borderRadius: '3px',
                                                fontSize: '0.95rem'
                                            }}>
                                                <strong>Test Case {tc.testNumber}:</strong> {tc.passed ? '✅ Passed' : '❌ Failed'}
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        )
                    ) : (
                        <div style={{ color: '#777', fontStyle: 'italic' }}>Run your code to see the execution results here.</div>
                    )}
                </div>
            </div>
        </div>
    );
}

export default CodeWorkspace;