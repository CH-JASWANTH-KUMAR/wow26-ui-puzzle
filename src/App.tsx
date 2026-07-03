import { useEffect, useRef } from 'react';
import { useGameStore } from './store/gameStore';
import { StartScreen } from './components/StartScreen';
import { GameScreen } from './components/GameScreen';
import { PuzzleCompleteScreen } from './components/PuzzleCompleteScreen';
import { ResultScreen } from './components/ResultScreen';
// @ts-ignore
import '@fontsource/google-sans';
// @ts-ignore
import '@fontsource/google-sans/500.css';
// @ts-ignore
import '@fontsource/google-sans/700.css';

function App() {
  const { screen, theme, loadLeaderboard, resetSession } = useGameStore();
  const lastActivityTime = useRef<number>(Date.now());

  // Load leaderboard on initial startup
  useEffect(() => {
    loadLeaderboard();
  }, [loadLeaderboard]);

  // Sync theme selection to root DOM node
  useEffect(() => {
    const root = document.documentElement;
    if (theme === 'light') {
      root.classList.add('light');
    } else {
      root.classList.remove('light');
    }
  }, [theme]);

  // Kiosk mode: Inactivity auto-reset (30 seconds)
  useEffect(() => {
    // Reset activity timestamp on user input
    const updateActivity = () => {
      lastActivityTime.current = Date.now();
    };

    const events = ['mousemove', 'mousedown', 'keydown', 'touchstart', 'scroll', 'click'];
    events.forEach(event => window.addEventListener(event, updateActivity, { passive: true }));

    // Tick checking interval
    const interval = setInterval(() => {
      // Only reset if we are not on the start screen
      if (screen !== 'start') {
        const inactiveTime = Date.now() - lastActivityTime.current;
        if (inactiveTime >= 30000) {
          console.log('Session reset due to 30s of inactivity.');
          resetSession();
        }
      }
    }, 1000);

    return () => {
      events.forEach(event => window.removeEventListener(event, updateActivity));
      clearInterval(interval);
    };
  }, [screen, resetSession]);

  // Screen router mapping
  const renderScreen = () => {
    switch (screen) {
      case 'start':
        return <StartScreen />;
      case 'playing':
        return <GameScreen />;
      case 'puzzle-complete':
        return <PuzzleCompleteScreen />;
      case 'result':
        return <ResultScreen />;
      default:
        return <StartScreen />;
    }
  };

  return (
    <div className="min-h-screen bg-md-bg text-md-on-surface flex flex-col transition-colors duration-300 relative overflow-hidden">
      {/* Premium background radial gradient blobs for depth */}
      <div className="absolute top-[-10%] left-[-15%] w-[40vw] h-[40vw] max-w-[500px] rounded-full bg-google-blue/10 blur-3xl pointer-events-none -z-10"></div>
      <div className="absolute bottom-[-10%] right-[-15%] w-[45vw] h-[45vw] max-w-[550px] rounded-full bg-google-red/8 blur-3xl pointer-events-none -z-10"></div>
      <div className="absolute top-[40%] left-[40%] w-[35vw] h-[35vw] max-w-[450px] rounded-full bg-google-yellow/5 blur-3xl pointer-events-none -z-10"></div>
      
      {renderScreen()}
    </div>
  );
}

export default App;
