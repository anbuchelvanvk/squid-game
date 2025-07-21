function Player({ id, startX, isRedLight, setEliminated }) {
  const ref = useRef();
  const [position, setPosition] = useState([startX, 0, 2]);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (id === 'Player1' && e.key === 'ArrowRight') {
        if (isRedLight) {
          setEliminated(true);
        } else {
          setPosition(([x, y, z]) => [x + 0.2, y, z]);
        }
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isRedLight]);

  return (
    <mesh ref={ref} position={position}>
      <boxGeometry args={[0.5, 1, 0.5]} />
      <meshStandardMaterial color={id === 'Player1' ? 'hotpink' : '#00ff88'} />
    </mesh>
  );
}
