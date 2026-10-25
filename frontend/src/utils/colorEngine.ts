/**
 * Color Pair Engine with Programmatic WCAG AA Contrast Safety Rule
 */

// Helper to convert hex to RGB
export function hexToRgb(hex: string): { r: number; g: number; b: number } {
  let cleanHex = hex.replace('#', '').trim();
  if (cleanHex.length === 3) {
    cleanHex = cleanHex.split('').map(c => c + c).join('');
  }
  const num = parseInt(cleanHex, 16);
  return {
    r: (num >> 16) & 255,
    g: (num >> 8) & 255,
    b: num & 255,
  };
}

// Helper to convert RGB to Hex
export function rgbToHex(r: number, g: number, b: number): string {
  const toHex = (n: number) => {
    const clamped = Math.max(0, Math.min(255, Math.round(n)));
    return clamped.toString(16).padStart(2, '0');
  };
  return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
}

// Calculate relative luminance per WCAG 2.1 specs
export function getLuminance(r: number, g: number, b: number): number {
  const [rs, gs, bs] = [r, g, b].map(v => {
    const s = v / 255;
    return s <= 0.03928 ? s / 12.92 : Math.pow((s + 0.055) / 1.055, 2.4);
  });
  return 0.2126 * rs + 0.7152 * gs + 0.0722 * bs;
}

// Calculate Contrast Ratio
export function getContrastRatio(hex1: string, hex2: string): number {
  const rgb1 = hexToRgb(hex1);
  const rgb2 = hexToRgb(hex2);
  const l1 = getLuminance(rgb1.r, rgb1.g, rgb1.b);
  const l2 = getLuminance(rgb2.r, rgb2.g, rgb2.b);
  const lighter = Math.max(l1, l2);
  const darker = Math.min(l1, l2);
  return (lighter + 0.05) / (darker + 0.05);
}

// Convert RGB to HSL
export function rgbToHsl(r: number, g: number, b: number): { h: number; s: number; l: number } {
  r /= 255; g /= 255; b /= 255;
  const max = Math.max(r, g, b), min = Math.min(r, g, b);
  let h = 0, s = 0;
  const l = (max + min) / 2;

  if (max !== min) {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case r: h = (g - b) / d + (g < b ? 6 : 0); break;
      case g: h = (b - r) / d + 2; break;
      case b: h = (r - g) / d + 4; break;
    }
    h /= 6;
  }
  return { h: h * 360, s: s * 100, l: l * 100 };
}

// Convert HSL to RGB
export function hslToRgb(h: number, s: number, l: number): { r: number; g: number; b: number } {
  h /= 360; s /= 100; l /= 100;
  let r: number, g: number, b: number;

  if (s === 0) {
    r = g = b = l;
  } else {
    const hue2rgb = (p: number, q: number, t: number) => {
      if (t < 0) t += 1;
      if (t > 1) t -= 1;
      if (t < 1/6) return p + (q - p) * 6 * t;
      if (t < 1/2) return q;
      if (t < 2/3) return p + (q - p) * (2/3 - t) * 6;
      return p;
    };
    const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
    const p = 2 * l - q;
    r = hue2rgb(p, q, h + 1/3);
    g = hue2rgb(p, q, h);
    b = hue2rgb(p, q, h - 1/3);
  }
  return { r: r * 255, g: g * 255, b: b * 255 };
}

/**
 * Contrast Safety Rule Helper:
 * Shifts ONLY the text color's lightness up or down the minimum amount needed
 * to achieve target contrast (4.5:1 for body text, 3.0:1 for large text).
 */
export function getAccessibleTextColor(
  bgHex: string,
  preferredTextHex: string,
  minContrast: number = 4.5,
  pairName: string = 'Pair'
): { color: string; ratio: number; adjusted: boolean; shiftAmount: number } {
  const currentRatio = getContrastRatio(bgHex, preferredTextHex);
  if (currentRatio >= minContrast) {
    return { color: preferredTextHex, ratio: currentRatio, adjusted: false, shiftAmount: 0 };
  }

  const bgRgb = hexToRgb(bgHex);
  const bgL = getLuminance(bgRgb.r, bgRgb.g, bgRgb.b);
  const textRgb = hexToRgb(preferredTextHex);
  const textL = getLuminance(textRgb.r, textRgb.g, textRgb.b);
  const hsl = rgbToHsl(textRgb.r, textRgb.g, textRgb.b);

  // Search outward for minimum lightness shift needed in either direction
  for (let delta = 1; delta <= 100; delta++) {
    const directions = textL < bgL ? [-delta, +delta] : [+delta, -delta];

    for (const d of directions) {
      const newL = hsl.l + d;
      if (newL >= 0 && newL <= 100) {
        const candidateRgb = hslToRgb(hsl.h, hsl.s, newL);
        const candidateHex = rgbToHex(candidateRgb.r, candidateRgb.g, candidateRgb.b);
        const candidateRatio = getContrastRatio(bgHex, candidateHex);

        if (candidateRatio >= minContrast) {
          const shift = Math.abs(d);
          console.log(`[Contrast Engine] ${pairName}: Adjusted text ${preferredTextHex} -> ${candidateHex} (Shift ${shift.toFixed(1)}% L) for ${candidateRatio.toFixed(2)}:1 ratio on bg ${bgHex}`);
          return { color: candidateHex, ratio: candidateRatio, adjusted: true, shiftAmount: shift };
        }
      }
    }
  }

  return { color: preferredTextHex, ratio: currentRatio, adjusted: false, shiftAmount: 0 };
}

