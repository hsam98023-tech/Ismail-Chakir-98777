import React, { Suspense, useState, useEffect } from 'react';
import { Canvas } from '@react-three/fiber';
import { Loader } from '@react-three/drei';
import { AnimatePresence } from 'framer-motion';
import { Experience } from './components/Experience';
import { Overlay } from './components/Overlay';
import { Login } from './components/Login';

// Define the narrative stages of the experience
export type Stage = 'INTRO' | 'CAKE' | 'WISH' | 'MESSAGES' | 'FINALE';

const App: React.FC = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [stage, setStage] = useState<Stage>('INTRO');
  
  // Audio ref (placeholder for potential background music)
  const audioRef = React.useRef<HTMLAudioElement | null>(null);

  // Simple state machine to advance story
  const nextStage = () => {
    if (stage === 'INTRO') setStage('CAKE');
    else if (stage === 'CAKE') setStage('WISH');
    else if (stage === 'WISH') setStage('MESSAGES');
    else if (stage === 'MESSAGES') setStage('FINALE');
  };

  return (
    <>
      <AnimatePresence>
        {!isAuthenticated && (
          <Login onLogin={() => setIsAuthenticated(true)} />
        )}
      </AnimatePresence>

      <div className={`w-full h-screen bg-[#1a0b2e] transition-opacity duration-1000 ${isAuthenticated ? 'opacity-100' : 'opacity-0'}`}>
        <Canvas
          dpr={[1, 2]}
          shadows
          camera={{ position: [0, 2, 10], fov: 45 }}
          gl={{ antialias: true, alpha: true, toneMappingExposure: 1.1 }}
        >
          <Suspense fallback={null}>
            {isAuthenticated && (
              <Experience stage={stage} />
            )}
          </Suspense>
        </Canvas>
      
        {/* The UI Layer handles the storytelling text */}
        {isAuthenticated && (
           <Overlay stage={stage} onNext={nextStage} />
        )}
      </div>
      
      {isAuthenticated && (
        <Loader 
          containerStyles={{ background: '#1a0b2e' }}
          innerStyles={{ width: '40vw', height: '2px', background: '#333' }}
          barStyles={{ background: '#ff69b4', height: '2px' }}
          dataInterpolation={(p) => `Loading Magic... ${p.toFixed(0)}%`}
        />
      )}
      
      {isAuthenticated && (
        <nav className="fixed top-0 left-0 w-full p-6 md:p-8 flex justify-between items-center z-50 pointer-events-none text-white/80 mix-blend-plus-lighter">
          <div className="text-xl font-bold font-serif tracking-widest pointer-events-auto cursor-pointer">
            H &middot; B
          </div>
          <div className="hidden md:flex gap-4 text-xs font-semibold pointer-events-auto uppercase tracking-widest opacity-50">
             <span>{stage} PHASE</span>
          </div>
        </nav>
      )}
    </>
  );
};

export default App;