import React from 'react';
import { Outlet } from 'react-router-dom';

function DashBoard({ role, onLogout }) {
  return (
    <div className="dashboard-container" style={{ padding: '20px', maxWidth: '1000px', margin: '0 auto' }}>
      <div className="dashboard-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px', paddingBottom: '10px', borderBottom: '1px solid #eee' }}>
        <h1>CodeCampus | {role} Panel</h1>
        <button onClick={onLogout} style={{ padding: '8px 16px', cursor: 'pointer', backgroundColor: '#ff4d4f', color: 'white', border: 'none', borderRadius: '4px' }}>
          Sign Out
        </button>
      </div>
      <Outlet />
    </div>
  )
}

export default DashBoard;