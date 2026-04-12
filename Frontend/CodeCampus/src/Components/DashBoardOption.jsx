import React from 'react'

function DashBoardOption({text, onClick}) {
  return (
    <button className="DashBoardOption" onClick={onClick}>
      {text}
    </button>
  )
}

export default DashBoardOption