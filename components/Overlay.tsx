import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronRight, Sparkles, Wind } from 'lucide-react';
import confetti from 'canvas-confetti';
import { Stage } from '../App';

interface OverlayProps {
  stage: Stage;
  onNext: () => void;
}

export const Overlay: React.FC<OverlayProps> = ({ stage, onNext }) => {
  const [canProceed, setCanProceed] = useState(false);

  // Reset proceed state on stage change
  useEffect(() => {
    setCanProceed(false);
    
    // Auto sequence for Messages phase
    if (stage === 'MESSAGES') {
        const timer = setTimeout(() => {
            onNext();
        }, 12000); // 12 seconds to read messages
        return () => clearTimeout(timer);
    }
  }, [stage, onNext]);

  // Handler for blowing candles (Wish Phase)
  const handleWish = () => {
    confetti({
      particleCount: 150,
      spread: 100,
      origin: { y: 0.6 },
      colors: ['#FFD700', '#FFA500', '#FF69B4', '#FFF']
    });
    onNext();
  };

  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 1, ease: "easeOut" } },
    exit: { opacity: 0, y: -20, transition: { duration: 0.5 } }
  };

  return (
    <div className="absolute inset-0 z-10 pointer-events-none flex flex-col justify-center items-center text-center p-6">
      <AnimatePresence mode='wait'>
        
        {/* STAGE 1: INTRO */}
        {stage === 'INTRO' && (
          <motion.div
            key="intro"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="flex flex-col items-center"
          >
            <h1 className="text-4xl md:text-6xl font-serif text-white/90 mb-4 tracking-wide">
              Today is not just a birthday...
            </h1>
            <p className="text-pink-200/60 text-lg md:text-xl font-light max-w-lg mb-8">
              It's the beginning of a new chapter in a beautiful story.
            </p>
            <motion.button
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 2 }}
              onClick={onNext}
              className="pointer-events-auto bg-white/10 hover:bg-white/20 backdrop-blur-md border border-white/20 text-white px-8 py-3 rounded-full flex items-center gap-2 transition-all group"
            >
              Start Journey <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </motion.button>
          </motion.div>
        )}

        {/* STAGE 2: CAKE */}
        {stage === 'CAKE' && (
          <motion.div
            key="cake"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="absolute bottom-20 md:bottom-10 w-full flex flex-col items-center"
          >
            <div className="bg-black/30 backdrop-blur-xl p-6 rounded-2xl border border-white/10 max-w-md">
                <h2 className="text-2xl font-serif text-pink-200 mb-2">The Light of Celebration</h2>
                <p className="text-sm text-gray-300 mb-4">
                  Touch the candles to light them up. Let the warmth fill the room.
                </p>
                <button 
                    onClick={onNext}
                    className="pointer-events-auto px-6 py-2 bg-pink-500/20 hover:bg-pink-500/40 border border-pink-500/50 rounded-lg text-pink-100 text-sm transition-colors"
                >
                    I have lit them all (Proceed)
                </button>
            </div>
          </motion.div>
        )}

        {/* STAGE 3: WISH */}
        {stage === 'WISH' && (
          <motion.div
            key="wish"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
          >
             <h2 className="text-5xl md:text-7xl font-cursive text-transparent bg-clip-text bg-gradient-to-r from-yellow-200 to-amber-500 drop-shadow-lg mb-8">
                Make a Wish 🎂
             </h2>
             <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleWish}
                className="pointer-events-auto bg-gradient-to-r from-pink-600 to-purple-600 text-white px-10 py-4 rounded-full font-bold shadow-lg shadow-pink-500/30 flex items-center gap-3 mx-auto"
             >
                <Wind className="w-5 h-5" /> 
                <span className="flex flex-col items-start text-left">
                    <span>Blow Out Candles</span>
                    <span className="text-xs opacity-80 font-arabic">أطفئ الشموع</span>
                </span>
             </motion.button>
          </motion.div>
        )}

        {/* STAGE 4: MESSAGES (ARABIC) */}
        {stage === 'MESSAGES' && (
          <motion.div
            key="messages"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="w-full max-w-4xl px-4"
          >
            {/* Using a staggered animation sequence for lines */}
             <div className="font-arabic space-y-12" dir="rtl">
                <motion.p 
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.5, duration: 1 }}
                    className="text-2xl md:text-4xl text-white leading-relaxed drop-shadow-md"
                >
                   "عيد ميلادك ليس مجرد يوم، بل هو اليوم الذي وُلدت فيه سعادتي 💗"
                </motion.p>
                <motion.p 
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 3.5, duration: 1 }}
                    className="text-xl md:text-3xl text-pink-200 leading-relaxed"
                >
                   "في يوم ميلادك، لا أحتفل فقط بعامٍ جديد من عمرك، بل أحتفل بوجودك في حياتي"
                </motion.p>
                <motion.p 
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 6.5, duration: 1 }}
                    className="text-3xl md:text-5xl text-purple-200 font-bold leading-relaxed"
                >
                   "كل عام وأنتِ نبضي الذي لا يهدأ"
                </motion.p>
             </div>
          </motion.div>
        )}

        {/* STAGE 5: FINALE */}
        {stage === 'FINALE' && (
          <motion.div
            key="finale"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="flex flex-col items-center"
          >
            <motion.div 
               animate={{ rotate: 360 }}
               transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
               className="w-64 h-64 absolute -z-10 bg-gradient-to-tr from-pink-500/20 to-purple-500/20 rounded-full blur-[80px]"
            />
            <h1 className="text-7xl md:text-9xl font-cursive text-white mb-6 p-4">
                Happy Birthday<br/>Hiba
            </h1>
            <p className="text-white/60 text-sm tracking-[0.3em] uppercase mb-12">
                Forever & Always
            </p>
            <div className="flex gap-4">
                <button onClick={() => window.location.reload()} className="pointer-events-auto text-xs text-white/30 hover:text-white transition-colors">
                    Replay Experience
                </button>
            </div>
          </motion.div>
        )}

      </AnimatePresence>
    </div>
  );
};