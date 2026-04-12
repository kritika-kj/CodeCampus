import React from 'react';
import Card from '../Components/Card';

function CodeWorkspace() {
    return (
        <div style={{ 
            display: 'flex', 
            justifyContent: 'center', 
            alignItems: 'center', 
            height: '100vh', 
            backgroundColor: '#121212',
            color: 'white',
            fontFamily: 'sans-serif'
        }}>
            <Card title="The Arena">
                <h2>Welcome to the Workspace!</h2>
                <p style={{ color: '#aaaaaa' }}>You have successfully logged in.</p>
                <p style={{ color: '#aaaaaa' }}>The live code editor will be built right here.</p>
            </Card>
        </div>
    );
};

export default CodeWorkspace;