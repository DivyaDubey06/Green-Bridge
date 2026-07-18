import React from 'react';

interface LogoProps {
  className?: string;
  size?: number;
  showText?: boolean;
}

export const Logo: React.FC<LogoProps> = ({ className = '', size = 40, showText = true }) => {
  return (
    <div className={`flex items-center gap-3 select-none ${className}`}>
      <svg 
        width={size} 
        height={size} 
        viewBox="0 0 100 100" 
        fill="none" 
        xmlns="http://www.w3.org/2000/svg"
        className="transform transition-transform hover:scale-105 duration-300"
      >
        {/* Sky Background */}
        <circle cx="50" cy="50" r="46" fill="#D8F3FF" opacity="0.4" />
        
        {/* River (Flowing Water) */}
        <path 
          d="M10 75C25 70 30 80 50 75C70 70 75 80 90 75C92 78 85 85 50 85C15 85 8 78 10 75Z" 
          fill="#4EA8DE" 
          opacity="0.8" 
        />
        <path 
          d="M15 78C25 75 35 81 50 78C65 75 75 81 85 78C82 82 50 84 15 82Z" 
          fill="#90E0EF" 
        />

        {/* Tree Left */}
        <path d="M22 62C12 62 10 40 22 36C18 25 32 18 36 28C44 26 46 42 36 48C42 54 32 62 22 62Z" fill="#2E7D32" />
        <path d="M22 60V74" stroke="#1B4332" strokeWidth="4" strokeLinecap="round" />
        <path d="M22 60L16 54" stroke="#1B4332" strokeWidth="2.5" strokeLinecap="round" />
        <path d="M22 64L26 59" stroke="#1B4332" strokeWidth="2" strokeLinecap="round" />

        {/* Tree Right */}
        <path d="M78 62C88 62 90 40 78 36C82 25 68 18 64 28C56 26 54 42 64 48C58 54 68 62 78 62Z" fill="#4CAF50" />
        <path d="M78 60V74" stroke="#1B4332" strokeWidth="4" strokeLinecap="round" />
        <path d="M78 60L72 54" stroke="#1B4332" strokeWidth="2.5" strokeLinecap="round" />
        <path d="M78 64L82 59" stroke="#1B4332" strokeWidth="2" strokeLinecap="round" />

        {/* Wooden Bridge */}
        {/* Bridge Pillars */}
        <path d="M24 58V72" stroke="#B07D62" strokeWidth="4" strokeLinecap="round" />
        <path d="M76 58V72" stroke="#B07D62" strokeWidth="4" strokeLinecap="round" />

        {/* Main Arch Base */}
        <path 
          d="M20 63C35 52 65 52 80 63" 
          stroke="#B07D62" 
          strokeWidth="6" 
          fill="none" 
          strokeLinecap="round" 
        />
        <path 
          d="M20 59C35 48 65 48 80 59" 
          stroke="#CD9777" 
          strokeWidth="4" 
          fill="none" 
          strokeLinecap="round" 
        />

        {/* Bridge Railing Spindles */}
        <path d="M30 55V61" stroke="#CD9777" strokeWidth="2.5" />
        <path d="M40 52V58" stroke="#CD9777" strokeWidth="2.5" />
        <path d="M50 51V57" stroke="#CD9777" strokeWidth="2.5" />
        <path d="M60 52V58" stroke="#CD9777" strokeWidth="2.5" />
        <path d="M70 55V61" stroke="#CD9777" strokeWidth="2.5" />

        {/* Handrail */}
        <path 
          d="M20 53C35 42 65 42 80 53" 
          stroke="#8A5A44" 
          strokeWidth="3.5" 
          fill="none" 
          strokeLinecap="round" 
        />
      </svg>
      {showText && (
        <div className="flex flex-col">
          <span className="font-serif font-bold text-2xl tracking-wide text-dark-forest leading-none">
            GreenBridge
          </span>
          <span className="text-[10px] tracking-widest text-primary-green uppercase font-semibold mt-0.5">
            Bring The Change
          </span>
        </div>
      )}
    </div>
  );
};
