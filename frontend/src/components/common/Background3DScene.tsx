import React, { useRef, useEffect, useState } from 'react';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';
import { renderTabIcon, IconSetType } from './TabBackgroundIcons';

interface IconConfig {
  id: string;
  type: string;
  top: string;    // e.g. "15%"
  left: string;   // e.g. "10%"
  size: number;
  rotation: number;
  depth: 'near' | 'mid' | 'far';
  desktopOnly?: boolean; // if true, only shown on md+ screens
}

// Custom icon arrays for each tab (12-14 desktop, 5-6 mobile)
const TAB_ICON_LAYOUTS: Record<IconSetType, IconConfig[]> = {
  hero: [
    { id: 'h1', type: 'leaf', top: '12%', left: '8%', size: 44, rotation: -15, depth: 'near' },
    { id: 'h2', type: 'tree', top: '18%', left: '82%', size: 52, rotation: 12, depth: 'mid' },
    { id: 'h3', type: 'logo', top: '35%', left: '14%', size: 38, rotation: 25, depth: 'far' },
    { id: 'h4', type: 'leaf', top: '65%', left: '6%', size: 48, rotation: -30, depth: 'near' },
    { id: 'h5', type: 'tree', top: '75%', left: '86%', size: 46, rotation: 18, depth: 'near' },
    { id: 'h6', type: 'leaf', top: '82%', left: '25%', size: 36, rotation: 40, depth: 'mid' },
    // Desktop extra items
    { id: 'h7', type: 'logo', top: '10%', left: '48%', size: 34, rotation: -8, depth: 'far', desktopOnly: true },
    { id: 'h8', type: 'tree', top: '42%', left: '90%', size: 40, rotation: -20, depth: 'far', desktopOnly: true },
    { id: 'h9', type: 'leaf', top: '50%', left: '4%', size: 42, rotation: 15, depth: 'mid', desktopOnly: true },
    { id: 'h10', type: 'tree', top: '28%', left: '72%', size: 36, rotation: -12, depth: 'near', desktopOnly: true },
    { id: 'h11', type: 'leaf', top: '70%', left: '68%', size: 44, rotation: 22, depth: 'mid', desktopOnly: true },
    { id: 'h12', type: 'logo', top: '88%', left: '52%', size: 32, rotation: -5, depth: 'far', desktopOnly: true },
  ],
  opportunities: [
    { id: 'op1', type: 'helping_hands', top: '10%', left: '6%', size: 44, rotation: -10, depth: 'near' },
    { id: 'op2', type: 'handshake', top: '15%', left: '85%', size: 48, rotation: 15, depth: 'mid' },
    { id: 'op3', type: 'badge', top: '68%', left: '8%', size: 40, rotation: -20, depth: 'far' },
    { id: 'op4', type: 'sprout', top: '78%', left: '88%', size: 46, rotation: 25, depth: 'near' },
    { id: 'op5', type: 'helping_hands', top: '45%', left: '4%', size: 38, rotation: 12, depth: 'mid' },
    { id: 'op6', type: 'sprout', top: '85%', left: '40%', size: 42, rotation: -15, depth: 'near' },
    // Desktop extra items
    { id: 'op7', type: 'badge', top: '8%', left: '50%', size: 36, rotation: 18, depth: 'far', desktopOnly: true },
    { id: 'op8', type: 'handshake', top: '38%', left: '92%', size: 44, rotation: -8, depth: 'near', desktopOnly: true },
    { id: 'op9', type: 'sprout', top: '25%', left: '78%', size: 38, rotation: 30, depth: 'mid', desktopOnly: true },
    { id: 'op10', type: 'helping_hands', top: '62%', left: '76%', size: 40, rotation: -25, depth: 'far', desktopOnly: true },
    { id: 'op11', type: 'badge', top: '80%', left: '22%', size: 34, rotation: 8, depth: 'mid', desktopOnly: true },
    { id: 'op12', type: 'handshake', top: '30%', left: '12%', size: 42, rotation: -18, depth: 'far', desktopOnly: true },
  ],
  events: [
    { id: 'ev1', type: 'balloon', top: '12%', left: '7%', size: 46, rotation: -12, depth: 'near' },
    { id: 'ev2', type: 'calendar', top: '16%', left: '84%', size: 44, rotation: 10, depth: 'mid' },
    { id: 'ev3', type: 'confetti', top: '70%', left: '5%', size: 42, rotation: 25, depth: 'far' },
    { id: 'ev4', type: 'camera', top: '76%', left: '87%', size: 48, rotation: -15, depth: 'near' },
    { id: 'ev5', type: 'balloon', top: '42%', left: '89%', size: 40, rotation: 18, depth: 'mid' },
    { id: 'ev6', type: 'confetti', top: '84%', left: '35%', size: 38, rotation: -8, depth: 'near' },
    // Desktop extra items
    { id: 'ev7', type: 'calendar', top: '8%', left: '46%', size: 36, rotation: -20, depth: 'far', desktopOnly: true },
    { id: 'ev8', type: 'camera', top: '32%', left: '9%', size: 42, rotation: 14, depth: 'near', desktopOnly: true },
    { id: 'ev9', type: 'balloon', top: '55%', left: '3%', size: 46, rotation: -28, depth: 'mid', desktopOnly: true },
    { id: 'ev10', type: 'confetti', top: '28%', left: '74%', size: 40, rotation: 12, depth: 'far', desktopOnly: true },
    { id: 'ev11', type: 'calendar', top: '65%', left: '78%', size: 38, rotation: -16, depth: 'mid', desktopOnly: true },
    { id: 'ev12', type: 'camera', top: '88%', left: '60%', size: 44, rotation: 5, depth: 'far', desktopOnly: true },
  ],
  donate: [
    { id: 'dn1', type: 'heart', top: '10%', left: '8%', size: 46, rotation: -15, depth: 'near' },
    { id: 'dn2', type: 'gift', top: '15%', left: '83%', size: 50, rotation: 12, depth: 'mid' },
    { id: 'dn3', type: 'piggy', top: '65%', left: '7%', size: 42, rotation: -18, depth: 'far' },
    { id: 'dn4', type: 'bookstack', top: '75%', left: '86%', size: 44, rotation: 20, depth: 'near' },
    { id: 'dn5', type: 'heart', top: '40%', left: '5%', size: 40, rotation: 8, depth: 'mid' },
    { id: 'dn6', type: 'gift', top: '85%', left: '42%', size: 44, rotation: -10, depth: 'near' },
    // Desktop extra items
    { id: 'dn7', type: 'piggy', top: '6%', left: '52%', size: 36, rotation: 22, depth: 'far', desktopOnly: true },
    { id: 'dn8', type: 'bookstack', top: '35%', left: '91%', size: 42, rotation: -14, depth: 'near', desktopOnly: true },
    { id: 'dn9', type: 'heart', top: '52%', left: '80%', size: 46, rotation: 30, depth: 'mid', desktopOnly: true },
    { id: 'dn10', type: 'gift', top: '26%', left: '70%', size: 38, rotation: -8, depth: 'far', desktopOnly: true },
    { id: 'dn11', type: 'piggy', top: '68%', left: '65%', size: 40, rotation: 16, depth: 'mid', desktopOnly: true },
    { id: 'dn12', type: 'bookstack', top: '82%', left: '20%', size: 38, rotation: -25, depth: 'far', desktopOnly: true },
  ],
  about: [
    { id: 'ab1', type: 'book', top: '12%', left: '6%', size: 46, rotation: -10, depth: 'near' },
    { id: 'ab2', type: 'gradcap', top: '18%', left: '85%', size: 48, rotation: 15, depth: 'mid' },
    { id: 'ab3', type: 'globe', top: '68%', left: '8%', size: 44, rotation: -20, depth: 'far' },
    { id: 'ab4', type: 'seedling', top: '78%', left: '88%', size: 46, rotation: 25, depth: 'near' },
    { id: 'ab5', type: 'globe', top: '44%', left: '4%', size: 40, rotation: 12, depth: 'mid' },
    { id: 'ab6', type: 'book', top: '85%', left: '38%', size: 42, rotation: -12, depth: 'near' },
    // Desktop extra items
    { id: 'ab7', type: 'seedling', top: '8%', left: '48%', size: 36, rotation: 18, depth: 'far', desktopOnly: true },
    { id: 'ab8', type: 'gradcap', top: '36%', left: '92%', size: 44, rotation: -8, depth: 'near', desktopOnly: true },
    { id: 'ab9', type: 'book', top: '25%', left: '76%', size: 40, rotation: 30, depth: 'mid', desktopOnly: true },
    { id: 'ab10', type: 'globe', top: '62%', left: '74%', size: 38, rotation: -22, depth: 'far', desktopOnly: true },
    { id: 'ab11', type: 'seedling', top: '80%', left: '22%', size: 42, rotation: 10, depth: 'mid', desktopOnly: true },
    { id: 'ab12', type: 'gradcap', top: '30%', left: '12%', size: 40, rotation: -15, depth: 'far', desktopOnly: true },
  ],
  store: [
    { id: 'st1', type: 'gift', top: '12%', left: '7%', size: 46, rotation: -12, depth: 'near' },
    { id: 'st2', type: 'sprout', top: '16%', left: '84%', size: 48, rotation: 10, depth: 'mid' },
    { id: 'st3', type: 'piggy', top: '68%', left: '6%', size: 42, rotation: 22, depth: 'far' },
    { id: 'st4', type: 'heart', top: '76%', left: '87%', size: 46, rotation: -15, depth: 'near' },
    { id: 'st5', type: 'gift', top: '42%', left: '89%', size: 40, rotation: 18, depth: 'mid' },
    { id: 'st6', type: 'sprout', top: '84%', left: '35%', size: 42, rotation: -8, depth: 'near' },
    { id: 'st7', type: 'piggy', top: '8%', left: '46%', size: 36, rotation: -20, depth: 'far', desktopOnly: true },
    { id: 'st8', type: 'heart', top: '32%', left: '9%', size: 44, rotation: 14, depth: 'near', desktopOnly: true },
    { id: 'st9', type: 'gift', top: '55%', left: '3%', size: 46, rotation: -28, depth: 'mid', desktopOnly: true },
    { id: 'st10', type: 'sprout', top: '28%', left: '74%', size: 40, rotation: 12, depth: 'far', desktopOnly: true },
    { id: 'st11', type: 'piggy', top: '65%', left: '78%', size: 38, rotation: -16, depth: 'mid', desktopOnly: true },
    { id: 'st12', type: 'heart', top: '88%', left: '60%', size: 44, rotation: 5, depth: 'far', desktopOnly: true },
  ]
};

