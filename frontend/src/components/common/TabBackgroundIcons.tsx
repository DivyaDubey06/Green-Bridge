import React from 'react';

export type IconSetType = 'hero' | 'opportunities' | 'events' | 'donate' | 'about' | 'store';

interface IconProps {
  className?: string;
  size?: number;
}

// Custom line-art SVGs matching existing leaf/tree stroke style (strokeWidth="1.5", soft curved strokes)

// HERO: Leaf, Tree, Logo Mark
export const LeafIcon: React.FC<IconProps> = ({ className, size = 36 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M11 20A9 9 0 0 1 2.5 11.5 9 9 0 0 1 11 3c5 0 9.5 3.5 10.5 8.5" />
    <path d="M11 3v17" />
    <path d="M11 8c3.5 0 6.5 2 7 5" />
    <path d="M11 13c-2.5 0-5 1.5-5.5 4" />
  </svg>
);

export const TreeIcon: React.FC<IconProps> = ({ className, size = 40 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M12 22v-6" />
    <path d="M12 16c-3.5 0-6-2.5-6-6 0-3 2-5 4-5.8C10.5 2.5 13.5 2.5 14 4.2 16 5 18 7 18 10c0 3.5-2.5 6-6 6z" />
    <path d="M8 12c.5-1.5 2-2.5 4-2.5" />
  </svg>
);

export const LogoMarkIcon: React.FC<IconProps> = ({ className, size = 36 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <circle cx="12" cy="12" r="9" strokeDasharray="3 2" />
    <path d="M8 14c2 2 6 2 8 0" />
    <path d="M9 10a1 1 0 1 0 0-2 1 1 0 0 0 0 2z" fill="currentColor" />
    <path d="M15 10a1 1 0 1 0 0-2 1 1 0 0 0 0 2z" fill="currentColor" />
  </svg>
);

// OPPORTUNITIES: Helping Hands, Handshake, Volunteer Badge, Sprout
export const HelpingHandsIcon: React.FC<IconProps> = ({ className, size = 38 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M18 11V6a2 2 0 0 0-4 0v5" />
    <path d="M14 10V4a2 2 0 0 0-4 0v6" />
    <path d="M10 10.5V5.5a1.5 1.5 0 0 0-3 0v6.5" />
    <path d="M7 11.5V10a1.5 1.5 0 0 0-3 0v6.5a6.5 6.5 0 0 0 13 0v-4a1.5 1.5 0 0 0-3 0" />
  </svg>
);

export const HandshakeIcon: React.FC<IconProps> = ({ className, size = 38 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="m11 17 2 2a2 2 0 0 0 2.8 0l2.8-2.8a2 2 0 0 0 0-2.8l-2.4-2.4" />
    <path d="m3 11 5 5a2 2 0 0 0 2.8 0l1.4-1.4" />
    <path d="M14 7 9.4 11.6a2 2 0 0 1-2.8 0L3 8" />
    <path d="M21 8l-4.5 4.5" />
  </svg>
);

export const VolunteerBadgeIcon: React.FC<IconProps> = ({ className, size = 36 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M12 2l7 4v6c0 5.5-3.8 10.2-7 11-3.2-.8-7-5.5-7-11V6l7-4z" />
    <path d="m12 8 1.5 3 3.5.5-2.5 2.5.6 3.5-3.1-1.6-3.1 1.6.6-3.5L7 11.5l3.5-.5L12 8z" />
  </svg>
);

export const SproutIcon: React.FC<IconProps> = ({ className, size = 36 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M7 20h10" />
    <path d="M12 20v-8" />
    <path d="M12 12c-4 0-7-3-7-7 4 0 7 3 7 7z" />
    <path d="M12 10c4 0 7-3 7-7-4 0-7 3-7 7z" />
  </svg>
);

// EVENTS: Balloon, Calendar, Confetti, Camera
export const BalloonIcon: React.FC<IconProps> = ({ className, size = 36 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M12 16c3.8 0 7-3.1 7-7S15.8 2 12 2 5 5.1 5 9s3.2 7 7 7z" />
    <path d="m12 16-1.5 2.5h3L12 16z" />
    <path d="M12 18.5c-.5 2-1.5 3.5-2.5 4.5" />
  </svg>
);

export const CalendarIcon: React.FC<IconProps> = ({ className, size = 36 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <rect x="3" y="4" width="18" height="17" rx="3" />
    <path d="M16 2v4" />
    <path d="M8 2v4" />
    <path d="M3 10h18" />
    <path d="M8 14h2v2H8z" fill="currentColor" opacity="0.4" />
    <path d="M14 14h2v2h-2z" fill="currentColor" opacity="0.4" />
  </svg>
);

export const ConfettiIcon: React.FC<IconProps> = ({ className, size = 36 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="m4 20 5-5" />
    <path d="m2 14 3-1" />
    <path d="m11 21-1-3" />
    <circle cx="15" cy="5" r="1.5" />
    <rect x="18" y="10" width="3" height="3" rx="0.5" />
    <path d="m13 11 3-3" />
    <path d="m8 6 3 2" />
  </svg>
);

export const CameraIcon: React.FC<IconProps> = ({ className, size = 36 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M14.5 4h-5L8 7H4a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-4l-1.5-3z" />
    <circle cx="12" cy="14" r="4" />
  </svg>
);

// DONATE: Heart, Gift Box, Coin/Piggy Bank, Book Stack
export const HeartIcon: React.FC<IconProps> = ({ className, size = 36 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M19.5 12.57 12 20l-7.5-7.43A5 5 0 1 1 12 5.86a5 5 0 0 1 7.5 6.71z" />
  </svg>
);

export const GiftBoxIcon: React.FC<IconProps> = ({ className, size = 36 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <rect x="3" y="8" width="18" height="4" rx="1" />
    <path d="M12 8v13" />
    <path d="M19 12v7a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2v-7" />
    <path d="M7.5 8a2.5 2.5 0 0 1 0-5C10 3 12 8 12 8s2-5 4.5-5a2.5 2.5 0 0 1 0 5" />
  </svg>
);

export const PiggyBankIcon: React.FC<IconProps> = ({ className, size = 36 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M19 13c.7 0 1.6-.2 2-.8V9c0-1.7-1.3-3-3-3h-1c-.5-1.5-2-2.5-3.8-2.5C11 3.5 9 5 8.5 7A6.5 6.5 0 0 0 2 13.5C2 17 5 19 8.5 19v2a1 1 0 0 0 1 1h2a1 1 0 0 0 1-1v-2h3v2a1 1 0 0 0 1 1h2a1 1 0 0 0 1-1v-2.2c1.4-.7 2.3-2 2.5-3.8z" />
    <circle cx="15" cy="9" r="1" fill="currentColor" />
  </svg>
);

export const BookStackIcon: React.FC<IconProps> = ({ className, size = 36 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1-2.5-2.5z" />
    <path d="M6 6h10" />
    <path d="M6 10h10" />
    <path d="M4 15h16" />
  </svg>
);

// ABOUT: Book, Graduation Cap, Globe, Seedling
export const BookIcon: React.FC<IconProps> = ({ className, size = 36 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" />
    <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" />
  </svg>
);

export const GradCapIcon: React.FC<IconProps> = ({ className, size = 36 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M22 10L12 4 2 10l10 6 10-6z" />
    <path d="M6 12.5V17c0 2 3 3.5 6 3.5s6-1.5 6-3.5v-4.5" />
    <path d="M22 10v6" />
  </svg>
);

export const GlobeIcon: React.FC<IconProps> = ({ className, size = 36 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <circle cx="12" cy="12" r="10" />
    <path d="M2 12h20" />
    <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
  </svg>
);

export const SeedlingIcon: React.FC<IconProps> = ({ className, size = 36 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M12 22V10" />
    <path d="M12 10C8 10 4 7 4 3c5 0 8 3 8 7z" />
    <path d="M12 14c4 0 7-3 7-7-5 0-7 3-7 7z" />
  </svg>
);

// Map icon types to icon components
export const renderTabIcon = (type: string, size: number = 36, className: string = '') => {
  switch (type) {
    // Hero
    case 'leaf': return <LeafIcon size={size} className={className} />;
    case 'tree': return <TreeIcon size={size} className={className} />;
    case 'logo': return <LogoMarkIcon size={size} className={className} />;

    // Opportunities
    case 'helping_hands': return <HelpingHandsIcon size={size} className={className} />;
    case 'handshake': return <HandshakeIcon size={size} className={className} />;
    case 'badge': return <VolunteerBadgeIcon size={size} className={className} />;
    case 'sprout': return <SproutIcon size={size} className={className} />;

    // Events
    case 'balloon': return <BalloonIcon size={size} className={className} />;
    case 'calendar': return <CalendarIcon size={size} className={className} />;
    case 'confetti': return <ConfettiIcon size={size} className={className} />;
    case 'camera': return <CameraIcon size={size} className={className} />;

    // Donate
    case 'heart': return <HeartIcon size={size} className={className} />;
    case 'gift': return <GiftBoxIcon size={size} className={className} />;
    case 'piggy': return <PiggyBankIcon size={size} className={className} />;
    case 'bookstack': return <BookStackIcon size={size} className={className} />;

    // About
    case 'book': return <BookIcon size={size} className={className} />;
    case 'gradcap': return <GradCapIcon size={size} className={className} />;
    case 'globe': return <GlobeIcon size={size} className={className} />;
    case 'seedling': return <SeedlingIcon size={size} className={className} />;

    default: return <LeafIcon size={size} className={className} />;
  }
};
