import React from 'react';
import { getComputedPair } from '../../utils/colorEngine';

export type SurfaceTone = 
  | 'pairA' | 'pairB' | 'pairC' | 'pairD' | 'pairE'
  | 'deep' | 'midnight' | 'moss' | 'beige' | 'rose' | 'softRose';

interface SurfaceProps {
  tone: SurfaceTone;
  children: React.ReactNode;
  className?: string;
  as?: React.ElementType;
  id?: string;
}

// Map alias tone names to exact brand pairs
const TONE_TO_PAIR_KEY: Record<SurfaceTone, 'A' | 'B' | 'C' | 'D' | 'E'> = {
  pairA: 'A',
  deep: 'A',
  pairB: 'B',
  moss: 'B',
  pairC: 'C',
  beige: 'C',
  pairD: 'D',
  rose: 'D',
  softRose: 'D',
  pairE: 'E',
  midnight: 'E',
};

/**
 * Surface Component
 * Enforces approved brand pairs (A, B, C, D, E) with programmatic WCAG AA contrast auto-adjust
 * and role-swapping in dark mode.
 */
export const Surface: React.FC<SurfaceProps> = ({
  tone,
  children,
  className = '',
  as: Component = 'section',
  id,
}) => {
  const pairKey = TONE_TO_PAIR_KEY[tone] || 'A';
  
  // Compute accessible colors for light and dark modes
  const lightColors = getComputedPair(pairKey, false);
  const darkColors = getComputedPair(pairKey, true);

  return (
    <Component
      id={id}
      data-surface-tone={tone}
      className={`surface-block transition-colors duration-300 ${className}`}
      style={{
        backgroundColor: lightColors.bg,
        color: lightColors.text,
        ['--surface-bg' as any]: lightColors.bg,
        ['--surface-fg' as any]: lightColors.text,
      }}
    >
      {/* Dark mode override style injection */}
      <style>{`
        html.dark [data-surface-tone="${tone}"] {
          background-color: ${darkColors.bg} !important;
          color: ${darkColors.text} !important;
          --surface-bg: ${darkColors.bg};
          --surface-fg: ${darkColors.text};
        }
      `}</style>
      {children}
    </Component>
  );
};