interface Background3DSceneProps {
  tab: IconSetType;
  children: React.ReactNode;
  className?: string;
}

export const Background3DScene: React.FC<Background3DSceneProps> = ({ tab, children, className = '' }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isDisabledMotion, setIsDisabledMotion] = useState(false);

  // Raw motion values for pointer position (-0.5 to 0.5)
  const rawX = useMotionValue(0);
  const rawY = useMotionValue(0);

  // Soft spring physics (stiffness ~100, damping ~20)
  const springX = useSpring(rawX, { stiffness: 100, damping: 20 });
  const springY = useSpring(rawY, { stiffness: 100, damping: 20 });

  // Transforms for section 3D tilt
  const rotateX = useTransform(springY, [-0.5, 0.5], [12, -12]);
  const rotateY = useTransform(springX, [-0.5, 0.5], [-12, 12]);

  useEffect(() => {
    // Check coarse pointer (touch) or prefers-reduced-motion
    const isTouch = window.matchMedia('(pointer: coarse)').matches;
    const isReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (isTouch || isReduced) {
      setIsDisabledMotion(true);
    }
  }, []);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (isDisabledMotion || !containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    rawX.set(x);
    rawY.set(y);
  };

  const handleMouseLeave = () => {
    if (isDisabledMotion) return;
    rawX.set(0);
    rawY.set(0);
  };

  const icons = TAB_ICON_LAYOUTS[tab] || TAB_ICON_LAYOUTS.hero;

  return (
    <div
      ref={containerRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className={`relative overflow-hidden ${className}`}
      style={{ perspective: 1100 }}
    >
      {/* 3D Parallax & Tilt Icon Container */}
      <motion.div
        className="absolute inset-0 pointer-events-none z-0"
        style={isDisabledMotion ? undefined : { rotateX, rotateY, transformStyle: 'preserve-3d' }}
      >
        {icons.map((icon) => (
          <SingleParallaxIcon
            key={icon.id}
            config={icon}
            springX={springX}
            springY={springY}
            isDisabledMotion={isDisabledMotion}
          />
        ))}
      </motion.div>

      {/* Main Content */}
      <div className="relative z-10">{children}</div>
    </div>
  );
};

