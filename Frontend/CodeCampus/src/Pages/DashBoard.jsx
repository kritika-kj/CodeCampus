import React from 'react';
// import './DashBoard.css';
import DashBoardOption from '../Components/DashBoardOption';

function DashBoard({role}) {
  return (
    <div className="dashboard-container">
      <h1>Welcome to the Dashboard, {role}!</h1>
      <div className="options-container">
        {role === 'Contestant' ? (
            <>
                <DashBoardOption text="Join Contest" onClick={() => alert('Joining contest...')} />
                <DashBoardOption text="View Submissions" onClick={() => alert('Viewing submissions...')} />
            </>
        ) : (
            <>
                <DashBoardOption text="Manage Challenges" onClick={() => alert('Manage Challenges...')} />
                <DashBoardOption text="Manage Contests" onClick={() => alert('Managing contests...')} />
            </>
        )}
      </div>
    </div>

  )
}

export default DashBoard