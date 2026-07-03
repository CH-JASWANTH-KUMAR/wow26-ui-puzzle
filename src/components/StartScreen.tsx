import React, { useEffect, useState } from 'react';
import { useGameStore } from '../store/gameStore';
import { Button } from './Button';
import { soundEffects } from '../utils/soundEffects';
import { 
  Trophy, 
  Moon, 
  Sun, 
  Sparkles, 
  Play, 
  HelpCircle, 
  Volume2, 
  VolumeX, 
  Zap, 
  Target, 
  User, 
  X,
  ChevronRight,
  Globe, 
  Crown,
  Grid,
  Move,
  Loader2
} from 'lucide-react';
import { QRPaymentScreen } from './QRPaymentScreen';
import { 
  SiGoogle, 
  SiGmail, 
  SiYoutube, 
  SiInstagram, 
  SiWhatsapp, 
  SiSpotify, 
  SiNetflix, 
  SiFacebook, 
  SiX
} from 'react-icons/si';
import { FaAmazon } from 'react-icons/fa';
import { motion, AnimatePresence } from 'framer-motion';

export const StartScreen: React.FC = () => {
  const containerRef = React.useRef<HTMLDivElement>(null);
  const { 
    startSession,
    setProfile,
    theme, 
    toggleTheme, 
    leaderboard, 
    loadLeaderboard,
    isMuted,
    toggleMute,
    sessionId,
    isWaitingForPayment,
    setSessionId,
    setUserId,
    setWaitingForPayment
  } = useGameStore();

  const [isRegisterOpen, setIsRegisterOpen] = useState(false);
  const [isLeaderboardOpen, setIsLeaderboardOpen] = useState(false);
  const [isHowPlayOpen, setIsHowPlayOpen] = useState(false);

  // Hidden admin panel states
  const [isAdminOpen, setIsAdminOpen] = useState(false);
  const [adminPin, setAdminPin] = useState('');
  const [isPinVerified, setIsPinVerified] = useState(false);
  const [pinError, setPinError] = useState('');
  const [isConfirmingClear, setIsConfirmingClear] = useState(false);

  const [name, setName] = useState('');
  const [college, setCollege] = useState('');
  const [isRegisterLoading, setIsRegisterLoading] = useState(false);

  useEffect(() => {
    loadLeaderboard();
  }, [loadLeaderboard]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.ctrlKey && e.shiftKey && e.key.toLowerCase() === 'x') {
        e.preventDefault();
        setIsAdminOpen(true);
        setAdminPin('');
        setIsPinVerified(false);
        setPinError('');
        setIsConfirmingClear(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const handlePinSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (adminPin === '2026') {
      setIsPinVerified(true);
      setPinError('');
    } else {
      setPinError('Incorrect PIN');
      setTimeout(() => {
        setIsAdminOpen(false);
      }, 1000);
    }
  };

  const handleStartSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !college.trim()) return;
    
    setIsRegisterLoading(true);

    try {
      const response = await fetch(
        'https://now-in-google-backend-1010379975924.asia-south1.run.app/nowingoogle-backend/api/wallet/experience/request',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'x-api-version': '2.0.0'
          },
          body: JSON.stringify({
            experience_id: 'ui_puzzle_challenge',
            name: 'UI Puzzle Challenge',
            amount: 0.0
          })
        }
      );

      const data = await response.json();
      if (response.ok && data && data.status && data.session_id) {
        soundEffects.playSuccess();
        setProfile(name, college);
        setSessionId(data.session_id);
        setIsRegisterOpen(false);
        setWaitingForPayment(true);
      } else {
        throw new Error(data.message || 'Could not connect to WOW servers.');
      }
    } catch (err: any) {
      console.warn('Session creation failed, generating local fallback session:', err);
      const fallbackId = 'mock_' + Math.random().toString(36).substr(2, 9);
      soundEffects.playSuccess();
      setProfile(name, college);
      setSessionId(fallbackId);
      setIsRegisterOpen(false);
      setWaitingForPayment(true);
    } finally {
      setIsRegisterLoading(false);
    }
  };

  const topThree = leaderboard.slice(0, 3).map((entry, idx) => {
    const avatarSeeds = [
      'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?auto=format&fit=crop&w=120&h=120&q=80',
      'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=120&h=120&q=80',
      'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=120&h=120&q=80'
    ];
    return {
      ...entry,
      avatarUrl: avatarSeeds[idx % avatarSeeds.length]
    };
  });

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { y: 15, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { type: 'spring' as const, stiffness: 100, damping: 16 }
    }
  };

  return (
    <div ref={containerRef} className="w-full h-screen overflow-y-auto flex flex-col justify-between px-8 pb-6 select-none relative z-10 bg-[#07090e] text-white font-sans scrollbar-thin">
      
      {/* Blur background blobs */}
      <div className="absolute top-[8%] left-[5%] w-[420px] h-[420px] rounded-full bg-google-blue/5 blur-3xl pointer-events-none -z-20"></div>
      <div className="absolute top-[15%] right-[5%] w-[450px] h-[450px] rounded-full bg-gradient-to-tr from-google-green/5 to-google-yellow/5 blur-3xl pointer-events-none -z-20"></div>

      {/* 1. TOP NAVIGATION HEADER */}
      <header className="fixed top-0 left-0 right-0 h-16 z-50 flex items-center justify-between border-b border-white/5 bg-[#07090e]/90 backdrop-blur-md px-8">
        {/* Left: Google Wordmark & Branding */}
        <div className="flex items-center gap-2 cursor-default">
          <div className="text-xl font-bold tracking-tight select-none">
            <span className="text-google-blue">G</span>
            <span className="text-google-red">o</span>
            <span className="text-google-yellow">o</span>
            <span className="text-google-blue">g</span>
            <span className="text-google-green">l</span>
            <span className="text-google-red">e</span>
            <span className="text-white font-medium text-sm ml-2.5">UI Puzzle Challenge</span>
          </div>
        </div>

        {/* Center: Links */}
        <nav className="hidden md:flex items-center gap-8 text-xs font-bold text-zinc-400 select-none">
          <span 
            onClick={() => containerRef.current?.scrollTo({ top: 0, behavior: 'smooth' })}
            className="text-white cursor-pointer border-b-2 border-google-blue pb-1"
          >
            Home
          </span>
          <span 
            onClick={() => {
              const el = document.getElementById('how-it-works');
              if (el && containerRef.current) {
                const containerTop = containerRef.current.getBoundingClientRect().top;
                const elTop = el.getBoundingClientRect().top;
                const offset = elTop - containerTop + containerRef.current.scrollTop - 64;
                containerRef.current.scrollTo({ top: offset, behavior: 'smooth' });
              }
            }}
            className="hover:text-white cursor-pointer transition-colors"
          >
            How it Works
          </span>
          <span 
            onClick={() => {
              const el = document.getElementById('leaderboard-section');
              if (el && containerRef.current) {
                const containerTop = containerRef.current.getBoundingClientRect().top;
                const elTop = el.getBoundingClientRect().top;
                const offset = elTop - containerTop + containerRef.current.scrollTop - 64;
                containerRef.current.scrollTo({ top: offset, behavior: 'smooth' });
              }
            }}
            className="hover:text-white cursor-pointer transition-colors flex items-center gap-1.5"
          >
            <Trophy className="w-3.5 h-3.5 text-google-yellow fill-current" />
            <span>Leaderboard</span>
          </span>
        </nav>

        {/* Right: Badges, Sounds, Theme Toggle */}
        <div className="flex items-center gap-3">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-google-green/10 border border-google-green/20 text-google-green text-xs font-bold select-none">
            <span className="w-1.5 h-1.5 rounded-full bg-google-green animate-pulse"></span>
            <span>Event Live</span>
          </div>

          {/* Sound Toggle */}
          <button
            onClick={toggleMute}
            className="p-2 rounded-full bg-white/5 border border-white/10 text-white hover:bg-white/10 transition-colors cursor-pointer"
            title={isMuted ? 'Unmute sounds' : 'Mute sounds'}
          >
            {isMuted ? <VolumeX className="w-3.5 h-3.5" /> : <Volume2 className="w-3.5 h-3.5" />}
          </button>

          {/* Theme Switcher */}
          <motion.button
            onClick={toggleTheme}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="w-9 h-9 rounded-full flex items-center justify-center bg-white/5 text-white hover:bg-white/10 transition-all cursor-pointer border border-white/10"
            title="Toggle Light/Dark Theme"
          >
            {theme === 'dark' ? (
              <Sun className="w-4 h-4 text-google-yellow fill-current" />
            ) : (
              <Moon className="w-4 h-4 fill-current" />
            )}
          </motion.button>
        </div>
      </header>

      {/* 2. HERO SECTION GRID */}
      <motion.div 
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="w-full max-w-5xl mx-auto flex flex-col lg:flex-row items-center justify-center gap-12 md:gap-24 py-8 lg:py-0 min-h-[calc(100vh-4rem)]"
      >
        
        {/* Left Column: SaaS Headline, Pills, CTA */}
        <div className="w-full lg:w-[52%] flex flex-col items-center lg:items-start text-center lg:text-left pr-4">
          <motion.div 
            variants={itemVariants}
            className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#161f38] border border-[#FBBC05]/20 text-[#FBBC05] text-[10px] font-bold tracking-wide uppercase mb-5"
          >
            <Sparkles className="w-3 h-3 text-[#FBBC05] fill-current" />
            <span>WOW 2026 KIOSK CHALLENGE</span>
          </motion.div>

          <motion.h1 
            variants={itemVariants}
            className="text-[55px] md:text-[68px] lg:text-[76px] font-black tracking-tight leading-[1.05] mb-6 w-full"
          >
            <span className="text-white">Recreate.</span>
            <br />
            <span className="text-google-blue">Match.</span>
            <br />
            <span className="text-google-green">Score.</span>
          </motion.h1>

          <motion.p 
            variants={itemVariants}
            className="text-zinc-400 text-sm md:text-base leading-relaxed mb-7 max-w-md"
          >
            Drag UI components into their correct positions, rebuild iconic Google app layouts, and climb the WOW 2026 leaderboard.
          </motion.p>

          {/* Feature Pills */}
          <motion.div 
            variants={itemVariants}
            className="flex flex-wrap justify-center lg:justify-start gap-2 mb-8 max-w-md"
          >
            <div className="flex items-center gap-1.5 px-3.5 py-2 rounded-full bg-[#4285F4]/5 border border-[#4285F4]/30 text-google-blue text-[11.5px] font-bold">
              <Zap className="w-3.5 h-3.5 fill-current" />
              <span>Fast & Fun</span>
            </div>
            <div className="flex items-center gap-1.5 px-3.5 py-2 rounded-full bg-[#34A853]/5 border border-[#34A853]/30 text-google-green text-[11.5px] font-bold">
              <Target className="w-3.5 h-3.5" />
              <span>Real-time Score</span>
            </div>
            <div className="flex items-center gap-1.5 px-3.5 py-2 rounded-full bg-[#FBBC05]/5 border border-[#FBBC05]/30 text-[#ab8305] text-[11.5px] font-bold">
              <Trophy className="w-3.5 h-3.5 fill-current" />
              <span>Live Leaderboard</span>
            </div>
          </motion.div>

          {/* Action CTAs */}
          <motion.div 
            variants={itemVariants}
            className="flex flex-col sm:flex-row gap-3.5 w-full sm:w-auto"
          >
            <Button
              onClick={() => setIsRegisterOpen(true)}
              variant="filled"
              size="md"
              icon={<ChevronRight className="w-3.5 h-3.5" />}
              className="px-6 bg-google-blue text-white shadow-md font-bold tracking-wide"
            >
              Start Challenge
            </Button>
            
            <Button
              onClick={() => setIsHowPlayOpen(true)}
              variant="outlined"
              size="md"
              icon={<Play className="w-3.5 h-3.5 fill-current" />}
              className="px-5 font-bold tracking-wide border-white/20 hover:bg-white/5"
            >
              How to Play
            </Button>
          </motion.div>
        </div>

        {/* Right Column: Animated Google Wordmark and marquee */}
        <motion.div 
          variants={itemVariants}
          className="w-full lg:w-[48%] flex flex-col items-center justify-center relative min-h-[300px]"
        >
          {/* Radial Google Glow behind wordmark */}
          <div className="absolute w-[320px] h-[320px] rounded-full bg-gradient-to-tr from-google-blue/10 to-google-green/10 blur-3xl pointer-events-none -z-10 animate-pulse"></div>

          {/* Wordmark container */}
          <div 
            className="flex select-none font-bold tracking-tight font-sans" 
            style={{ fontSize: 'clamp(100px, 11vw, 154px)' }}
          >
            {[
              { char: 'G', color: '#4285F4', delay: 0 },
              { char: 'o', color: '#EA4335', delay: 0.1 },
              { char: 'o', color: '#FBBC05', delay: 0.2 },
              { char: 'g', color: '#4285F4', delay: 0.3 },
              { char: 'l', color: '#34A853', delay: 0.4 },
              { char: 'e', color: '#EA4335', delay: 0.5 },
            ].map((letObj, idx) => (
              <motion.span
                key={idx}
                style={{ color: letObj.color, display: 'inline-block' }}
                animate={{
                  y: [0, -12, 0],
                  scale: [1, 1.05, 1]
                }}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                  ease: "easeInOut",
                  delay: letObj.delay
                }}
                whileHover={{
                  scale: 1.15,
                  filter: "brightness(1.3)",
                  transition: { type: "spring", stiffness: 400, damping: 12 }
                }}
                className="cursor-pointer select-none"
              >
                {letObj.char}
              </motion.span>
            ))}
          </div>

          {/* Thin looping marquee/ticker strip */}
          <div className="w-full max-w-md overflow-hidden relative mt-10 pt-6 border-t border-white/5 flex flex-col items-center">
            <div className="w-full overflow-hidden relative h-14 flex items-center">
              <div className="absolute left-0 top-0 bottom-0 w-8 bg-gradient-to-r from-[#07090e] to-transparent z-10 pointer-events-none"></div>
              <div className="absolute right-0 top-0 bottom-0 w-8 bg-gradient-to-l from-[#07090e] to-transparent z-10 pointer-events-none"></div>
              
              <motion.div
                className="flex gap-8 pr-8 w-max whitespace-nowrap"
                animate={{ x: ["0%", "-50%"] }}
                transition={{
                  ease: "linear",
                  duration: 15,
                  repeat: Infinity,
                }}
              >
                {[
                  { Icon: SiGoogle, color: '#4285F4', name: 'Google' },
                  { Icon: SiGmail, color: '#EA4335', name: 'Gmail' },
                  { Icon: SiYoutube, color: '#FF0000', name: 'YouTube' },
                  { Icon: SiInstagram, color: '#E1306C', name: 'Instagram' },
                  { Icon: SiWhatsapp, color: '#25D366', name: 'WhatsApp' },
                  { Icon: SiSpotify, color: '#1DB954', name: 'Spotify' },
                  { Icon: SiNetflix, color: '#E50914', name: 'Netflix' },
                  { Icon: SiFacebook, color: '#1877F2', name: 'Facebook' },
                  { Icon: SiX, color: '#FFFFFF', name: 'X' },
                  { Icon: FaAmazon, color: '#FF9900', name: 'Amazon' },
                ].concat([
                  { Icon: SiGoogle, color: '#4285F4', name: 'Google' },
                  { Icon: SiGmail, color: '#EA4335', name: 'Gmail' },
                  { Icon: SiYoutube, color: '#FF0000', name: 'YouTube' },
                  { Icon: SiInstagram, color: '#E1306C', name: 'Instagram' },
                  { Icon: SiWhatsapp, color: '#25D366', name: 'WhatsApp' },
                  { Icon: SiSpotify, color: '#1DB954', name: 'Spotify' },
                  { Icon: SiNetflix, color: '#E50914', name: 'Netflix' },
                  { Icon: SiFacebook, color: '#1877F2', name: 'Facebook' },
                  { Icon: SiX, color: '#FFFFFF', name: 'X' },
                  { Icon: FaAmazon, color: '#FF9900', name: 'Amazon' },
                ]).map((item, idx) => {
                  const IconComponent = item.Icon;
                  return (
                    <div key={idx} className="inline-flex items-center justify-center p-1" title={item.name}>
                      <IconComponent style={{ color: item.color }} className="w-11 h-11 hover:scale-110 transition-transform cursor-pointer" />
                    </div>
                  );
                })}
              </motion.div>
            </div>
            <span className="text-[13px] text-zinc-500 mt-3 tracking-wide font-semibold">Recreate these and more →</span>
          </div>
        </motion.div>
      </motion.div>

      {/* How It Works Section */}
      <section id="how-it-works" className="w-full max-w-4xl mx-auto py-16 border-t border-white/5 select-none flex-shrink-0">
        <div className="text-center mb-10">
          <h3 className="text-2xl font-bold text-white mb-2">How it Works</h3>
          <p className="text-xs text-zinc-400">Master the puzzle challenge in three simple steps</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Card 1 */}
          <div className="border border-white/5 bg-white/[0.02] hover:bg-white/[0.04] p-6 rounded-2xl flex flex-col items-center text-center transition-all duration-300 hover:-translate-y-1 relative group overflow-hidden">
            {/* Blue accent top line */}
            <div className="absolute top-0 left-0 right-0 h-1 bg-[#4285F4]"></div>
            <div className="w-12 h-12 rounded-full bg-[#4285F4]/10 text-[#4285F4] flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
              <Grid className="w-6 h-6" />
            </div>
            <h4 className="font-extrabold text-sm text-white mb-2">1. Pick a puzzle</h4>
            <p className="text-xs text-zinc-400 leading-relaxed">Choose from 10 different classic app interface layouts across different difficulty levels.</p>
          </div>

          {/* Card 2 */}
          <div className="border border-white/5 bg-white/[0.02] hover:bg-white/[0.04] p-6 rounded-2xl flex flex-col items-center text-center transition-all duration-300 hover:-translate-y-1 relative group overflow-hidden">
            {/* Red accent top line */}
            <div className="absolute top-0 left-0 right-0 h-1 bg-[#EA4335]"></div>
            <div className="w-12 h-12 rounded-full bg-[#EA4335]/10 text-[#EA4335] flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
              <Move className="w-6 h-6" />
            </div>
            <h4 className="font-extrabold text-sm text-white mb-2">2. Drag components</h4>
            <p className="text-xs text-zinc-400 leading-relaxed">Drag components into their correct silhouette slots. Wrong placements cause visual shaking.</p>
          </div>

          {/* Card 3 */}
          <div className="border border-white/5 bg-white/[0.02] hover:bg-white/[0.04] p-6 rounded-2xl flex flex-col items-center text-center transition-all duration-300 hover:-translate-y-1 relative group overflow-hidden">
            {/* Green accent top line */}
            <div className="absolute top-0 left-0 right-0 h-1 bg-[#34A853]"></div>
            <div className="w-12 h-12 rounded-full bg-[#34A853]/10 text-[#34A853] flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
              <Trophy className="w-6 h-6" />
            </div>
            <h4 className="font-extrabold text-sm text-white mb-2">3. Beat the clock</h4>
            <p className="text-xs text-zinc-400 leading-relaxed">Score multiplier bonuses for speed and combo accuracy. Climb to the top of the event standings!</p>
          </div>
        </div>
      </section>

      {/* 3. TOP PERFORMERS ROW (Formula 1 Podium) */}
      <section id="leaderboard-section" className="w-full max-w-4xl mx-auto border-t border-white/5 pt-16 pb-12 select-none flex-shrink-0 my-16">
        <div className="flex items-center justify-between mb-8">
          <div className="text-left flex flex-col gap-0.5">
            <div className="flex items-center gap-2">
              <Trophy className="w-5 h-5 text-google-yellow fill-current" />
              <h4 className="font-extrabold text-md-on-surface text-base">Top 3 Champions</h4>
            </div>
            <span className="text-[11px] text-zinc-400">Leading the WOW 2026 Challenge</span>
          </div>
          <button 
            onClick={() => setIsLeaderboardOpen(true)}
            className="text-xs font-bold text-google-blue hover:underline cursor-pointer flex items-center gap-0.5"
          >
            <span>View Full Leaderboard</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Podium deck cards */}
        <div className="flex flex-col md:flex-row items-end justify-center gap-6 mt-1 h-[255px] w-full">
          
          {/* 2nd Place Card */}
          {topThree.length >= 2 && (
            <div className="flex-[0.9] h-[85%] flex flex-col justify-end w-full">
              <motion.div
                whileHover={{ y: -4, scale: 1.02 }}
                transition={{ type: 'spring', stiffness: 300, damping: 15 }}
                className="w-full h-full border border-zinc-700/40 bg-[#161a23]/60 rounded-3xl p-5 flex flex-col justify-between items-center text-center shadow-xl relative border-t-2 border-t-zinc-400/45"
              >
                {/* Rank badge */}
                <span className="absolute -top-3.5 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full text-[9px] font-black tracking-wider uppercase bg-[#2e3136] text-zinc-200 border border-zinc-600/30 shadow-md">
                  🥈 2nd Place
                </span>
                
                {/* Avatar & Names */}
                <div className="flex flex-col items-center mt-3">
                  <img 
                    src={topThree[1].avatarUrl}
                    alt="2nd Place"
                    className="w-12 h-12 rounded-full border-2 border-zinc-400/30 object-cover shadow-md mb-2"
                  />
                  <span className="font-extrabold text-white text-xs line-clamp-1 max-w-[130px]">{topThree[1].name}</span>
                  <span className="text-[9px] text-zinc-400 line-clamp-1 max-w-[130px]">{topThree[1].college}</span>
                </div>

                {/* Stats row */}
                <div className="flex gap-3 text-[10px] text-zinc-400 border-t border-white/5 pt-2 w-full justify-center">
                  <span>{topThree[1].puzzlesCompletedCount} Apps</span>
                  <span className="text-zinc-600">|</span>
                  <span>{topThree[1].accuracyPercentage}% Acc</span>
                </div>

                {/* Score */}
                <div className="text-base font-black text-white mt-1">
                  {topThree[1].totalScore} <span className="text-[10px] font-normal text-zinc-500">pts</span>
                </div>
              </motion.div>
            </div>
          )}

          {/* 1st Place Card (Champion) */}
          <div className="flex-[1.1] h-full flex flex-col justify-end w-full">
            <motion.div
              whileHover={{ y: -6, scale: 1.02 }}
              transition={{ type: 'spring', stiffness: 300, damping: 15 }}
              className="w-full h-full border-2 border-[#FBBC05] bg-[#1d1b16]/70 rounded-3xl p-6 flex flex-col justify-between items-center text-center shadow-[0_0_30px_rgba(251,188,5,0.2)] relative z-20"
            >
              {/* Crown Icon */}
              <div className="absolute -top-6 left-1/2 -translate-x-1/2 text-google-yellow drop-shadow-md">
                <Crown className="w-6 h-6 fill-current animate-bounce" style={{ animationDuration: '3.5s' }} />
              </div>

              {/* Rank badge */}
              <span className="absolute -top-3.5 left-1/2 -translate-x-1/2 px-3.5 py-1 rounded-full text-[9px] font-black tracking-wider uppercase bg-[#FBBC05] text-zinc-950 border border-[#FDD663]/30 shadow-lg">
                👑 Champion
              </span>
              
              {/* Avatar & Names */}
              <div className="flex flex-col items-center mt-3">
                {topThree.length > 0 ? (
                  <>
                    <div className="relative">
                      <img 
                        src={topThree[0].avatarUrl}
                        alt="1st Place"
                        className="w-14 h-14 rounded-full border-2 border-[#FBBC05] object-cover shadow-lg mb-2"
                      />
                      <div className="absolute -bottom-1 -right-1 bg-google-green text-white text-[8px] w-4.5 h-4.5 rounded-full flex items-center justify-center border border-[#1d1b16] font-bold shadow-sm">
                        1
                      </div>
                    </div>
                    <span className="font-black text-white text-sm line-clamp-1 max-w-[150px]">{topThree[0].name}</span>
                    <span className="text-[10px] text-zinc-400 line-clamp-1 max-w-[150px] font-medium">{topThree[0].college}</span>
                  </>
                ) : (
                  <>
                    <div className="w-14 h-14 rounded-full border-2 border-[#FBBC05]/20 flex items-center justify-center text-[#FBBC05]/40 mb-2 bg-[#1d1b16]/90">
                      <User className="w-6 h-6 fill-current" />
                    </div>
                    <span className="font-black text-white text-xs mt-1">No scores yet</span>
                    <span className="text-[10px] text-zinc-400 font-medium">Be the first to play!</span>
                  </>
                )}
              </div>

              {/* Stats & Score */}
              {topThree.length > 0 ? (
                <>
                  <div className="flex gap-3 text-[10px] text-zinc-400 border-t border-white/5 pt-2 w-full justify-center">
                    <span>{topThree[0].puzzlesCompletedCount} Apps</span>
                    <span className="text-zinc-600">|</span>
                    <span>{topThree[0].accuracyPercentage}% Acc</span>
                  </div>
                  <div className="text-lg font-black text-[#FBBC05] drop-shadow-sm mt-1">
                    {topThree[0].totalScore} <span className="text-[10px] font-normal text-[#FBBC05]/60">pts</span>
                  </div>
                </>
              ) : (
                <div className="text-[9px] text-[#FBBC05]/60 font-black tracking-wide border-t border-[#FBBC05]/20 pt-2 w-full uppercase">
                  Leaderboard open
                </div>
              )}
            </motion.div>
          </div>

          {/* 3rd Place Card */}
          {topThree.length >= 3 && (
            <div className="flex-[0.9] h-[85%] flex flex-col justify-end w-full">
              <motion.div
                whileHover={{ y: -4, scale: 1.02 }}
                transition={{ type: 'spring', stiffness: 300, damping: 15 }}
                className="w-full h-full border border-zinc-700/40 bg-[#191512]/60 rounded-3xl p-4 flex flex-col justify-between items-center text-center shadow-xl relative border-t-2 border-t-[#CD7F32]/50"
              >
                {/* Rank badge */}
                <span className="absolute -top-3.5 left-1/2 -translate-x-1/2 px-2.5 py-1 rounded-full text-[9px] font-black tracking-wider uppercase bg-[#CD7F32] text-zinc-100 border border-[#DFA15E]/30 shadow-md">
                  🥉 3rd Place
                </span>
                
                {/* Avatar & Names */}
                <div className="flex flex-col items-center mt-2.5">
                  <img 
                    src={topThree[2].avatarUrl}
                    alt="3rd Place"
                    className="w-12 h-12 rounded-full border-2 border-[#CD7F32]/30 object-cover shadow-md mb-2"
                  />
                  <span className="font-extrabold text-white text-xs line-clamp-1 max-w-[130px]">{topThree[2].name}</span>
                  <span className="text-[9px] text-zinc-400 line-clamp-1 max-w-[130px]">{topThree[2].college}</span>
                </div>

                {/* Stats row */}
                <div className="flex gap-3 text-[10px] text-zinc-400 border-t border-white/5 pt-2 w-full justify-center">
                  <span>{topThree[2].puzzlesCompletedCount} Apps</span>
                  <span className="text-zinc-600">|</span>
                  <span>{topThree[2].accuracyPercentage}% Acc</span>
                </div>

                {/* Score */}
                <div className="text-sm font-black text-[#DFA15E] mt-1">
                  {topThree[2].totalScore} <span className="text-[9px] font-normal text-zinc-500">pts</span>
                </div>
              </motion.div>
            </div>
          )}

        </div>
      </section>

      {/* 4. BOTTOM FEATURE BANNER */}
      <footer className="w-full border-t border-white/5 py-8 flex items-center justify-around text-[10px] text-zinc-400 font-semibold select-none flex-shrink-0 mt-8">
        <div className="flex items-center gap-1.5">
          <Globe className="w-3.5 h-3.5 text-google-blue" />
          <span>Multiple Puzzles (10+ layouts)</span>
        </div>
        <div className="flex items-center gap-1.5">
          <Target className="w-3.5 h-3.5 text-google-green" />
          <span>Real-time Scoring & combos</span>
        </div>
        <div className="flex items-center gap-1.5">
          <Trophy className="w-3.5 h-3.5 text-google-yellow" />
          <span>Event Leaderboard</span>
        </div>
        <div className="flex items-center gap-1.5">
          <Sparkles className="w-3.5 h-3.5 text-google-red" />
          <span>Win Exciting Prizes</span>
        </div>
      </footer>

      {/* 5. DIALOGS & OVERLAYS */}
      <AnimatePresence>
        
        {/* A. USER PROFILE REGISTRATION DIALOG */}
        {isRegisterOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsRegisterOpen(false)}
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            ></motion.div>

            <motion.div
              initial={{ scale: 0.9, y: 15, opacity: 0 }}
              animate={{ scale: 1, y: 0, opacity: 1 }}
              exit={{ scale: 0.9, y: 15, opacity: 0 }}
              transition={{ type: 'spring', damping: 20, stiffness: 250 }}
              className="relative w-full max-w-sm bg-md-surface border border-md-outline/25 shadow-2xl rounded-3xl overflow-hidden z-10"
            >
              <div className="px-6 pt-5 pb-3 flex justify-between items-center border-b border-md-outline/10">
                <span className="font-extrabold text-sm text-md-on-surface flex items-center gap-1.5">
                  <User className="w-4 h-4 text-google-blue fill-current" />
                  <span>Participant Details</span>
                </span>
                <button 
                  onClick={() => setIsRegisterOpen(false)}
                  className="p-1 rounded-full text-md-outline hover:bg-md-surface-variant/20 transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <form onSubmit={handleStartSubmit} className="p-6 flex flex-col gap-4">
                <div className="flex flex-col gap-3">
                  <div>
                    <label className="text-[10px] font-black uppercase text-md-outline tracking-wider block mb-1">Your Name</label>
                    <input
                      type="text"
                      maxLength={15}
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="e.g. Jaswanth"
                      className="w-full bg-md-bg border border-md-outline/30 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-google-blue focus:ring-1 focus:ring-google-blue text-md-on-surface font-semibold placeholder:text-md-outline/40"
                      required
                    />
                  </div>
                  <div>
                    <label className="text-[10px] font-black uppercase text-md-outline tracking-wider block mb-1">University / Organization</label>
                    <input
                      type="text"
                      maxLength={25}
                      value={college}
                      onChange={(e) => setCollege(e.target.value)}
                      placeholder="e.g. GITAM University"
                      className="w-full bg-md-bg border border-md-outline/30 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-google-blue focus:ring-1 focus:ring-google-blue text-md-on-surface font-semibold placeholder:text-md-outline/40"
                      required
                    />
                  </div>
                </div>

                <div className="flex items-center justify-end gap-2 mt-2 pt-2 border-t border-md-outline/10">
                  <Button
                    onClick={() => setIsRegisterOpen(false)}
                    variant="text"
                    size="sm"
                    disabled={isRegisterLoading}
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    variant="filled"
                    size="sm"
                    className="bg-google-blue text-white shadow-sm font-bold"
                    disabled={isRegisterLoading}
                    icon={isRegisterLoading ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : undefined}
                  >
                    {isRegisterLoading ? 'Connecting...' : 'Start Game'}
                  </Button>
                </div>
              </form>
            </motion.div>
          </div>
        )}

        {/* A.2 E-WALLET QR CODE OVERLAY */}
        {isWaitingForPayment && sessionId && (
          <QRPaymentScreen
            sessionId={sessionId}
            onSuccess={(uId) => {
              setUserId(uId);
              setWaitingForPayment(false);
              startSession();
            }}
            onCancel={() => {
              setWaitingForPayment(false);
              setSessionId(null);
            }}
          />
        )}

        {/* B. FULL LEADERBOARD OVERLAY MODAL */}
        {isLeaderboardOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsLeaderboardOpen(false)}
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            ></motion.div>

            <motion.div
              initial={{ scale: 0.9, y: 20, opacity: 0 }}
              animate={{ scale: 1, y: 0, opacity: 1 }}
              exit={{ scale: 0.9, y: 20, opacity: 0 }}
              transition={{ type: 'spring', damping: 22, stiffness: 220 }}
              className="relative w-full max-w-2xl bg-md-surface border border-md-outline/25 shadow-2xl rounded-3xl overflow-hidden z-10 flex flex-col max-h-[90vh]"
            >
              <div className="px-6 py-5 flex justify-between items-center border-b border-md-outline/10 flex-shrink-0">
                <div className="flex items-center gap-2">
                  <Trophy className="w-5 h-5 text-google-yellow fill-current" />
                  <span className="font-extrabold text-base text-md-on-surface">Event Kiosk Leaderboard</span>
                </div>
                <button 
                  onClick={() => setIsLeaderboardOpen(false)}
                  className="p-1 rounded-full text-md-outline hover:bg-md-surface-variant/20 transition-colors cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="p-6 overflow-y-auto flex-grow flex flex-col gap-2 scrollbar-thin">
                {leaderboard.length === 0 ? (
                  <div className="text-center py-10 text-xs text-md-outline italic">
                    No leaderboard entries recorded yet.
                  </div>
                ) : (
                  <>
                    <div className="grid grid-cols-12 px-4 py-1 text-[9px] font-black text-md-outline uppercase tracking-wider border-b border-md-outline/5 pb-2">
                      <span className="col-span-1 text-center">#</span>
                      <span className="col-span-5 text-left">Participant</span>
                      <span className="col-span-2 text-center">Completed</span>
                      <span className="col-span-2 text-center">Acc / Time</span>
                      <span className="col-span-2 text-right">Score</span>
                    </div>

                    <div className="flex flex-col gap-2.5 mt-2">
                      {leaderboard.map((entry, index) => {
                        const rankStyles = [
                          'text-google-yellow border-google-yellow/20 bg-google-yellow/5 font-bold',
                          'text-google-blue border-google-blue/20 bg-google-blue/5 font-bold',
                          'text-google-red border-google-red/20 bg-google-red/5 font-bold',
                        ];

                        return (
                          <div
                            key={index}
                            className="grid grid-cols-12 items-center px-4 py-2.5 rounded-2xl border border-md-outline/10 bg-md-surface-variant/5 text-xs transition-all hover:scale-[1.002]"
                          >
                            <span className={`col-span-1 w-5.5 h-5.5 rounded-full flex items-center justify-center text-[10px] mx-auto border ${rankStyles[index] || 'text-md-outline border-md-outline/25'}`}>
                              {index + 1}
                            </span>
                            <div className="col-span-5 flex flex-col text-left truncate min-w-0 pr-2">
                              <span className="font-bold text-md-on-surface truncate">{entry.name}</span>
                              <span className="text-[10px] text-md-outline truncate">{entry.college}</span>
                            </div>
                            <span className="col-span-2 text-center font-mono font-bold text-md-on-surface">
                              {entry.puzzlesCompletedCount} Apps
                            </span>
                            <div className="col-span-2 flex flex-col items-center font-mono text-[9px] text-md-outline">
                              <span>{entry.accuracyPercentage}% Acc</span>
                              <span>{entry.averageTime}s avg</span>
                            </div>
                            <span className="col-span-2 text-right font-mono font-black text-google-green text-sm">
                              {entry.totalScore}
                            </span>
                          </div>
                        );
                      })}
                    </div>
                  </>
                )}
              </div>

              <div className="px-6 py-4 flex justify-end border-t border-md-outline/10 flex-shrink-0">
                <Button onClick={() => setIsLeaderboardOpen(false)} variant="filled" size="sm" className="bg-google-blue text-white shadow-sm">
                  Close Leaderboard
                </Button>
              </div>
            </motion.div>
          </div>
        )}

        {/* C. HOW TO PLAY INSTRUCTIONAL MODAL */}
        {isHowPlayOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsHowPlayOpen(false)}
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            ></motion.div>

            <motion.div
              initial={{ scale: 0.9, y: 15, opacity: 0 }}
              animate={{ scale: 1, y: 0, opacity: 1 }}
              exit={{ scale: 0.9, y: 15, opacity: 0 }}
              transition={{ type: 'spring', damping: 20, stiffness: 250 }}
              className="relative w-full max-w-md bg-md-surface border border-md-outline/25 shadow-2xl rounded-3xl overflow-hidden z-10 flex flex-col"
            >
              <div className="px-6 py-5 flex justify-between items-center border-b border-md-outline/10">
                <span className="font-extrabold text-sm text-md-on-surface flex items-center gap-1.5">
                  <HelpCircle className="w-4 h-4 text-google-blue" />
                  <span>How it Works</span>
                </span>
                <button 
                  onClick={() => setIsHowPlayOpen(false)}
                  className="p-1 rounded-full text-md-outline hover:bg-md-surface-variant/20 transition-colors cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="p-6 flex flex-col gap-5">
                
                <div className="flex gap-4">
                  <div className="w-8 h-8 rounded-full bg-google-blue/10 text-google-blue font-bold text-xs flex items-center justify-center flex-shrink-0">
                    1
                  </div>
                  <div className="flex flex-col text-left">
                    <h5 className="font-bold text-sm text-md-on-surface">Drag Widgets</h5>
                    <p className="text-xs text-md-outline mt-0.5">Drag UI components (search bars, buttons, layouts) from the tray on the left.</p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="w-8 h-8 rounded-full bg-google-green/10 text-google-green font-bold text-xs flex items-center justify-center flex-shrink-0">
                    2
                  </div>
                  <div className="flex flex-col text-left">
                    <h5 className="font-bold text-sm text-md-on-surface">Rebuild Mockups</h5>
                    <p className="text-xs text-md-outline mt-0.5">Match components to their correct grayscale silhouette slots on the phone screen. Wrong placements trigger a device shake!</p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="w-8 h-8 rounded-full bg-google-yellow/10 text-[#ab8305] font-bold text-xs flex items-center justify-center flex-shrink-0">
                    3
                  </div>
                  <div className="flex flex-col text-left">
                    <h5 className="font-bold text-sm text-md-on-surface">Save Anytime</h5>
                    <p className="text-xs text-md-outline mt-0.5">Score high by working quickly and maintaining correct combos. Tap "Finish & Save" anytime to persist your score on the live Top 10 leaderboard!</p>
                  </div>
                </div>

              </div>

              <div className="px-6 py-4 flex justify-end border-t border-md-outline/10">
                <Button 
                  onClick={() => {
                    setIsHowPlayOpen(false);
                    setIsRegisterOpen(true);
                  }} 
                  variant="filled" 
                  size="sm"
                  className="bg-google-blue text-white shadow-sm"
                >
                  Got it, Let's Play!
                </Button>
              </div>
            </motion.div>
          </div>
        )}

        {/* 5. HIDDEN ADMIN PANEL MODAL */}
        {isAdminOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm px-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="w-full max-w-sm bg-[#161a23] border border-white/10 rounded-3xl p-6 text-center shadow-2xl relative"
            >
              {/* Close Button */}
              <button 
                onClick={() => setIsAdminOpen(false)}
                className="absolute top-4 right-4 text-zinc-400 hover:text-white transition-colors"
              >
                <X className="w-4 h-4" />
              </button>

              {!isPinVerified ? (
                // PIN Verification Form
                <form onSubmit={handlePinSubmit} className="flex flex-col items-center">
                  <h3 className="text-lg font-bold text-white mb-2">Admin Authentication</h3>
                  <p className="text-xs text-zinc-400 mb-5">Enter the 4-digit Event PIN to proceed.</p>
                  
                  <input
                    type="password"
                    maxLength={4}
                    value={adminPin}
                    onChange={(e) => setAdminPin(e.target.value)}
                    placeholder="••••"
                    className="w-28 text-center bg-white/5 border border-white/10 rounded-2xl py-2 px-3 text-2xl font-black tracking-widest text-white focus:outline-none focus:border-google-blue mb-4"
                    autoFocus
                  />
                  
                  {pinError ? (
                    <span className="text-xs font-bold text-google-red mb-3 animate-shake">{pinError}</span>
                  ) : null}

                  <div className="flex gap-3.5 w-full mt-2">
                    <Button 
                      type="button" 
                      onClick={() => setIsAdminOpen(false)} 
                      variant="outlined" 
                      className="flex-1 text-xs py-2 px-3 border-white/10 text-zinc-300"
                    >
                      Cancel
                    </Button>
                    <Button 
                      type="submit" 
                      variant="filled" 
                      className="flex-1 text-xs py-2 px-3 bg-google-blue text-white"
                    >
                      Verify
                    </Button>
                  </div>
                </form>
              ) : (
                // Admin Actions Panel
                <div className="flex flex-col items-center">
                  <h3 className="text-lg font-bold text-white mb-2">Admin Panel — WOW 2026</h3>
                  
                  {!isConfirmingClear ? (
                    <>
                      <p className="text-xs text-zinc-400 mb-6">Wipe all leaderboard standings and event records?</p>
                      
                      <div className="flex flex-col gap-2.5 w-full">
                        <Button
                          onClick={() => setIsConfirmingClear(true)}
                          className="w-full bg-google-red text-white font-bold py-2.5"
                          variant="filled"
                        >
                          Clear All Scores
                        </Button>
                        <Button
                          onClick={() => setIsAdminOpen(false)}
                          className="w-full border-white/10 text-zinc-300 py-2.5"
                          variant="outlined"
                        >
                          Cancel
                        </Button>
                      </div>
                    </>
                  ) : (
                    <>
                      <p className="text-xs text-google-red font-bold mb-1">Are you sure?</p>
                      <p className="text-xs text-zinc-400 mb-6">This cannot be undone.</p>
                      
                      <div className="flex flex-col gap-2.5 w-full">
                        <Button
                          onClick={() => {
                            localStorage.removeItem('wow2026-leaderboard-m3');
                            loadLeaderboard();
                            setIsAdminOpen(false);
                            soundEffects.playSuccess();
                          }}
                          className="w-full bg-google-red text-white font-black py-2.5"
                          variant="filled"
                        >
                          Yes, Clear Everything
                        </Button>
                        <Button
                          onClick={() => setIsConfirmingClear(false)}
                          className="w-full border-white/10 text-zinc-300 py-2.5"
                          variant="outlined"
                        >
                          Cancel
                        </Button>
                      </div>
                    </>
                  )}
                </div>
              )}
            </motion.div>
          </div>
        )}

      </AnimatePresence>

    </div>
  );
};
