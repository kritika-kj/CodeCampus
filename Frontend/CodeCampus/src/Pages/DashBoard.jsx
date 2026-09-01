import React from 'react';
import { Outlet } from 'react-router-dom';
import './Dashboard.css';

function DashBoard({ role, onLogout }) {
  const activeUserId = sessionStorage.getItem('userId');
  const activeUserName = sessionStorage.getItem('userName');
  return (
    <div className="dashboard-wrapper">
    <div className="dashboard-container" 
    // style={{ padding: '20px', maxWidth: '1000px', margin: '0 auto' }}
    >
      <div className="dashboard-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px', paddingBottom: '10px', borderBottom: '1px solid #eee' }}>
        <h1>CodeCampus | {role} Panel</h1>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '15px' }}>
          <h3 style={{ margin: 0, color: '#4ade80' }}>ID: {activeUserId}, {activeUserName} </h3>
        <button onClick={onLogout} style={{ padding: '8px 16px', cursor: 'pointer', backgroundColor: '#ff4d4f', color: 'white', border: 'none', borderRadius: '4px' }}>
          Sign Out
        </button>
        </div>
      </div>
      <Outlet />
    </div>
    </div>
  )
}

export default DashBoard;
