import React from 'react'
import './DashBoardOption.css'

function DashBoardOption({text, onClick}) {
  return (
    <button className="DashBoardOption" onClick={onClick}>
      {text}
    </button>
  )
}

export default DashBoardOption