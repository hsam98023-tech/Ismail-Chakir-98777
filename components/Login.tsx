import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Heart, Lock } from 'lucide-react';

interface LoginProps {
  onLogin: () => void;
}

export const Login: React.FC<LoginProps> = ({ onLogin }) => {
  const [password, setPassword] = useState('');
  const [error, setError] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Simulate backend validation
    if (password.toLowerCase() === 'hiba' || password === '0404') {
      onLogin();
    } else {
      setError(true);
      setTimeout(() => setError(false), 500);
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, scale: 1.1, filter: "blur(20px)" }}
      transition={{ duration: 1 }}
      className="fixed inset-0 z-[100] flex items-center justify-center bg-[#1a0b2e] bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-purple-900/40 via-[#1a0b2e] to-[#0f0518]"
    >
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-pink-500/20 rounded-full blur-[100px] animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-500/20 rounded-full blur-[100px] animate-pulse delay-700"></div>
      </div>

      <div className="relative z-10 w-full max-w-md p-8 mx-4">
        <motion.div 
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="bg-white/5 backdrop-blur-xl border border-white/10 p-8 rounded-2xl shadow-2xl text-center"
        >
          <div className="mx-auto w-16 h-16 bg-gradient-to-tr from-pink-500 to-purple-500 rounded-full flex items-center justify-center mb-6 shadow-lg shadow-pink-500/30">
            <Heart className="w-8 h-8 text-white fill-white/50" />
          </div>

          <h1 className="text-3xl font-serif text-white mb-2">Welcome Hiba</h1>
          <p className="text-white/50 text-sm mb-8">Enter the secret key to unlock your world.</p>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
              <input 
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className={`w-full bg-black/20 border ${error ? 'border-red-500 animate-shake' : 'border-white/10 focus:border-pink-500'} rounded-lg py-3 pl-10 pr-4 text-white outline-none transition-all placeholder:text-white/20`}
                placeholder="Password (try: hiba)"
                autoFocus
              />
            </div>
            <button 
              type="submit"
              className="w-full bg-white text-purple-900 font-bold py-3 rounded-lg hover:bg-pink-100 transition-colors shadow-lg shadow-white/10"
            >
              Unlock Experience
            </button>
          </form>
        </motion.div>
      </div>
    </motion.div>
  );
};