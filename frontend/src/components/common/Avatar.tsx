import React from 'react';
import { AvatarConfig } from '../../types';

interface AvatarProps {
  config: AvatarConfig;
  size?: number;
  className?: string;
  onClick?: () => void;
}

export const Avatar: React.FC<AvatarProps> = ({ config, size = 48, className = '', onClick }) => {
  const { hair, eyes, skin, clothing, accessory } = config;

  return (
    <div 
      className={`relative inline-block rounded-full bg-soft-sky/40 border border-[#CD9777]/20 flex-shrink-0 overflow-hidden ${onClick ? 'cursor-pointer hover:scale-105 transition-transform duration-200' : ''} ${className}`}
      style={{ width: size, height: size }}
      onClick={onClick}
    >
      <svg 
        viewBox="0 0 100 100" 
        width="100%" 
        height="100%" 
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Background Soft Circle */}
        <circle cx="50" cy="50" r="48" fill="#F0F8FF" />

        {/* Neck */}
        <rect x="44" y="65" width="12" height="15" fill={skin} rx="4" />
        <rect x="44" y="70" width="12" height="6" fill="#000" opacity="0.1" />

        {/* Shoulders & Clothing */}
        <path 
          d="M20 90C20 78 30 72 50 72C70 72 80 78 80 90V100H20V90Z" 
          fill={clothing} 
        />
        {/* V-neck collar */}
        <path d="M42 72L50 82L58 72" fill={skin} />

        {/* Face */}
        <circle cx="50" cy="50" r="23" fill={skin} />

        {/* Hair Styles */}
        {hair === 'style-1' && (
          // Side Swept Long Hair
          <path 
            d="M27 46C27 30 40 24 53 24C66 24 74 32 74 48C74 58 70 65 67 65C62 65 62 55 58 50C54 45 42 42 36 50C31 56 27 56 27 46Z" 
            fill="#5C4033" 
          />
        )}
        {hair === 'style-2' && (
          // Wavy Short Curly Hair
          <path 
            d="M24 45C24 32 32 25 50 25C68 25 76 32 76 45C78 50 74 56 70 54C68 45 64 35 50 35C36 35 32 45 30 54C26 56 22 50 24 45Z" 
            fill="#2F4F4F" 
          />
        )}
        {hair === 'style-3' && (
          // Top Bun / Bun Style
          <>
            <circle cx="50" cy="22" r="10" fill="#8B4513" />
            <path 
              d="M25 48C25 32 35 27 50 27C65 27 75 32 75 48C75 52 70 54 65 50C60 46 60 37 50 37C40 37 40 46 35 50C30 54 25 52 25 48Z" 
              fill="#8B4513" 
            />
          </>
        )}
        {hair === 'style-4' && (
          // Spiky Active Cut
          <path 
            d="M25 48C24 40 28 32 34 29L38 22L46 25L50 20L56 25L64 22L68 29C74 32 76 40 75 48C72 45 65 42 50 42C35 42 28 45 25 48Z" 
            fill="#C0C0C0" 
          />
        )}

        {/* Eyes Expressions */}
        {eyes === 'happy' && (
          <>
            <path d="M37 48C39 46 41 46 43 48" stroke="#1B4332" strokeWidth="2.5" strokeLinecap="round" fill="none" />
            <path d="M57 48C59 46 61 46 63 48" stroke="#1B4332" strokeWidth="2.5" strokeLinecap="round" fill="none" />
          </>
        )}
        {eyes === 'neutral' && (
          <>
            <circle cx="40" cy="49" r="2.5" fill="#1B4332" />
            <circle cx="60" cy="49" r="2.5" fill="#1B4332" />
          </>
        )}
        {eyes === 'sparkle' && (
          <>
            {/* Left sparkle */}
            <path d="M40 45L42 49L46 51L42 53L40 57L38 53L34 51L38 49Z" fill="#FBBF24" />
            {/* Right sparkle */}
            <path d="M60 45L62 49L66 51L62 53L60 57L58 53L54 51L58 49Z" fill="#FBBF24" />
          </>
        )}
        {eyes === 'glasses' && (
          <>
            <circle cx="40" cy="49" r="5" stroke="#1B4332" strokeWidth="2" fill="none" />
            <circle cx="60" cy="49" r="5" stroke="#1B4332" strokeWidth="2" fill="none" />
            <line x1="45" y1="49" x2="55" y2="49" stroke="#1B4332" strokeWidth="2" />
            <line x1="35" y1="49" x2="31" y2="45" stroke="#1B4332" strokeWidth="1.5" />
            <line x1="65" y1="49" x2="69" y2="45" stroke="#1B4332" strokeWidth="1.5" />
          </>
        )}

        {/* Blush & Smile */}
        <circle cx="33" cy="54" r="2.5" fill="#FFB6C1" opacity="0.6" />
        <circle cx="67" cy="54" r="2.5" fill="#FFB6C1" opacity="0.6" />
        <path d="M44 56C47 59 53 59 56 56" stroke="#1B4332" strokeWidth="2.5" strokeLinecap="round" fill="none" />

        {/* Accessories Overlay */}
        {accessory === 'cap' && (
          // Volunteer Cap
          <g>
            <path d="M26 36C26 24 38 18 50 18C62 18 74 24 74 36H26Z" fill="#2E7D32" />
            <path d="M20 36C35 32 65 32 80 36C83 36 85 39 80 40C72 41 28 41 20 40C15 39 17 36 20 36Z" fill="#1B4332" />
            <circle cx="50" cy="27" r="4" fill="#CD9777" />
          </g>
        )}
        {accessory === 'backpack' && (
          // Backpack straps peaking out on shoulders
          <g>
            <path d="M26 73L30 85" stroke="#8B4513" strokeWidth="4.5" strokeLinecap="round" />
            <path d="M74 73L70 85" stroke="#8B4513" strokeWidth="4.5" strokeLinecap="round" />
          </g>
        )}
        {accessory === 'plant-leaf' && (
          // Plant sprout growing from hair/head
          <g transform="translate(43, 8)">
            <path d="M7 14C7 8 2 5 2 5C2 5 8 1 12 7C14 10 11 15 7 14Z" fill="#4CAF50" />
            <path d="M7 14C7 8 12 5 12 5C12 5 6 1 2 7C0 10 3 15 7 14Z" fill="#81C784" />
            <path d="M7 14V20" stroke="#8B4513" strokeWidth="2" />
          </g>
        )}
        {accessory === 'tshirt-badge' && (
          // Tiny Bridge Logo badge on shirt
          <circle cx="68" cy="84" r="4.5" fill="#FBBF24" stroke="#FFF" strokeWidth="1" />
        )}
      </svg>
    </div>
  );
};
export default Avatar;
