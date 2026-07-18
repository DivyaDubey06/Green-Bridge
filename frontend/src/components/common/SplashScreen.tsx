import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export const SplashScreen: React.FC<{ onComplete: () => void }> = ({ onComplete }) => {
  const [step, setStep] = useState(0);

  useEffect(() => {
    // Sequence of animations
    const t1 = setTimeout(() => setStep(1), 500);  // Bridge builds
    const t2 = setTimeout(() => setStep(2), 1100); // Leaves grow & glow
    const t3 = setTimeout(() => setStep(3), 1700); // Slogans fade in
    const t4 = setTimeout(() => {
      onComplete();
    }, 3200); // Finish and transition

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
      clearTimeout(t4);
    };
  }, [onComplete]);

  return (
    <div className="fixed inset-0 bg-warm-cream z-50 flex flex-col items-center justify-center overflow-hidden">
      <motion.div 
        className="flex flex-col items-center max-w-md px-6 text-center"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0, y: -20 }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
      >
        {/* Animated Bridge SVG Logo */}
        <div className="w-40 h-40 relative mb-6">
          <svg viewBox="0 0 100 100" fill="none" className="w-full h-full">
            {/* Background Glow */}
            <motion.circle 
              cx="50" 
              cy="50" 
              r="46" 
              fill="#D8F3FF" 
              initial={{ opacity: 0, scale: 0.5 }}
              animate={step >= 2 ? { opacity: 0.4, scale: 1 } : { opacity: 0 }}
              transition={{ duration: 0.8, ease: 'easeOut' }}
            />
            
            {/* River */}
            <motion.path 
              d="M10 75C25 70 30 80 50 75C70 70 75 80 90 75C92 78 85 85 50 85C15 85 8 78 10 75Z" 
              fill="#4EA8DE" 
              initial={{ opacity: 0, pathLength: 0 }}
              animate={step >= 1 ? { opacity: 0.8, pathLength: 1 } : { opacity: 0 }}
              transition={{ duration: 1 }}
            />

            {/* Left Tree Trunk & Canopy */}
            <motion.path 
              d="M22 62C12 62 10 40 22 36C18 25 32 18 36 28C44 26 46 42 36 48C42 54 32 62 22 62Z" 
              fill="#2E7D32" 
              initial={{ opacity: 0, scale: 0 }}
              animate={step >= 2 ? { opacity: 1, scale: 1 } : { opacity: 0 }}
              transition={{ duration: 0.8 }}
            />
            <motion.path 
              d="M22 60V74" 
              stroke="#1B4332" 
              strokeWidth="4" 
              strokeLinecap="round"
              initial={{ pathLength: 0 }}
              animate={step >= 1 ? { pathLength: 1 } : { pathLength: 0 }}
            />

            {/* Right Tree Trunk & Canopy */}
            <motion.path 
              d="M78 62C88 62 90 40 78 36C82 25 68 18 64 28C56 26 54 42 64 48C58 54 68 62 78 62Z" 
              fill="#4CAF50" 
              initial={{ opacity: 0, scale: 0 }}
              animate={step >= 2 ? { opacity: 1, scale: 1 } : { opacity: 0 }}
              transition={{ duration: 0.8, delay: 0.1 }}
            />
            <motion.path 
              d="M78 60V74" 
              stroke="#1B4332" 
              strokeWidth="4" 
              strokeLinecap="round"
              initial={{ pathLength: 0 }}
              animate={step >= 1 ? { pathLength: 1 } : { pathLength: 0 }}
            />

            {/* Wooden Bridge Arch */}
            <motion.path 
              d="M20 63C35 52 65 52 80 63" 
              stroke="#B07D62" 
              strokeWidth="6" 
              fill="none" 
              strokeLinecap="round" 
              initial={{ pathLength: 0 }}
              animate={step >= 1 ? { pathLength: 1 } : { pathLength: 0 }}
              transition={{ duration: 1.2, ease: 'easeInOut' }}
            />
            <motion.path 
              d="M20 53C35 42 65 42 80 53" 
              stroke="#8A5A44" 
              strokeWidth="3.5" 
              fill="none" 
              strokeLinecap="round" 
              initial={{ pathLength: 0 }}
              animate={step >= 1 ? { pathLength: 1 } : { pathLength: 0 }}
              transition={{ duration: 1.2, ease: 'easeInOut' }}
            />
          </svg>
        </div>

        {/* Brand Name */}
        <motion.h2 
          className="font-serif text-4xl font-extrabold tracking-wide text-dark-forest mb-2"
          initial={{ opacity: 0, y: 15 }}
          animate={step >= 2 ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
        >
          GreenBridge
        </motion.h2>

        {/* Dynamic Slogans */}
        <div className="h-12 overflow-hidden flex flex-col justify-center items-center">
          <AnimatePresence mode="wait">
            {step === 3 && (
              <motion.div
                key="tagline-1"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.5 }}
                className="text-primary-green font-serif italic text-lg"
              >
                Bring the Change.
              </motion.div>
            )}
            {step > 3 && (
              <motion.div
                key="tagline-2"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="text-slate-text/70 font-semibold tracking-wider text-sm uppercase"
              >
                Connecting People Who Care.
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>

      {/* Decorative leafy elements drifting in the splash screen background */}
      <div className="absolute inset-0 select-none pointer-events-none opacity-5">
        <span className="absolute top-12 left-10 text-6xl animate-float">🍃</span>
        <span className="absolute bottom-20 right-16 text-8xl animate-float-delayed">🌳</span>
        <span className="absolute top-1/3 right-1/4 text-5xl animate-float">🌱</span>
      </div>
    </div>
  );
};
export default SplashScreen;
