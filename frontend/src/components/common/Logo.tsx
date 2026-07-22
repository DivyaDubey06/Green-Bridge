import React from 'react';

interface LogoProps {
  className?: string;
  size?: number;
  showText?: boolean;
}

export const Logo: React.FC<LogoProps> = ({ className = '', size = 40, showText = true }) => {
  return (
    <div className={`flex items-center gap-3 select-none ${className}`}>
      <img 
        src="/assets/illustrations/bridge_hero.png" 
        alt="Green Bridge Logo" 
        width={size} 
        height={size}
        className="object-contain transform transition-transform hover:scale-105 duration-300"
      />
      {showText && (
        <div className="flex flex-col">
          <span className="font-serif font-bold text-2xl tracking-wide text-dark-forest dark:text-[#A7F3D0] leading-none">
            Green Bridge
          </span>
          <span className="text-[10px] tracking-widest text-primary-green dark:text-[#A7F3D0]/70 uppercase font-semibold mt-0.5">
            Bring The Change
          </span>
        </div>
      )}
    </div>
  );
};