// Sub-component for individual depth-layered icons with proximity lift
interface SingleIconProps {
  config: IconConfig;
  springX: any;
  springY: any;
  isDisabledMotion: boolean;
}

const SingleParallaxIcon: React.FC<SingleIconProps> = ({ config, springX, springY, isDisabledMotion }) => {
  // Depth multiplier: near moves more, far moves less
  const depthFactor = config.depth === 'near' ? 1.0 : config.depth === 'mid' ? 0.6 : 0.3;

  const translateX = useTransform(springX, [-0.5, 0.5], [-35 * depthFactor, 35 * depthFactor]);
  const translateY = useTransform(springY, [-0.5, 0.5], [-35 * depthFactor, 35 * depthFactor]);
  const iconRotate = useTransform(springX, [-0.5, 0.5], [config.rotation - 10 * depthFactor, config.rotation + 10 * depthFactor]);

  return (
    <motion.div
      className={`absolute select-none opacity-20 text-[#0A3323] dark:text-[#839958] ${
        config.desktopOnly ? 'hidden md:block' : 'block'
      }`}
      style={{
        top: config.top,
        left: config.left,
        x: isDisabledMotion ? 0 : translateX,
        y: isDisabledMotion ? 0 : translateY,
        rotate: isDisabledMotion ? config.rotation : iconRotate,
        transformStyle: 'preserve-3d',
        zIndex: config.depth === 'near' ? 3 : config.depth === 'mid' ? 2 : 1,
      }}
    >
      <motion.div
        whileHover={isDisabledMotion ? undefined : { scale: 1.25, z: 40, opacity: 0.45 }}
        transition={{ type: 'spring', stiffness: 300, damping: 15 }}
      >
        {renderTabIcon(config.type, config.size)}
      </motion.div>
    </motion.div>
  );
};
