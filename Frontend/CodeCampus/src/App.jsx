import React, { useState } from 'react';
import { useEffect } from 'react';
import CodeWorkspace from './Pages/CodeWorkSpace'; // Updated path
import Login from './Pages/Login';                 // Updated path
import DashBoard from './Pages/DashBoard';
import DashboardMenu from './Pages/DashBoardMenu';
import ChallengeManager from './Components/ChallengeManager'; 
import ContestManager from './Components/ContestManager';
import JoinContest from './Components/JoinContest';
// import { BrowserRouter, Routes } from 'react-router-dom';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import UserManagement from './Components/UserManagement';
function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userRole, setUserRole] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  useEffect(() => {
    const savedToken = sessionStorage.getItem('codeCampusToken');
    const savedRole = sessionStorage.getItem('userRole');

    if (savedToken && savedRole) {
      // If we found a token in the browser's memory, log them right back in!
      setIsAuthenticated(true);
      setUserRole(savedRole);
    }
    setIsLoading(false);
  }, []);

  const handleLoginSuccess = (role) => {
    setUserRole(role);
    setIsAuthenticated(true);
  };

  const handleLogout = () => {
    sessionStorage.removeItem('codeCampusToken');
    sessionStorage.removeItem('userRole');
    setIsAuthenticated(false);
    setUserRole(null);
  };
  if (isLoading) {
    return <div>Loading CodeCampus...</div>; 
  }

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={isAuthenticated ? <Navigate to="/dashboard" /> : <Navigate to="/login" />} />
        <Route path="/login" element={!isAuthenticated ? <Login onLoginSuccess={handleLoginSuccess} /> : <Navigate to="/dashboard" />} />
        <Route path="/dashboard" element={isAuthenticated ? <DashBoard role={userRole} onLogout={handleLogout} /> : <Navigate to="/login" />}>
          <Route index element={<DashboardMenu role={userRole} />} /> 
          <Route path="challenges" element={<ChallengeManager />} />    
          <Route path="contests" element={<ContestManager />} />
          <Route path="join" element={<JoinContest />} />
          <Route path="settings" element = {
            userRole === "Admin"? <UserManagement/>: <Navigate to ="/dashboard" replace />
          }
          />
        </Route>
        <Route path="/workspace/:id" element={
          isAuthenticated ? <CodeWorkspace /> : <Navigate to="/login" />
        } />
      </Routes>
    </BrowserRouter>
  );
}

export default App;