import React, { Suspense, useRef, useState, useEffect } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, useGLTF, Environment, Text } from '@react-three/drei';
import './GameScene.css';

function Doll({ isRedLight }) {
  const { scene } = useGLTF(`${process.env.PUBLIC_URL}/models/doll.glb`);
  const ref = useRef();

  useFrame(() => {
    if (ref.current) {
      ref.current.rotation.y = isRedLight ? 0 : Math.PI;
    }
  });

  return <primitive object={scene} ref={ref} position={[0, 2, -20]} scale={5} />;
}

// BackgroundModel removed because rlgl.glb is missing from public/models
function Player({ id, x, isRedLight, moveTrigger, onWin, onEliminate }) {
  const [position, setPosition] = useState([x, 0, 2]);
  const [status, setStatus] = useState('🟢 Ready');
  const [isEliminated, setIsEliminated] = useState(false);
  const goalZ = -19.2;

  useEffect(() => {
    if (moveTrigger && !isEliminated) {
      if (isRedLight) {
        setStatus('💥 Caught!');
        setIsEliminated(true);
        onEliminate(id);
      } else {
        setPosition(([px, py, pz]) => {
          const newZ = pz - 0.4;
          if (newZ <= goalZ) {
            setStatus('🏆 Winner!');
            onWin(id);
            return [px, py, goalZ];
          }
          setStatus('✅ Safe Move');
          return [px, py, newZ];
        });
      }
    }
  }, [moveTrigger, isRedLight, isEliminated, goalZ, id, onWin, onEliminate]);

  return (
    <>
      <mesh position={position}>
        <boxGeometry args={[0.5, 1, 0.5]} />
        <meshStandardMaterial color={isEliminated ? 'red' : 'green'} />
      </mesh>
      <Text position={[position[0], 1.8, position[2]]} fontSize={0.3} color="black">
        {id}: {status}
      </Text>
    </>
  );
}

export default function GameScene({ isRedLight, countdownDone, setEliminated, setWinnerName }) {
  const players = [
    { id: 'Player1', x: -1 },
    { id: 'Player2', x: 0 },
    { id: 'Player3', x: 1 },
  ];

  const [moveMap, setMoveMap] = useState({});

  const triggerMove = (id) => {
    setMoveMap((prev) => ({ ...prev, [id]: true }));
    setTimeout(() => setMoveMap((prev) => ({ ...prev, [id]: false })), 300); // brief trigger pulse
  };

  return (
    <>
      <Canvas style={{ width: '100vw', height: '100vh' }} camera={{ position: [0, 3, 10], fov: 50 }}>
        <ambientLight intensity={0.4} />
        <directionalLight position={[0, 10, 5]} intensity={1} />
        <Suspense fallback={null}>
          <Environment preset="sunset" background />
          <Doll isRedLight={isRedLight} />

          {/* Players */}
          {countdownDone &&
            players.map((p) => (
              <Player
                key={p.id}
                id={p.id}
                x={p.x}
                isRedLight={isRedLight}
                moveTrigger={moveMap[p.id]}
                onEliminate={setEliminated}
                onWin={setWinnerName}
              />
            ))}

          {/* Ground */}
          <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -1, 0]}>
            <planeGeometry args={[50, 50]} />
            <meshStandardMaterial color="#444444" />
          </mesh>

          {/* Start Line */}
          <mesh position={[0, -0.99, 2]}>
            <planeGeometry args={[6, 0.3]} />
            <meshStandardMaterial color="#00FF88" />
          </mesh>

          {/* Finish Line */}
          <mesh position={[0, -0.99, -19.2]}>
            <planeGeometry args={[6, 0.3]} />
            <meshStandardMaterial color="#FFD700" />
          </mesh>

          {/* Labels */}
          <Text position={[0, 0.2, 2]} fontSize={0.5} color="black">START</Text>
          <Text position={[0, 0.2, -19.2]} fontSize={0.5} color="black">FINISH</Text>
        </Suspense>

        <OrbitControls />
      </Canvas>

      {/* Move buttons for players */}
      <div className="player-controls">
        {players.map((p) => (
          <button key={p.id} onClick={() => triggerMove(p.id)}>
            Move {p.id}
          </button>
        ))}
      </div>
    </>
  );
}
