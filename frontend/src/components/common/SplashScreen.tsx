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
        <div className="w-40 h-40 relative mb-6 flex items-center justify-center">
          <motion.img 
            src="/assets/illustrations/bridge_hero.png" 
            alt="Green Bridge Logo" 
            className="w-32 h-32 object-contain"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={step >= 1 ? { opacity: 1, scale: 1 } : {}}
            transition={{ duration: 1, ease: 'easeOut' }}
          />
        </div>

        {/* Brand Name */}
        <motion.h2 
          className="font-serif text-4xl font-extrabold tracking-wide text-dark-forest mb-2"
          initial={{ opacity: 0, y: 15 }}
          animate={step >= 2 ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
        >
          Green Bridge
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
