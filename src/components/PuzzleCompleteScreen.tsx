import React, { useEffect, useState } from 'react';
import { useGameStore } from '../store/gameStore';
import { Button } from './Button';
import { MaterialCard } from './MaterialCard';
import confetti from 'canvas-confetti';
import { Clock, AlertCircle, Award, Star, ArrowRight, Save, Loader2 } from 'lucide-react';
import { motion } from 'framer-motion';

export const PuzzleCompleteScreen: React.FC = () => {
  const {
    activePuzzle,
    puzzleElapsedTime,
    puzzleMistakes,
    puzzleScore,
    sessionScore,
    puzzlesCompleted,
    startNextPuzzle,
    finishSession,
    sessionId,
    setSyncFailed,
  } = useGameStore();

  const [isSaving, setIsSaving] = useState(false);

  const handleFinishSave = async () => {
    setIsSaving(true);
    try {
      if (sessionId) {
        const response = await fetch(
          'https://now-in-google-backend-1010379975924.asia-south1.run.app/nowingoogle-backend/api/wallet/experience/complete',
          {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'x-api-version': '2.0.0'
            },
            body: JSON.stringify({
              session_id: sessionId,
              points: sessionScore
            })
          }
        );
        const data = await response.json();
        if (!response.ok || !data || !data.status) {
          throw new Error('WOW API complete call failed');
        }
      }
    } catch (err) {
      console.error('Failed to sync complete experience:', err);
      setSyncFailed(true);
    } finally {
      setIsSaving(false);
      finishSession();
    }
  };

  useEffect(() => {
    if (!activePuzzle) return;
    
    // Trigger confetti burst on completion
    confetti({
      particleCount: 80,
      spread: 60,
      origin: { y: 0.6 },
      colors: [activePuzzle.brandColor, '#4285F4', '#EA4335', '#FBBC05', '#34A853']
    });
  }, [activePuzzle]);

  if (!activePuzzle) return null;

  // Single-puzzle rating stars based on score
  const starCount = (() => {
    // Max score is 1000 * multiplier. Adjust threshold by multiplier
    const normScore = puzzleScore / activePuzzle.scoreMultiplier;
    if (normScore >= 900) return 3;
    if (normScore >= 700) return 2;
    if (normScore >= 500) return 1;
    return 0;
  })();

  const getDifficultyBadge = (diff: string) => {
    switch (diff) {
      case 'easy':
        return 'text-google-green border-google-green/20 bg-google-green/5';
      case 'medium':
        return 'text-google-yellow border-google-yellow/20 bg-google-yellow/5';
      case 'hard':
        return 'text-google-red border-google-red/20 bg-google-red/5';
      default:
        return 'text-md-primary border-md-primary/20 bg-md-primary/5';
    }
  };

  return (
    <div className="flex-grow flex flex-col items-center justify-center px-6 py-10 max-w-xl mx-auto w-full select-none z-10">
      
      {/* Celebration Header */}
      <div className="text-center mb-8">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border text-[10px] font-black uppercase tracking-wider mb-4 animate-bounce bg-md-surface" style={{ borderColor: activePuzzle.brandColor, color: activePuzzle.brandColor }}>
          Layout Restored
        </div>
        <h2 className="text-3xl font-black text-md-on-surface">
          {activePuzzle.name} Complete!
        </h2>
        <p className="text-sm text-md-outline mt-1.5">
          Great job restoring the widget positioning.
        </p>

        {/* Stars Display */}
        <div className="flex justify-center items-center gap-2 my-5">
          {[1, 2, 3].map((starNum) => {
            const isActive = starNum <= starCount;
            return (
              <motion.div
                key={starNum}
                initial={{ opacity: 0, scale: 0.2, rotate: -45 }}
                animate={{ opacity: 1, scale: 1, rotate: 0 }}
                transition={{ delay: starNum * 0.12, type: 'spring' }}
              >
                <Star
                  className={`w-9 h-9 ${
                    isActive 
                      ? 'fill-google-yellow text-google-yellow drop-shadow-[0_0_8px_rgba(251,188,5,0.5)]' 
                      : 'text-md-surface-variant/60'
                  }`}
                />
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* Puzzle stats Card */}
      <MaterialCard variant="elevated" className="w-full mb-6 text-center">
        <div className="flex justify-between items-center mb-4 pb-2 border-b border-md-outline/10 text-xs">
          <span className="text-md-outline">App Difficulty:</span>
          <span className={`px-2.5 py-0.5 rounded-full border text-[10px] font-bold uppercase tracking-wider ${getDifficultyBadge(activePuzzle.difficulty)}`}>
            {activePuzzle.difficulty} (x{activePuzzle.scoreMultiplier})
          </span>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-3 gap-3 mb-5">
          <div className="flex flex-col items-center p-2 rounded-2xl bg-md-surface-variant/10">
            <div className="flex items-center gap-1 text-google-blue mb-1 text-[10px] font-bold uppercase">
              <Clock className="w-3.5 h-3.5" />
              <span>Time</span>
            </div>
            <span className="font-mono text-base font-black text-md-on-surface">{puzzleElapsedTime}s</span>
          </div>

          <div className="flex flex-col items-center p-2 rounded-2xl bg-md-surface-variant/10">
            <div className="flex items-center gap-1 text-google-red mb-1 text-[10px] font-bold uppercase">
              <AlertCircle className="w-3.5 h-3.5" />
              <span>Mistakes</span>
            </div>
            <span className="font-mono text-base font-black text-md-on-surface">{puzzleMistakes}</span>
          </div>

          <div className="flex flex-col items-center p-2 rounded-2xl bg-md-surface-variant/10">
            <div className="flex items-center gap-1 text-google-green mb-1 text-[10px] font-bold uppercase">
              <Award className="w-3.5 h-3.5" />
              <span>Score</span>
            </div>
            <span className="font-mono text-lg font-black text-google-green">+{puzzleScore}</span>
          </div>
        </div>

        {/* Session Progress overview */}
        <div className="p-3 bg-md-surface-variant/20 rounded-2xl flex justify-between items-center text-xs font-semibold">
          <div className="text-left flex flex-col">
            <span className="text-md-outline text-[10px]">Session cumulative score</span>
            <span className="text-sm font-black text-md-on-surface">{sessionScore} pts</span>
          </div>
          <div className="text-right flex flex-col">
            <span className="text-md-outline text-[10px]">Apps completed</span>
            <span className="text-sm font-black text-md-primary">{puzzlesCompleted.length} / 10</span>
          </div>
        </div>
      </MaterialCard>

      {/* Choice Actions */}
      <div className="w-full flex flex-col gap-3">
        <Button
          onClick={startNextPuzzle}
          variant="filled"
          size="md"
          icon={<ArrowRight className="w-4 h-4" />}
          className="w-full shadow-md bg-google-blue text-white"
        >
          Next App Layout
        </Button>
        
        <Button
          onClick={handleFinishSave}
          variant="tonal"
          size="md"
          icon={isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
          className="w-full font-bold"
          disabled={isSaving}
        >
          {isSaving ? 'Syncing WOW...' : 'Finish & Save Score'}
        </Button>
      </div>

    </div>
  );
};
