// src/App.js
import React, { useState, useEffect } from 'react';
import GameScene from './GameScene';
import GameOverlay from './GameOverlay';
import EliminationAlert from './EliminationAlert';
import WinnerPopup from './WinnerPopup';
import './App.css';

function App() {
  const [isRedLight, setIsRedLight] = useState(false);
  const [eliminated, setEliminated] = useState(false);
  const [countdownDone, setCountdownDone] = useState(false);
  const [winnerName, setWinnerName] = useState(null);
  

  useEffect(() => {
    const countdownTimer = setTimeout(() => {
      setCountdownDone(true);
    }, 3000);

    return () => clearTimeout(countdownTimer);
  }, []);

  useEffect(() => {
    if (countdownDone) {
      const phaseSwitch = setInterval(() => {
        setIsRedLight((prev) => !prev);
      }, 3000);
      return () => clearInterval(phaseSwitch);
    }
  }, [countdownDone]);

  useEffect(() => {
    if (eliminated) {
      const timeout = setTimeout(() => setEliminated(false), 2500);
      return () => clearTimeout(timeout);
    }
  }, [eliminated]);

  const handleReset = () => {
    setWinnerName(null);
    setEliminated(false);
    setCountdownDone(false);
    setTimeout(() => setCountdownDone(true), 3000);
  };

  return (
    <div className="App">
      <GameOverlay isRedLight={isRedLight} />
      <EliminationAlert triggered={eliminated} />
      <WinnerPopup winnerName={winnerName} onReset={handleReset} />
      <GameScene
        isRedLight={isRedLight}
        countdownDone={countdownDone}
        setEliminated={setEliminated}
        setWinnerName={setWinnerName}
      />
    </div>
  );
}

export default App;
