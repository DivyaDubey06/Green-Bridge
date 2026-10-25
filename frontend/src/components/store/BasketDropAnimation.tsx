import React, { useEffect, useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Product } from '../../types';

export interface BasketDropTriggerData {
  id: string; // unique trigger key
  product: Product;
}

interface BasketDropAnimationProps {
  triggerData: BasketDropTriggerData | null;
  onArrival?: (product: Product) => void;
  onComplete?: () => void;
}

export const BasketDropAnimation: React.FC<BasketDropAnimationProps> = ({ 
  triggerData, 
  onArrival, 
  onComplete 
}) => {
  const [activeItem, setActiveItem] = useState<BasketDropTriggerData | null>(null);
  const [isReducedMotion, setIsReducedMotion] = useState(false);
  const [targetOffset, setTargetOffset] = useState({ x: 300, y: -300 });
  const arrivalFiredRef = useRef<boolean>(false);

  useEffect(() => {
    setIsReducedMotion(window.matchMedia('(prefers-reduced-motion: reduce)').matches);
  }, []);

  // Compute dynamic trajectory from viewport center to the top nav cart icon
  const calculateCartTargetOffset = () => {
    const cartTarget = document.getElementById('cart-icon-target') || document.getElementById('topbar-cart-icon-target');
    const viewportCenterX = window.innerWidth / 2;
    const viewportCenterY = window.innerHeight / 2;

    if (cartTarget) {
      const targetRect = cartTarget.getBoundingClientRect();
      const targetX = targetRect.left + targetRect.width / 2;
      const targetY = targetRect.top + targetRect.height / 2;
      setTargetOffset({
        x: targetX - viewportCenterX,
        y: targetY - viewportCenterY
      });
    } else {
      // Fallback trajectory toward top-right corner
      setTargetOffset({
        x: (window.innerWidth / 2) - 80,
        y: -(window.innerHeight / 2) + 40
      });
    }
  };

  useEffect(() => {
    if (triggerData) {
      arrivalFiredRef.current = false;
      setActiveItem(triggerData);

      // Compute vector from center once stage triggers
      requestAnimationFrame(() => {
        calculateCartTargetOffset();
      });

      // Arrival at cart icon at ~1.4s
      const arrivalTimer = setTimeout(() => {
        if (!arrivalFiredRef.current) {
          arrivalFiredRef.current = true;
          if (onArrival) onArrival(triggerData.product);
        }
      }, isReducedMotion ? 50 : 1400);

      // Animation lifecycle completion at ~1.8s
      const completeTimer = setTimeout(() => {
        setActiveItem(null);
        if (onComplete) onComplete();
      }, isReducedMotion ? 200 : 1800);

      return () => {
        clearTimeout(arrivalTimer);
        clearTimeout(completeTimer);
      };
    }
  }, [triggerData, isReducedMotion]);

  if (!activeItem) return null;

  // Reduced Motion Fallback: instant badge increment without basket
  if (isReducedMotion) {
    return (
      <AnimatePresence>
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0 }}
          className="fixed bottom-10 right-10 bg-[#0A3323] text-[#F7F4D5] px-4 py-2.5 rounded-full font-bold text-xs shadow-2xl z-50 flex items-center gap-2 pointer-events-none"
        >
          <span>🛒 Item added to GreenCart</span>
        </motion.div>
      </AnimatePresence>
    );
  }

  const { product } = activeItem;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 pointer-events-none z-50 select-none overflow-hidden flex items-center justify-center">
        {/* Light non-blocking dim behind basket */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.15 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.25 }}
          className="absolute inset-0 bg-black pointer-events-none"
        />

        {/* Stage Container centered in viewport */}
        <div className="relative w-52 h-64 flex items-center justify-center">
          <motion.div
            initial={{ scale: 0.3, opacity: 0 }}
            animate={[
              // 1. Pop in at the CENTER of the viewport with soft spring (~180-240px)
              { scale: 1, opacity: 1, x: 0, y: 0, transition: { type: 'spring', stiffness: 220, damping: 18, duration: 0.4 } },
              // 2. Subtle squash/settle bounce as thumbnail drops in (0.7s)
              { scale: [1, 1.08, 0.94, 1], y: [0, -6, 3, 0], transition: { delay: 0.7, duration: 0.35 } },
              // 3. SLIDES from center screen UP/TOWARD the cart icon in the top nav bar, shrinking and fading out
              { 
                scale: 0.12, 
                opacity: [1, 1, 0.6, 0], 
                x: targetOffset.x, 
                y: targetOffset.y, 
                transition: { delay: 1.05, duration: 0.45, ease: [0.4, 0, 0.2, 1] } 
              }
            ] as any}
            exit={{ opacity: 0 }}
            className="relative w-52 h-64 flex items-center justify-center"
          >
            {/* Red Shopping Basket Asset */}
            <div className="w-48 h-64 relative filter drop-shadow-2xl">
              <img
                src="/assets/cart/basket.png"
                alt="Shopping Basket"
                className="w-full h-full object-contain"
              />
            </div>

            {/* Shrunk Product Card Clone (Drops and settles directly inside the basket at center) */}
            <motion.div
              initial={{ 
                scale: 0.85, 
                opacity: 0, 
                y: -60, 
                rotate: -8 
              }}
              animate={{
                scale: [0.85, 0.65, 0.36, 0.36],
                opacity: [0, 1, 1, 1],
                y: [-60, -10, 0, 0],
                rotate: [-8, -3, 0, 0]
              }}
              transition={{
                duration: 0.75,
                ease: [0.34, 1.3, 0.64, 1], // Soft spring drop
                times: [0, 0.3, 0.7, 1]
              }}
              className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 bg-white rounded-2xl p-3 shadow-xl border border-black/10 pointer-events-none z-10 flex flex-col gap-1.5"
            >
              {/* Product Card Category Tag */}
              <div className="flex items-center justify-between">
                <span className="text-[9px] font-bold bg-[#839958]/20 text-[#0A3323] px-2 py-0.5 rounded-md">
                  {product.category || 'Eco Craft'}
                </span>
                <span className="text-[9px] font-bold text-[#105666]">
                  ₹{product.price}
                </span>
              </div>

              {/* Product Thumbnail Image */}
              <div className="w-full h-24 rounded-xl overflow-hidden bg-slate-100 border border-black/5">
                <img
                  src={product.images[0]}
                  alt={product.title}
                  className="w-full h-full object-cover"
                />
              </div>

              {/* Product Title */}
              <div className="text-[10px] font-bold text-[#0A3323] truncate leading-tight">
                {product.title}
              </div>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </AnimatePresence>
  );
};

export default BasketDropAnimation;
