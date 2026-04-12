import React, { useState } from 'react';
import CodeWorkspace from './Pages/CodeWorkSpace'; // Updated path
import Login from './Pages/Login';                 // Updated path
import DashBoard from './Pages/DashBoard';
function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userRole, setUserRole] = useState(''); // Contestant or Moderator

  const handleLoginSuccess = (role) => {
    setUserRole(role);
    setIsAuthenticated(true);
  };

  return (
    <div>
      {!isAuthenticated ? (
          <Login onLoginSuccess={handleLoginSuccess} />
      ) : (
          <DashBoard role={userRole} />
      )}
    </div>
  );
}

export default App;