import React, { useState } from 'react';
import CodeWorkspace from './Pages/CodeWorkSpace'; // Updated path
import Login from './Pages/Login';                 // Updated path

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const handleLoginSuccess = () => {
      setIsAuthenticated(true);
  };

  return (
    <div>
      {!isAuthenticated ? (
          <Login onLoginSuccess={handleLoginSuccess} />
      ) : (
          <CodeWorkspace />
      )}
    </div>
  );
}

export default App;