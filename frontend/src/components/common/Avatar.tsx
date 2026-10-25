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
      className={`relative inline-flex items-center justify-center rounded-full aspect-square overflow-hidden bg-soft-sky/40 border border-[#CD9777]/20 flex-shrink-0 ${onClick ? 'cursor-pointer hover:scale-105 transition-transform duration-200' : ''} ${className}`}
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

        {/* --- Background Hair Styles (Drawn behind the face) --- */}
        {hair === 'style-3' && (
          // style-3: Top Bun Circle (Brown)
          <circle cx="50" cy="22" r="10" fill="#8B4513" />
        )}
        {hair === 'style-5' && (
          // style-5: Open Long Wavy Female Hair Background (Orange-Brown)
          <path 
            d="M22 45C22 55 20 78 28 85C33 80 33 65 50 65C67 65 67 80 72 85C80 78 78 55 78 45C78 30 65 24 50 24C35 24 22 30 22 45Z" 
            fill="#D2691E" 
          />
        )}
        {hair === 'style-6' && (
          // style-6: Long Straight Open Female Hair Background (Dark Brown)
          <path 
            d="M23 45V85C23 87 27 88 30 86C32 80 34 62 50 62C66 62 68 80 70 86C73 88 77 87 77 85V45C77 28 65 24 50 24C35 24 23 28 23 45Z" 
            fill="#4A3B32" 
          />
        )}
        {hair === 'style-7' && (
          // style-7: Open Flowing Wavy surfer Male Hair Background (Chestnut/Golden)
          <path 
            d="M24 45C24 52 22 68 28 72C32 68 33 55 50 55C67 55 68 68 72 72C78 68 76 52 76 45C76 32 65 26 50 26C35 26 24 32 24 45Z" 
            fill="#CD7F32" 
          />
        )}

        {/* Face */}
        <circle cx="50" cy="50" r="23" fill={skin} />

        {/* --- Foreground Hair Styles (Drawn on top of the face) --- */}
        {hair === 'style-1' && (
          // Side Swept Long Hair (Dark Brown)
          <path 
            d="M27 46C27 30 40 24 53 24C66 24 74 32 74 48C74 58 70 65 67 65C62 65 62 55 58 50C54 45 42 42 36 50C31 56 27 56 27 46Z" 
            fill="#5C4033" 
          />
        )}
        {hair === 'style-2' && (
          // Wavy Short Curly Hair (Slate Green/Dark Curly)
          <path 
            d="M24 45C24 32 32 25 50 25C68 25 76 32 76 45C78 50 74 56 70 54C68 45 64 35 50 35C36 35 32 45 30 54C26 56 22 50 24 45Z" 
            fill="#2F4F4F" 
          />
        )}
        {hair === 'style-3' && (
          // Top Bun bangs
          <path 
            d="M25 48C25 32 35 27 50 27C65 27 75 32 75 48C75 52 70 54 65 50C60 46 60 37 50 37C40 37 40 46 35 50C30 54 25 52 25 48Z" 
            fill="#8B4513" 
          />
        )}
        {hair === 'style-4' && (
          // Spiky Active Cut (Silver/Gray)
          <path 
            d="M25 48C24 40 28 32 34 29L38 22L46 25L50 20L56 25L64 22L68 29C74 32 76 40 75 48C72 45 65 42 50 42C35 42 28 45 25 48Z" 
            fill="#C0C0C0" 
          />
        )}
        {hair === 'style-5' && (
          // style-5: Open Long Wavy Female Hair Front bangs
          <path 
            d="M25 45C25 30 35 24 50 24C65 24 75 30 75 45C73 42 65 37 50 37C35 37 27 42 25 45Z" 
            fill="#D2691E" 
          />
        )}
        {hair === 'style-6' && (
          // style-6: Long Straight Open Female Hair Front bangs
          <path 
            d="M25 45C25 28 35 24 50 24C65 24 75 28 75 45C72 40 64 36 50 36C36 36 28 40 25 45Z" 
            fill="#4A3B32" 
          />
        )}
        {hair === 'style-7' && (
          // style-7: Open Flowing Wavy surfer Male Hair Front bangs
          <path 
            d="M25 45C25 32 34 26 50 26C66 26 75 32 75 45C72 40 64 36 50 36C36 36 28 40 25 45Z" 
            fill="#CD7F32" 
          />
        )}
        {hair === 'style-8' && (
          // style-8: Classical Short cropped Male Hair Front bangs
          <path 
            d="M25 45C25 30 35 25 50 25C65 25 75 30 75 45C75 48 70 48 66 45C62 41 58 35 50 35C42 35 38 41 34 45C30 48 25 48 25 45Z" 
            fill="#1A1A1A" 
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
