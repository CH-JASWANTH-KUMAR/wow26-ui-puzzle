import React, { useState, useEffect, useMemo } from 'react';
import { 
  DndContext, 
  useSensor, 
  useSensors, 
  PointerSensor, 
  TouchSensor 
} from '@dnd-kit/core';
import type { DragEndEvent } from '@dnd-kit/core';
import { useGameStore } from '../store/gameStore';
import { DraggablePiece } from './DraggablePiece';
import { DropSlot } from './DropSlot';
import { PhoneMockup } from './PhoneMockup';
import { AppPieceRenderer } from './AppPieceRenderer';
import { Button } from './Button';
import { MaterialCard } from './MaterialCard';
import { soundEffects } from '../utils/soundEffects';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Volume2, 
  VolumeX, 
  RotateCcw, 
  HelpCircle, 
  Clock, 
  AlertCircle,
  Award,
  LogOut,
  Flame
} from 'lucide-react';

interface PuzzlePiece {
  id: string;
}

export const GameScreen: React.FC = () => {
  const {
    activePuzzle,
    placedPieces,
    puzzleElapsedTime,
    puzzleMistakes,
    hintUsed,
    activeHintSlot,
    isMuted,
    currentCombo,
    sessionScore,
    puzzlesCompleted,
    incrementTime,
    addMistake,
    placePiece,
    useHint,
    clearActiveHint,
    resetSession,
    completeActivePuzzle,
    finishSession,
    toggleMute,
  } = useGameStore();

  const [shuffledPieces, setShuffledPieces] = useState<PuzzlePiece[]>([]);
  const [gameStarted, setGameStarted] = useState(false);
  const [correctFlashSlot, setCorrectFlashSlot] = useState<string | null>(null);
  const [wrongFlashSlot, setWrongFlashSlot] = useState<string | null>(null);

  // Configure drag and drop sensors
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 5,
      },
    }),
    useSensor(TouchSensor, {
      activationConstraint: {
        delay: 100,
        tolerance: 8,
      },
    })
  );

  // Guard if puzzle is missing
  if (!activePuzzle) {
    return null;
  }

  // Shuffle pieces when puzzle changes
  useEffect(() => {
    const list = activePuzzle.pieces.map(p => ({ id: p.id }));
    const shuffled = list.sort(() => Math.random() - 0.5);
    setShuffledPieces(shuffled);
    setGameStarted(false);
  }, [activePuzzle.id]);

  // Timer effect
  useEffect(() => {
    let interval: any;
    if (gameStarted && placedPieces.length < activePuzzle.pieces.length) {
      interval = setInterval(() => {
        incrementTime();
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [gameStarted, placedPieces.length, incrementTime, activePuzzle.pieces.length]);

  const handleDragStart = () => {
    if (!gameStarted) {
      setGameStarted(true);
    }
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over) {
      soundEffects.playDrop();
      return;
    }

    const pieceId = active.id as string;
    const slotId = over.id as string;

    const expectedSlotId = pieceId.replace('piece-', 'slot-');
    if (slotId === expectedSlotId) {
      // Correct Snapping Drop
      placePiece(pieceId);
      setCorrectFlashSlot(slotId);
      setTimeout(() => setCorrectFlashSlot(null), 500);

      // Check Completion
      if (placedPieces.length + 1 === activePuzzle.pieces.length) {
        setTimeout(() => {
          completeActivePuzzle();
        }, 600);
      }
    } else {
      // Wrong Drop
      addMistake();
      setWrongFlashSlot(slotId);
      setTimeout(() => setWrongFlashSlot(null), 500);

      // Web Vibration feedback
      if (navigator.vibrate) {
        navigator.vibrate(150);
      }
    }
  };

  const handleHint = () => {
    if (hintUsed || placedPieces.length === activePuzzle.pieces.length) return;

    const nextPiece = activePuzzle.pieces.find(p => !placedPieces.includes(p.id));
    if (nextPiece) {
      const slotId = nextPiece.id.replace('piece-', 'slot-');
      useHint(slotId);
      setTimeout(() => {
        clearActiveHint();
      }, 2000);
    }
  };

  // Filter remaining pieces for the tray
  const remainingPieces = useMemo(() => {
    return shuffledPieces.filter(p => !placedPieces.includes(p.id));
  }, [shuffledPieces, placedPieces]);

  // Derived Difficulty multiplier badge styling
  const getDifficultyBadge = (diff: string) => {
    switch (diff) {
      case 'easy':
        return 'bg-google-green/10 border-google-green/20 text-google-green';
      case 'medium':
        return 'bg-google-yellow/10 border-google-yellow/20 text-google-yellow';
      case 'hard':
        return 'bg-google-red/10 border-google-red/20 text-google-red';
      default:
        return 'bg-md-primary/10 border-md-primary/20 text-md-primary';
    }
  };

  return (
    <DndContext 
      sensors={sensors} 
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
    >
      <div className="flex-grow flex flex-col max-w-5xl mx-auto w-full px-6 py-6 select-none relative z-10">
        
        {/* Dynamic HUD Stats Bar */}
        <div className="w-full bg-md-surface/60 border border-md-surface-variant/30 rounded-3xl p-4 flex flex-wrap items-center justify-between gap-4 mb-6 shadow-md backdrop-blur-md">
          <div className="flex items-center flex-wrap gap-5">
            <div className="flex items-center gap-1.5" title="Puzzle Timer">
              <Clock className="w-4 h-4 text-google-blue" />
              <span className="font-mono text-base font-extrabold text-md-on-surface">
                {puzzleElapsedTime}s
              </span>
            </div>
            
            <div className="flex items-center gap-1.5" title="Mistakes on active puzzle">
              <AlertCircle className="w-4 h-4 text-google-red" />
              <span className="text-sm font-semibold text-md-on-surface">
                Mistakes: <span className="font-mono font-extrabold text-google-red">{puzzleMistakes}</span>
              </span>
            </div>

            <div className="flex items-center gap-1.5" title="Active combo streak">
              <Flame className="w-4 h-4 text-google-yellow" />
              <span className="text-sm font-semibold text-md-on-surface">
                Combo: <span className="font-mono font-extrabold text-google-yellow">{currentCombo}</span>
              </span>
            </div>

            <div className="h-4 w-[1px] bg-md-outline/25 hidden md:block"></div>

            <div className="flex items-center gap-1.5" title="Total Session Cumulative Score">
              <Award className="w-4 h-4 text-google-green" />
              <span className="text-sm font-semibold text-md-on-surface">
                Session Score: <span className="font-mono font-black text-google-green">{sessionScore}</span>
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* Mute Button */}
            <button
              onClick={toggleMute}
              className="p-2.5 rounded-full bg-md-surface-variant/20 border border-md-outline/20 text-md-primary hover:bg-md-surface-variant/40 transition-colors cursor-pointer"
              title={isMuted ? 'Unmute game sounds' : 'Mute game sounds'}
            >
              {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
            </button>

            {/* Hint Button */}
            <Button
              onClick={handleHint}
              disabled={hintUsed || placedPieces.length === activePuzzle.pieces.length}
              variant="tonal"
              size="sm"
              icon={<HelpCircle className="w-4 h-4" />}
            >
              Hint {hintUsed && '(Used)'}
            </Button>

            {/* Reset Button */}
            <button
              onClick={resetSession}
              className="p-2.5 rounded-full bg-google-red/10 border border-google-red/20 text-google-red hover:bg-google-red/20 transition-colors cursor-pointer"
              title="Reset Entire Session"
            >
              <RotateCcw className="w-4 h-4" />
            </button>

            {/* Finish Session FAB */}
            {puzzlesCompleted.length > 0 && (
              <Button
                onClick={finishSession}
                variant="filled"
                size="sm"
                icon={<LogOut className="w-4 h-4" />}
                className="shadow-md bg-google-blue text-white"
              >
                Finish & Save
              </Button>
            )}
          </div>
        </div>

        {/* Split Columns Workspace */}
        <div className="flex-1 grid grid-cols-1 md:grid-cols-12 gap-8 items-stretch">
          
          {/* Left Column: widget Components Tray */}
          <MaterialCard variant="filled" className="md:col-span-5 flex flex-col justify-start relative min-h-[300px] md:min-h-0">
            <div className="flex justify-between items-start mb-1.5 w-full">
              <div className="text-left">
                <h3 className="font-bold text-md-on-surface text-sm">{activePuzzle.name}</h3>
                <p className="text-[11px] text-md-outline">Drag elements to reconstruct the browser layout</p>
              </div>
              <span className={`px-2.5 py-0.5 rounded-full text-[9px] font-black uppercase tracking-wider border ${getDifficultyBadge(activePuzzle.difficulty)}`}>
                {activePuzzle.difficulty} (x{activePuzzle.scoreMultiplier})
              </span>
            </div>

            <div className="h-[1px] bg-md-outline/10 w-full my-3"></div>
            
            <div className="flex-1 flex flex-col justify-center items-center">
              {remainingPieces.length === 0 ? (
                <div className="text-center text-xs text-google-green font-bold py-6 animate-pulse flex flex-col items-center gap-2">
                  <Award className="w-8 h-8" />
                  <span>Success! Completing puzzle...</span>
                </div>
              ) : (
                <div className="w-full flex flex-wrap justify-center items-center gap-4">
                  <AnimatePresence>
                    {remainingPieces.map((piece) => {
                      const pieceConfig = activePuzzle.pieces.find(p => p.id === piece.id);
                      if (!pieceConfig) return null;

                      // Sizing presets based on shape configurations
                      let widthClass = 'w-44 h-11';
                      if (pieceConfig.shape === 'circle') widthClass = 'w-11 h-11';
                      else if (pieceConfig.shape === 'pill') widthClass = 'w-56 h-11';
                      else if (pieceConfig.shape === 'square') widthClass = 'w-24 h-24';
                      else if (pieceConfig.shape === 'video') widthClass = 'w-40 h-24';
                      else if (pieceConfig.shape === 'post') widthClass = 'w-56 h-28';
                      else if (pieceConfig.shape === 'nav') widthClass = 'w-full max-w-[240px] h-12';

                      return (
                        <motion.div
                          key={piece.id}
                          layout
                          initial={{ opacity: 0, scale: 0.8 }}
                          animate={{ opacity: 1, scale: 1 }}
                          exit={{ opacity: 0, scale: 0.5 }}
                          transition={{ type: 'spring', stiffness: 300, damping: 25 }}
                          className={widthClass}
                        >
                          <DraggablePiece id={piece.id}>
                            <AppPieceRenderer
                              label={pieceConfig.label}
                              iconName={pieceConfig.iconName}
                              shape={pieceConfig.shape}
                              brandColor={activePuzzle.brandColor}
                            />
                          </DraggablePiece>
                        </motion.div>
                      );
                    })}
                  </AnimatePresence>
                </div>
              )}
            </div>
            
            {/* Early exit indicator */}
            {puzzlesCompleted.length === 0 && (
              <div className="mt-4 border-t border-md-outline/10 pt-3 text-[10px] text-md-outline text-center leading-relaxed">
                💡 Drag pieces to start. Complete at least 1 puzzle to save your score.
              </div>
            )}
            {puzzlesCompleted.length > 0 && (
              <div className="mt-4 border-t border-md-outline/10 pt-3 flex items-center justify-between text-[10px] text-md-outline w-full">
                <span>Completed: {puzzlesCompleted.length} Apps</span>
                <span className="text-google-blue font-bold cursor-pointer hover:underline" onClick={finishSession}>
                  Stop & Save Score →
                </span>
              </div>
            )}
          </MaterialCard>

          {/* Right Column: Phone Mockup Frame */}
          <div className="md:col-span-7 flex justify-center items-center">
            <PhoneMockup appName={activePuzzle.name}>
              
              {/* Browser viewport absolute coordinates layout */}
              <div className="flex-1 w-full h-full relative p-4 flex flex-col">
                
                {/* Dynamically render silhouette drop targets and correctly placed components */}
                {activePuzzle.slots.map((slot) => {
                  const piece = activePuzzle.pieces.find(p => p.id === slot.pieceId);
                  if (!piece) return null;

                  const isPlaced = placedPieces.includes(slot.pieceId);

                  return (
                    <div
                      key={slot.pieceId}
                      style={{
                        position: 'absolute',
                        top: slot.top,
                        left: slot.left,
                        width: slot.width,
                        height: slot.height,
                      }}
                    >
                      {isPlaced ? (
                        <motion.div
                          initial={{ scale: 0.8, opacity: 0 }}
                          animate={{ scale: 1, opacity: 1 }}
                          transition={{ type: 'spring', stiffness: 260, damping: 20 }}
                          className="w-full h-full"
                        >
                          <AppPieceRenderer
                            label={piece.label}
                            iconName={piece.iconName}
                            shape={piece.shape}
                            brandColor={activePuzzle.brandColor}
                          />
                        </motion.div>
                      ) : (
                        <DropSlot
                          id={slot.pieceId.replace('piece-', 'slot-')}
                          brandColor={activePuzzle.brandColor}
                          isHinted={activeHintSlot === slot.pieceId.replace('piece-', 'slot-')}
                          isCorrectFlash={correctFlashSlot === slot.pieceId.replace('piece-', 'slot-')}
                          isWrongFlash={wrongFlashSlot === slot.pieceId.replace('piece-', 'slot-')}
                          className="w-full h-full"
                        >
                          {/* Render the grayscale silhouette outline */}
                          <AppPieceRenderer
                            label={piece.label}
                            iconName={piece.iconName}
                            shape={piece.shape}
                            brandColor={activePuzzle.brandColor}
                            isSilhouette={true}
                          />
                        </DropSlot>
                      )}
                    </div>
                  );
                })}

                {/* Constant Footer links */}
                <div className="mt-auto mx-auto pb-4 flex flex-col gap-1 items-center justify-center text-[7.5px] text-md-outline/40">
                  <span>Google offered in: English Hindi</span>
                  <div className="flex gap-2">
                    <span>About</span>
                    <span>Privacy</span>
                    <span>Terms</span>
                  </div>
                </div>

              </div>

            </PhoneMockup>
          </div>

        </div>

      </div>
    </DndContext>
  );
};
