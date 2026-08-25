import React from 'react';
import { useNavigate } from 'react-router-dom';
import DashBoardOption from '../Components/DashBoardOption';
import './Dashboard.css';

function DashboardMenu({ role }) {
  const navigate = useNavigate();

  return (
    <div className="options-container"
    //  style={{ display: 'grid', 
    //     gridTemplateColumns: '1fr 1fr', 
    //     gap: '60px',
    //     width: '100%',
    //     margin: '80px auto 0 auto'}}
        >

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
              
              <DashBoardOption text="Manage Users" onClick={() => navigate('/dashboard/settings')} />
              {/* <DashBoardOption text="System Settings" onClick={() => navigate('/dashboard/settings')} /> */}
          </>
      )}
      
    </div>
  );
}

export default DashboardMenu;