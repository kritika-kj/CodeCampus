import React from 'react';
import { useNavigate } from 'react-router-dom';
import DashBoardOption from '../Components/DashBoardOption';

function DashboardMenu({ role }) {
  const navigate = useNavigate();

  return (
    <div className="options-container" style={{ display: 'grid', 
        gridTemplateColumns: '1fr 1fr', 
        gap: '60px', /* Even wider gap so they don't touch */
        width: '100%', /* Let them grow as wide as the Dashboard allows */
        margin: '80px auto 0 auto'}}>

      {role === 'Contestant' && (
          <>
              <DashBoardOption text="Join Contest" onClick={() => navigate('/dashboard/join')} />
              <DashBoardOption text="View Submissions" onClick={() => navigate('/dashboard/submissions')} />
              <DashBoardOption text="Enter Arena (Test)" onClick={() => navigate('/workspace/1')} />
          </>
      )}

      {role === 'Moderator' && (
          <>
             <DashBoardOption text="Manage Challenges" onClick={() => navigate('/dashboard/challenges')} />
             <DashBoardOption text="Manage Contests" onClick={() => navigate('/dashboard/contests')} />
          </>
      )}

      {role === 'Admin' && (
          <>
              <DashBoardOption text="Manage Challenges" onClick={() => navigate('/dashboard/challenges')} />
              <DashBoardOption text="Review Submissions" onClick={() => navigate('/dashboard/review')} />
              
              <DashBoardOption text="Manage Users" onClick={() => navigate('/dashboard/users')} />
              <DashBoardOption text="System Settings" onClick={() => navigate('/dashboard/settings')} />
          </>
      )}
      
    </div>
  );
}

export default DashboardMenu;