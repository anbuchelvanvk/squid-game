// src/components/EliminationAlert.jsx
import React from 'react';
import './EliminationAlert.css';

export default function EliminationAlert({ triggered }) {
  if (!triggered) return null;

  return (
    <div className="alert-popup">
      <p>💥 Thambi! Adhu Red Light da! 😵</p>
      <audio autoPlay>
        <source src="/sounds/eliminated-tamil.mp3" type="audio/mpeg" />
      </audio>
    </div>
  );
}
