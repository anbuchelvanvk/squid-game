// src/components/GameOverlay.jsx
import React, { useEffect, useState } from 'react';
import './GameOverlay.css';

export default function GameOverlay({ isRedLight }) {
  const [countdown, setCountdown] = useState(3);
  const [phaseText, setPhaseText] = useState('🟢 Green Light');

  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev > 0) return prev - 1;
        clearInterval(timer);
        return 0;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    setPhaseText(isRedLight ? '🔴 Red Light! Freeze!' : '🟢 Green Light');
  }, [isRedLight]);

  return (
    <div className="overlay">
      {countdown > 0 ? (
        <div className="countdown">🎬 Game starts in: {countdown}</div>
      ) : (
        <div className="phase-text">{phaseText}</div>
      )}
    </div>
  );
}
