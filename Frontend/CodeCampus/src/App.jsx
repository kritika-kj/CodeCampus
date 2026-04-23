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
function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userRole, setUserRole] = useState(''); // Contestant or Moderator

  useEffect(() => {
    const savedToken = sessionStorage.getItem('codeCampusToken');
    const savedRole = sessionStorage.getItem('userRole');

    if (savedToken && savedRole) {
      // If we found a token in the browser's memory, log them right back in!
      setIsAuthenticated(true);
      setUserRole(savedRole);
    }
  }, []); // The empty array [] means this only runs on the first load

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
        </Route>
        <Route path="/workspace/:id" element={
          isAuthenticated ? <CodeWorkspace /> : <Navigate to="/login" />
        } />
      </Routes>
    </BrowserRouter>
  );
}

export default App;