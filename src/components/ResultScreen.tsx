import React, { useEffect } from 'react';
import { useGameStore } from '../store/gameStore';
import { Button } from './Button';
import { MaterialCard } from './MaterialCard';
import confetti from 'canvas-confetti';
import { Trophy, RotateCcw, Clock, Award, Target, Landmark, Smartphone, AlertCircle } from 'lucide-react';
import { motion } from 'framer-motion';

export const ResultScreen: React.FC = () => {
  const {
    sessionScore,
    sessionMistakes,
    sessionTime,
    puzzlesCompleted,
    playerName,
    collegeName,
    leaderboard,
    loadLeaderboard,
    resetSession,
    syncFailed,
  } = useGameStore();

  useEffect(() => {
    // Large celebratory confetti spray on load
    confetti({
      particleCount: 150,
      spread: 90,
      origin: { y: 0.55 },
      colors: ['#4285F4', '#EA4335', '#FBBC05', '#34A853', '#A8C7FA'],
    });

    // Side sprays
    const duration = 2 * 1000;
    const end = Date.now() + duration;

    const frame = () => {
      confetti({
        particleCount: 4,
        angle: 60,
        spread: 55,
        origin: { x: 0, y: 0.8 }
      });
      confetti({
        particleCount: 4,
        angle: 120,
        spread: 55,
        origin: { x: 1, y: 0.8 }
      });

      if (Date.now() < end) {
        requestAnimationFrame(frame);
      }
    };
    requestAnimationFrame(frame);

    loadLeaderboard();
  }, [loadLeaderboard]);

  // Derived calculations
  const count = puzzlesCompleted.length;
  const avgTime = count > 0 ? Math.round(sessionTime / count) : 0;
  
  // Calculate accuracy
  let totalCorrect = 0;
  puzzlesCompleted.forEach(() => {
    totalCorrect += 5; // each puzzle has 5 pieces
  });
  const totalAttempts = totalCorrect + sessionMistakes;
  const accuracy = totalAttempts > 0 ? Math.round((totalCorrect / totalAttempts) * 100) : 100;

  return (
    <div className="flex-grow flex flex-col items-center justify-between px-6 py-6 md:py-10 max-w-4xl mx-auto w-full select-none relative z-10">
      
      {/* Session Title Header */}
      <div className="flex flex-col items-center text-center max-w-xl mb-6">
        <motion.div
          initial={{ scale: 0.3, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: 'spring', stiffness: 200, damping: 15 }}
          className="w-16 h-16 rounded-full bg-google-green/10 border-2 border-google-green flex items-center justify-center mb-4 text-google-green"
        >
          <Trophy className="w-8 h-8 fill-current" />
        </motion.div>

        <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight mb-2 text-md-on-surface">
          Session Finished!
        </h1>
        <p className="text-sm text-md-outline">
          Outstanding performance! Here are your cumulative results.
        </p>

        {/* Player / College Header */}
        <div className="mt-4 flex flex-wrap justify-center items-center gap-3 bg-md-surface-variant/20 border border-md-outline/10 px-4 py-2 rounded-2xl text-xs font-bold text-md-primary">
          <span className="flex items-center gap-1">
            <Landmark className="w-4 h-4" />
            <span>{playerName || 'Attendee'}</span>
          </span>
          <span className="text-md-outline/30">•</span>
          <span>{collegeName || 'General'}</span>
        </div>

        {syncFailed && (
          <div className="mt-4 flex items-center gap-2 px-4 py-2 bg-google-red/10 border border-google-red/20 rounded-2xl text-xs font-semibold text-google-red shadow-sm animate-pulse">
            <AlertCircle className="w-4 h-4" />
            <span>Score saved locally. WOW sync failed.</span>
          </div>
        )}
      </div>

      {/* Cumulative Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 w-full mb-8">
        <MaterialCard variant="elevated" className="flex flex-col items-center justify-center p-4">
          <Smartphone className="w-5 h-5 text-google-blue mb-1" />
          <span className="text-[10px] font-bold text-md-outline uppercase tracking-wider">Completed</span>
          <span className="font-mono text-xl font-extrabold text-md-on-surface mt-1">{count} Apps</span>
        </MaterialCard>

        <MaterialCard variant="elevated" className="flex flex-col items-center justify-center p-4">
          <Clock className="w-5 h-5 text-google-yellow mb-1" />
          <span className="text-[10px] font-bold text-md-outline uppercase tracking-wider">Avg Time</span>
          <span className="font-mono text-xl font-extrabold text-md-on-surface mt-1">{avgTime}s</span>
        </MaterialCard>

        <MaterialCard variant="elevated" className="flex flex-col items-center justify-center p-4">
          <Target className="w-5 h-5 text-google-red mb-1" />
          <span className="text-[10px] font-bold text-md-outline uppercase tracking-wider">Accuracy</span>
          <span className="font-mono text-xl font-extrabold text-md-on-surface mt-1">{accuracy}%</span>
        </MaterialCard>

        <MaterialCard variant="elevated" className="flex flex-col items-center justify-center p-4 border-l-4 border-google-green">
          <Award className="w-5 h-5 text-google-green mb-1" />
          <span className="text-[10px] font-bold text-md-outline uppercase tracking-wider">Total Score</span>
          <span className="font-mono text-2xl font-black text-google-green mt-0.5">{sessionScore} pts</span>
        </MaterialCard>
      </div>

      {/* Leaderboard Table Container */}
      <MaterialCard variant="elevated" className="w-full mb-8 flex-grow flex flex-col min-h-[300px]">
        <div className="flex items-center justify-between mb-4 border-b border-md-outline/10 pb-3">
          <div className="flex items-center gap-2">
            <Trophy className="w-5 h-5 text-google-yellow" />
            <h3 className="font-extrabold text-md-on-surface text-base">Top 10 Event Leaderboard</h3>
          </div>
          <span className="text-[10px] text-md-outline font-semibold">Live Standings</span>
        </div>

        {leaderboard.length === 0 ? (
          <div className="flex-1 flex items-center justify-center text-sm text-md-outline italic py-8">
            No entries recorded on the leaderboard.
          </div>
        ) : (
          <div className="flex-grow overflow-y-auto max-h-[300px] pr-2 flex flex-col gap-2 scrollbar-thin">
            {/* Table Header */}
            <div className="grid grid-cols-12 px-4 py-1 text-[9px] font-black text-md-outline uppercase tracking-wider border-b border-md-outline/5 pb-2">
              <span className="col-span-2 md:col-span-1 text-center">#</span>
              <span className="col-span-7 md:col-span-5 text-left">Participant</span>
              <span className="col-span-2 text-center hidden md:block">Completed</span>
              <span className="col-span-2 text-center hidden md:block">Accuracy / Time</span>
              <span className="col-span-3 md:col-span-2 text-right">Score</span>
            </div>

            {leaderboard.map((entry, index) => {
              const highlightRank = index < 3;
              const isCurrentUser = entry.name === playerName && entry.college === collegeName;
              
              const rankStyles = [
                'text-google-yellow border-google-yellow/20 bg-google-yellow/5 font-bold',
                'text-google-blue border-google-blue/20 bg-google-blue/5 font-bold',
                'text-google-red border-google-red/20 bg-google-red/5 font-bold',
              ];

              return (
                <div
                  key={index}
                  className={`grid grid-cols-12 items-center px-4 py-2.5 rounded-xl border text-xs transition-all ${
                    isCurrentUser 
                      ? 'border-md-primary bg-md-primary/10 shadow-sm' 
                      : highlightRank
                        ? 'border-md-outline/20 bg-md-surface-variant/10'
                        : 'border-md-outline/10 bg-transparent'
                  }`}
                >
                  {/* Rank */}
                  <span className={`col-span-2 md:col-span-1 w-5.5 h-5.5 rounded-full flex items-center justify-center text-[10px] mx-auto border ${rankStyles[index] || 'text-md-outline border-md-outline/25'}`}>
                    {index + 1}
                  </span>
                  
                  {/* Participant Name & College */}
                  <div className="col-span-7 md:col-span-5 flex flex-col text-left truncate min-w-0 pr-2">
                    <span className="font-bold text-md-on-surface truncate">
                      {entry.name}
                    </span>
                    <span className="text-[10px] text-md-outline truncate hidden sm:block">
                      {entry.college}
                    </span>
                  </div>

                  {/* Puzzles Completed */}
                  <span className="col-span-2 text-center font-mono font-bold text-md-on-surface hidden md:block">
                    {entry.puzzlesCompletedCount} Apps
                  </span>

                  {/* Accuracy and Average Time */}
                  <div className="col-span-2 flex flex-col items-center font-mono text-[10px] text-md-outline hidden md:flex">
                    <span>{entry.accuracyPercentage}% Acc</span>
                    <span>{entry.averageTime}s avg</span>
                  </div>

                  {/* Total Score */}
                  <span className="col-span-3 md:col-span-2 text-right font-mono font-black text-google-green text-sm">
                    {entry.totalScore}
                  </span>
                </div>
              );
            })}
          </div>
        )}
      </MaterialCard>

      {/* Play Again Action Button */}
      <div className="w-full flex justify-center z-10 px-6 sm:px-0">
        <Button
          onClick={resetSession}
          variant="filled"
          size="lg"
          icon={<RotateCcw className="w-5 h-5" />}
          className="w-full sm:w-auto shadow-lg shadow-black/10 bg-google-blue text-white"
        >
          Play Again
        </Button>
      </div>

    </div>
  );
};