// Raw Saturated Brand Accent Colors (for buttons, badges, icons, active indicators only)
export const RAW_BRAND_ACCENTS = {
  deep: '#0A3323',
  moss: '#839958',
  beige: '#F7F4D5',
  rose: '#D3968C',
  midnight: '#105666',
};

// Five Brand Pairs Definitions (Raw reference)
export interface ColorPairDefinition {
  bg: string;
  text: string;
  name: string;
}

export const RAW_BRAND_PAIRS: Record<'A' | 'B' | 'C' | 'D' | 'E', ColorPairDefinition> = {
  A: { name: 'Pair A (Deep Green)', bg: '#0A3323', text: '#839958' },
  B: { name: 'Pair B (Moss)', bg: '#839958', text: '#105666' },
  C: { name: 'Pair C (Beige)', bg: '#F7F4D5', text: '#839958' },
  D: { name: 'Pair D (Rose)', bg: '#D3968C', text: '#F7F4D5' },
  E: { name: 'Pair E (Midnight)', bg: '#105666', text: '#D3968C' },
};

/**
 * Tinted Surface Tier (Revision Pass 3)
 * Large full-bleed section backgrounds are tinted toward neutral bases:
 * - Light Mode: 15-20% brand color into #FBFAF6 with dark deep-green/midnight text
 * - Dark Mode: 20-30% brand color into #121212 with soft off-white #F3F1E7 text
 */
export interface TintedSurfacePair {
  name: string;
  lightBg: string;
  lightText: string;
  darkBg: string;
  darkText: string;
  accent: string;
}

export const TINTED_SURFACE_PAIRS: Record<'A' | 'B' | 'C' | 'D' | 'E', TintedSurfacePair> = {
  A: {
    name: 'Deep Green Tint (Hero)',
    lightBg: '#DEE2DD',
    lightText: '#0A3323',
    darkBg: '#101B17',
    darkText: '#F3F1E7',
    accent: '#0A3323',
  },
  B: {
    name: 'Moss Tint (How GreenBridge Works)',
    lightBg: '#E5E9DA',
    lightText: '#105666',
    darkBg: '#323826',
    darkText: '#F3F1E7',
    accent: '#839958',
  },
  C: {
    name: 'Beige Tint (Write Us a Letter)',
    lightBg: '#FAF9F0',
    lightText: '#0A3323',
    darkBg: '#525149',
    darkText: '#F3F1E7',
    accent: '#839958',
  },
  D: {
    name: 'Rose Tint (Campaigns & Donate)',
    lightBg: '#F4E8E3',
    lightText: '#0A3323',
    darkBg: '#483734',
    darkText: '#F3F1E7',
    accent: '#D3968C',
  },
  E: {
    name: 'Midnight Tint (Verified Organizations)',
    lightBg: '#D1DCDC',
    lightText: '#105666',
    darkBg: '#11252A',
    darkText: '#F3F1E7',
    accent: '#105666',
  },
};

// Compute Accessible Pair for Light and Dark Modes using the Tinted Surface Palette
export function getComputedPair(pairKey: 'A' | 'B' | 'C' | 'D' | 'E', isDark: boolean = false) {
  const tint = TINTED_SURFACE_PAIRS[pairKey];
  const bg = isDark ? tint.darkBg : tint.lightBg;
  const preferredText = isDark ? tint.darkText : tint.lightText;

  const accessibleText = getAccessibleTextColor(
    bg, 
    preferredText, 
    4.5, 
    `${tint.name} (${isDark ? 'Dark Mode' : 'Light Mode'})`
  );

  return {
    bg,
    text: accessibleText.color,
    rawBg: bg,
    rawText: preferredText,
    accent: tint.accent,
    ratio: accessibleText.ratio,
    adjusted: accessibleText.adjusted,
  };
}
