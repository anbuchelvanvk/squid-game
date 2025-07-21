
import React from 'react';
import './WinnerPopup.css';

export default function WinnerPopup({ winnerName, onReset }) {
  if (!winnerName) return null;

  return (
    <div className="winner-toast">
      🏆 {winnerName} reached the goal!
      <br />
      <button onClick={onReset}>🔁 Restart Game</button>
    </div>
  );
}
