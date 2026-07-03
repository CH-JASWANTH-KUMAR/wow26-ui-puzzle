import { create } from 'zustand';
import { puzzles } from '../data/puzzles';
import type { Puzzle } from '../data/puzzles';
import { soundEffects } from '../utils/soundEffects';

export interface LeaderboardEntry {
  name: string;
  college: string;
  puzzlesCompletedCount: number;
  totalScore: number;
  averageTime: number; // totalTime / completedCount
  accuracyPercentage: number; // (totalPlaced / (totalPlaced + totalMistakes)) * 100
  date: string;
}

export type GameScreen = 'start' | 'playing' | 'puzzle-complete' | 'result';

interface GameState {
  // Screen and Profile
  screen: GameScreen;
  playerName: string;
  collegeName: string;
  theme: 'light' | 'dark';
  
  // Audio
  isMuted: boolean;

  // Cumulative Session Stats
  sessionScore: number;
  sessionMistakes: number;
  puzzlesCompleted: string[]; // Puzzle IDs completed in this session
  sessionTime: number; // total time in seconds across completed puzzles
  currentCombo: number;
  bestPuzzleId: string | null;

  // Current Active Puzzle Stats
  activePuzzle: Puzzle | null;
  placedPieces: string[];
  puzzleElapsedTime: number;
  puzzleMistakes: number;
  puzzleScore: number;
  hintUsed: boolean;
  activeHintSlot: string | null;

  // Leaderboard
  leaderboard: LeaderboardEntry[];

  // E-Wallet Session Integration
  sessionId: string | null;
  userId: string | null;
  isWaitingForPayment: boolean;
  syncFailed: boolean;

  // Actions
  setProfile: (name: string, college: string) => void;
  setScreen: (screen: GameScreen) => void;
  toggleMute: () => void;
  toggleTheme: () => void;
  getScore: () => number;
  
  // Game control
  startSession: () => void;
  startNextPuzzle: () => void;
  incrementTime: () => void;
  addMistake: () => void;
  placePiece: (pieceId: string) => void;
  useHint: (slotId: string) => void;
  clearActiveHint: () => void;
  completeActivePuzzle: () => void;
  finishSession: () => void;
  resetSession: () => void;
  loadLeaderboard: () => void;
  setSessionId: (id: string | null) => void;
  setUserId: (id: string | null) => void;
  setWaitingForPayment: (val: boolean) => void;
  setSyncFailed: (val: boolean) => void;
}

// Calculate score for a single puzzle
const calculatePuzzleScore = (
  time: number, 
  mistakes: number, 
  multiplier: number, 
  hintUsed: boolean
) => {
  const baseScore = 1000;
  const timePenalty = time * 10;
  const mistakePenalty = mistakes * 50;
  const hintPenalty = hintUsed ? 50 : 0;
  
  const rawScore = baseScore - timePenalty - mistakePenalty - hintPenalty;
  const minScore = 100; // base score for completing
  
  return Math.round(Math.max(minScore, rawScore) * multiplier);
};

export const useGameStore = create<GameState>((set, get) => ({
  screen: 'start',
  playerName: '',
  collegeName: '',
  theme: 'dark',
  isMuted: false,

  sessionScore: 0,
  sessionMistakes: 0,
  puzzlesCompleted: [],
  sessionTime: 0,
  currentCombo: 0,
  bestPuzzleId: null,

  activePuzzle: null,
  placedPieces: [],
  puzzleElapsedTime: 0,
  puzzleMistakes: 0,
  puzzleScore: 0,
  hintUsed: false,
  activeHintSlot: null,
  
  leaderboard: [],

  sessionId: null,
  userId: null,
  isWaitingForPayment: false,
  syncFailed: false,

  setSessionId: (id) => set({ sessionId: id }),
  setUserId: (id) => set({ userId: id }),
  setWaitingForPayment: (val) => set({ isWaitingForPayment: val }),
  setSyncFailed: (val) => set({ syncFailed: val }),

  setProfile: (name, college) => {
    set({ playerName: name.trim(), collegeName: college.trim() });
  },

  setScreen: (screen) => {
    set({ screen });
  },

  toggleMute: () => {
    set((state) => {
      const nextMuted = !state.isMuted;
      soundEffects.setMuted(nextMuted);
      return { isMuted: nextMuted };
    });
  },

  toggleTheme: () => {
    set((state) => {
      const nextTheme = state.theme === 'light' ? 'dark' : 'light';
      return { theme: nextTheme };
    });
  },

  getScore: () => {
    const { sessionScore, screen, activePuzzle, puzzleElapsedTime, puzzleMistakes, hintUsed } = get();
    if (screen === 'playing' && activePuzzle) {
      const pScore = calculatePuzzleScore(puzzleElapsedTime, puzzleMistakes, activePuzzle.scoreMultiplier, hintUsed);
      return sessionScore + pScore;
    }
    return sessionScore;
  },

  startSession: () => {
    // Pick a random puzzle
    const randomPuzzle = puzzles[Math.floor(Math.random() * puzzles.length)];
    
    set({
      sessionScore: 0,
      sessionMistakes: 0,
      puzzlesCompleted: [],
      sessionTime: 0,
      currentCombo: 0,
      bestPuzzleId: null,
      
      activePuzzle: randomPuzzle,
      placedPieces: [],
      puzzleElapsedTime: 0,
      puzzleMistakes: 0,
      puzzleScore: 0,
      hintUsed: false,
      activeHintSlot: null,
      screen: 'playing',
    });
  },

  startNextPuzzle: () => {
    const { puzzlesCompleted } = get();
    
    // Find uncompleted puzzles
    const uncompleted = puzzles.filter(p => !puzzlesCompleted.includes(p.id));
    
    // Fallback to all puzzles if all are completed
    const pool = uncompleted.length > 0 ? uncompleted : puzzles;
    const randomPuzzle = pool[Math.floor(Math.random() * pool.length)];

    set({
      activePuzzle: randomPuzzle,
      placedPieces: [],
      puzzleElapsedTime: 0,
      puzzleMistakes: 0,
      puzzleScore: 0,
      hintUsed: false,
      activeHintSlot: null,
      screen: 'playing',
    });
  },

  incrementTime: () => {
    set((state) => ({ puzzleElapsedTime: state.puzzleElapsedTime + 1 }));
  },

  addMistake: () => {
    soundEffects.playError();
    set((state) => ({ 
      puzzleMistakes: state.puzzleMistakes + 1,
      currentCombo: 0
    }));
  },

  placePiece: (pieceId) => {
    const { placedPieces, activePuzzle } = get();
    if (!activePuzzle) return;

    soundEffects.playSuccess();
    const nextPlaced = placedPieces.includes(pieceId)
      ? placedPieces
      : [...placedPieces, pieceId];

    set((state) => ({ 
      placedPieces: nextPlaced,
      currentCombo: state.currentCombo + 1
    }));
  },

  useHint: (slotId) => {
    set({ hintUsed: true, activeHintSlot: slotId });
  },

  clearActiveHint: () => {
    set({ activeHintSlot: null });
  },

  completeActivePuzzle: () => {
    const { 
      activePuzzle, 
      puzzleElapsedTime, 
      puzzleMistakes, 
      hintUsed, 
      sessionScore, 
      sessionMistakes, 
      sessionTime,
      puzzlesCompleted,
      bestPuzzleId
    } = get();

    if (!activePuzzle) return;

    soundEffects.playCompletion();

    // Calculate score
    const pScore = calculatePuzzleScore(
      puzzleElapsedTime, 
      puzzleMistakes, 
      activePuzzle.scoreMultiplier, 
      hintUsed
    );

    // Update cumulative session details
    const newPuzzlesCompleted = [...puzzlesCompleted, activePuzzle.id];
    const newSessionScore = sessionScore + pScore;
    const newSessionTime = sessionTime + puzzleElapsedTime;
    const newSessionMistakes = sessionMistakes + puzzleMistakes;

    // Check if this puzzle was the best scoring
    let newBestPuzzleId = bestPuzzleId;
    if (!bestPuzzleId) {
      newBestPuzzleId = activePuzzle.id;
    } else {
      // Re-calculate previous best score to compare
      const prevBest = puzzles.find(p => p.id === bestPuzzleId);
      if (prevBest) {
        // Compare with current score
        if (pScore > (get() as any).puzzleScore) { // simpler check: if current puzzle score is higher, set it
          newBestPuzzleId = activePuzzle.id;
        }
      }
    }

    set({
      puzzleScore: pScore,
      sessionScore: newSessionScore,
      sessionTime: newSessionTime,
      sessionMistakes: newSessionMistakes,
      puzzlesCompleted: newPuzzlesCompleted,
      bestPuzzleId: newBestPuzzleId,
      screen: 'puzzle-complete',
    });
  },

  finishSession: () => {
    const { 
      playerName, 
      collegeName, 
      puzzlesCompleted, 
      sessionScore, 
      sessionTime, 
      sessionMistakes 
    } = get();

    // Do not save to leaderboard if no puzzles were completed
    if (puzzlesCompleted.length === 0) {
      set({ screen: 'result' });
      return;
    }

    const avgTime = Math.round(sessionTime / puzzlesCompleted.length);
    
    // Calculate total correct drops (pieces in all completed puzzles)
    let totalCorrectDrops = 0;
    puzzlesCompleted.forEach(id => {
      const p = puzzles.find(puz => puz.id === id);
      if (p) totalCorrectDrops += p.pieces.length;
    });

    const totalAttempts = totalCorrectDrops + sessionMistakes;
    const accuracy = totalAttempts > 0 
      ? Math.round((totalCorrectDrops / totalAttempts) * 100) 
      : 100;

    const dateStr = new Date().toLocaleDateString(undefined, {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });

    const newEntry: LeaderboardEntry = {
      name: playerName || 'Guest Player',
      college: collegeName || 'General Attendee',
      puzzlesCompletedCount: puzzlesCompleted.length,
      totalScore: sessionScore,
      averageTime: avgTime,
      accuracyPercentage: accuracy,
      date: dateStr,
    };

    set((state) => {
      const updated = [...state.leaderboard, newEntry]
        // Sort: 1. Total Score (desc), 2. Accuracy (desc), 3. Avg Time (asc)
        .sort((a, b) => {
          if (b.totalScore !== a.totalScore) return b.totalScore - a.totalScore;
          if (b.accuracyPercentage !== a.accuracyPercentage) return b.accuracyPercentage - a.accuracyPercentage;
          return a.averageTime - b.averageTime;
        })
        .slice(0, 10);
      
      localStorage.setItem('wow2026-leaderboard-m3', JSON.stringify(updated));
      return { leaderboard: updated, screen: 'result' };
    });
  },

  resetSession: () => {
    set({
      screen: 'start',
      sessionScore: 0,
      sessionMistakes: 0,
      puzzlesCompleted: [],
      sessionTime: 0,
      currentCombo: 0,
      bestPuzzleId: null,
      activePuzzle: null,
      placedPieces: [],
      puzzleElapsedTime: 0,
      puzzleMistakes: 0,
      puzzleScore: 0,
      hintUsed: false,
      activeHintSlot: null,
      sessionId: null,
      userId: null,
      isWaitingForPayment: false,
      syncFailed: false,
    });
  },

  loadLeaderboard: () => {
    const raw = localStorage.getItem('wow2026-leaderboard-m3');
    if (raw) {
      try {
        const parsed = JSON.parse(raw) as LeaderboardEntry[];
        const sorted = parsed.sort((a, b) => {
          if (b.totalScore !== a.totalScore) return b.totalScore - a.totalScore;
          if (b.accuracyPercentage !== a.accuracyPercentage) return b.accuracyPercentage - a.accuracyPercentage;
          return a.averageTime - b.averageTime;
        });
        set({ leaderboard: sorted });
      } catch (e) {
        console.error('Failed to parse leaderboard:', e);
        set({ leaderboard: [] });
      }
    } else {
      set({ leaderboard: [] });
    }
  },
}));
