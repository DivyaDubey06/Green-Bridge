import React from 'react';

interface ImpactTreeProps {
  level: number;
}

export const ImpactTree: React.FC<ImpactTreeProps> = ({ level }) => {
  // Determine state parameters based on level
  const isSeedling = level === 1;
  const isSmallPlant = level === 2;
  const isYoungTree = level >= 3 && level <= 4;
  const isLargeTree = level >= 5 && level <= 6;
  const isFlowering = level >= 7;
  const isFullEcosystem = level >= 9;

  return (
    <div className="relative w-full aspect-square max-w-[280px] mx-auto bg-soft-sky/20 border border-[#CD9777]/15 rounded-[40px] flex items-center justify-center p-6 shadow-sm overflow-hidden">
      <svg 
        viewBox="0 0 100 100" 
        width="100%" 
        height="100%" 
        xmlns="http://www.w3.org/2000/svg"
        className="animate-sway"
      >
        {/* Soft background glow */}
        <circle cx="50" cy="50" r="42" fill="#E6F4EA" opacity="0.6" />

        {/* Soil Base / Ground */}
        <path d="M15 82C30 78 70 78 85 82V90H15V82Z" fill="#DDB892" />
        <path d="M15 82C30 80 70 80 85 82" stroke="#795548" strokeWidth="2" fill="none" />
        <path d="M22 81C30 80 40 81 48 81C60 81 72 80 78 81" stroke="#81C784" strokeWidth="3" fill="none" strokeLinecap="round" />

        {/* Level 1: Seedling */}
        {isSeedling && (
          <g>
            {/* Sprout stem */}
            <path d="M50 80C50 74 48 70 46 66" stroke="#4CAF50" strokeWidth="3.5" fill="none" strokeLinecap="round" />
            {/* Seed shell */}
            <circle cx="50" cy="79" r="2.5" fill="#795548" />
            {/* Tiny leaves */}
            <path d="M46 66C44 66 38 64 38 62C38 60 44 62 46 66Z" fill="#4CAF50" />
            <path d="M46 66C48 66 54 64 54 62C54 60 48 62 46 66Z" fill="#81C784" />
          </g>
        )}

        {/* Level 2: Small Plant */}
        {isSmallPlant && (
          <g>
            {/* Plant stem */}
            <path d="M50 80C50 70 53 62 48 52" stroke="#4CAF50" strokeWidth="4.5" fill="none" strokeLinecap="round" />
            {/* Branch 1 */}
            <path d="M51 68C44 66 40 60 38 56" stroke="#4CAF50" strokeWidth="3" fill="none" strokeLinecap="round" />
            {/* Leaves */}
            <path d="M38 56C35 56 31 52 33 48C35 48 37 53 38 56Z" fill="#2E7D32" />
            <path d="M48 52C48 46 43 42 45 38C47 38 48 44 48 52Z" fill="#4CAF50" />
            <path d="M48 52C52 48 58 48 60 44C60 47 55 50 48 52Z" fill="#81C784" />
          </g>
        )}

        {/* Level 3-4: Young Tree */}
        {isYoungTree && (
          <g>
            {/* Wooden trunk */}
            <path d="M50 80C50 68 47 62 48 50" stroke="#8B4513" strokeWidth="6" fill="none" strokeLinecap="round" />
            {/* Side branches */}
            <path d="M49 68C42 66 38 58 35 54" stroke="#8B4513" strokeWidth="4" fill="none" strokeLinecap="round" />
            <path d="M49 62C55 58 62 56 64 50" stroke="#8B4513" strokeWidth="4" fill="none" strokeLinecap="round" />
            {/* Leafy canopy packs */}
            <circle cx="48" cy="42" r="10" fill="#2E7D32" />
            <circle cx="34" cy="50" r="8" fill="#4CAF50" />
            <circle cx="64" cy="46" r="9" fill="#81C784" />
          </g>
        )}

        {/* Level 5-6: Mature Tree */}
        {isLargeTree && (
          <g>
            {/* Strong trunk */}
            <path d="M50 80C50 64 45 56 46 42" stroke="#8B4513" strokeWidth="8" fill="none" strokeLinecap="round" />
            <path d="M49 64C40 60 35 52 30 46" stroke="#8B4513" strokeWidth="5.5" fill="none" strokeLinecap="round" />
            <path d="M48 58C58 54 66 50 72 40" stroke="#8B4513" strokeWidth="5.5" fill="none" strokeLinecap="round" />
            {/* Dense leafy cloud */}
            <path d="M46 42C36 42 30 32 40 25C42 16 58 16 62 25C72 26 72 38 62 42H46Z" fill="#2E7D32" />
            <circle cx="28" cy="44" r="11" fill="#4CAF50" />
            <circle cx="70" cy="38" r="12" fill="#81C784" />
            <circle cx="50" cy="24" r="12" fill="#2E7D32" />
          </g>
        )}

        {/* Level 7-10: Flowering & Complete Ecosystem */}
        {(isFlowering || isFullEcosystem) && (
          <g>
            {/* Tree Base */}
            <path d="M50 80C50 62 44 52 46 38" stroke="#8B4513" strokeWidth="9" fill="none" strokeLinecap="round" />
            <path d="M49 62C38 58 32 48 26 40" stroke="#8B4513" strokeWidth="6" fill="none" strokeLinecap="round" />
            <path d="M48 55C58 50 68 44 74 34" stroke="#8B4513" strokeWidth="6" fill="none" strokeLinecap="round" />

            {/* Dense Leaves */}
            <circle cx="46" cy="34" r="14" fill="#1B4332" />
            <circle cx="24" cy="38" r="12" fill="#2E7D32" />
            <circle cx="72" cy="32" r="13" fill="#4CAF50" />
            <circle cx="58" cy="22" r="14" fill="#2E7D32" />
            <circle cx="34" cy="22" r="12" fill="#4CAF50" />

            {/* Red / Pink Flowers */}
            <circle cx="22" cy="34" r="2.5" fill="#E63946" />
            <circle cx="26" cy="42" r="2.5" fill="#E63946" />
            <circle cx="40" cy="30" r="3" fill="#FFB703" />
            <circle cx="52" cy="22" r="2.5" fill="#E63946" />
            <circle cx="62" cy="26" r="3.5" fill="#FFB703" />
            <circle cx="70" cy="36" r="2.5" fill="#E63946" />
            <circle cx="74" cy="28" r="3" fill="#FFB703" />
            
            {/* Flowers on the ground */}
            <g transform="translate(18, 77)">
              <ellipse cx="5" cy="5" rx="3" ry="1.5" fill="#E63946" />
              <ellipse cx="25" cy="5" rx="2" ry="1" fill="#FFB703" />
            </g>

            {/* Butterflies (Level 9-10) */}
            {level >= 8 && (
              <g className="animate-float">
                {/* Yellow Butterfly left */}
                <path d="M15 25C13 23 11 25 12 28C13 30 16 28 15 25Z" fill="#FBBF24" />
                <path d="M10 26C11 28 13 29 13 27C13 25 11 24 10 26Z" fill="#FBBF24" />
                
                {/* Orange Butterfly right */}
                <path d="M82 20C83 18 85 20 84 23C83 25 80 23 82 20Z" fill="#E67E22" />
                <path d="M87 21C86 23 84 24 84 22C84 20 86 19 87 21Z" fill="#E67E22" />
              </g>
            )}

            {/* Complete Ecosystem: Birds & Bridge (Level 9-10) */}
            {isFullEcosystem && (
              <g>
                {/* Flying Bird in the sky */}
                <path 
                  d="M18 14C20 12 23 15 26 13C24 15 21 16 18 14Z" 
                  fill="#1D3557" 
                  className="animate-float-delayed" 
                />
                <path 
                  d="M74 12C76 10 79 13 82 11C80 13 77 14 74 12Z" 
                  fill="#1D3557" 
                  className="animate-float" 
                />

                {/* Small Wooden Bridge at the bottom of the tree */}
                <g transform="translate(0, 3)">
                  <path d="M28 77C38 72 62 72 72 77" stroke="#8A5A44" strokeWidth="3" fill="none" strokeLinecap="round" />
                  <path d="M28 73C38 68 62 68 72 73" stroke="#B07D62" strokeWidth="2.5" fill="none" strokeLinecap="round" />
                  {/* Bridge supports */}
                  <line x1="36" y1="73" x2="36" y2="78" stroke="#8B4513" strokeWidth="1.5" />
                  <line x1="45" y1="71" x2="45" y2="78" stroke="#8B4513" strokeWidth="1.5" />
                  <line x1="55" y1="71" x2="55" y2="78" stroke="#8B4513" strokeWidth="1.5" />
                  <line x1="64" y1="73" x2="64" y2="78" stroke="#8B4513" strokeWidth="1.5" />
                </g>
              </g>
            )}
          </g>
        )}
      </svg>
      
      {/* Decorative Floating Leaves */}
      <span className="absolute top-2 left-4 text-xs select-none pointer-events-none opacity-20">🍃</span>
      <span className="absolute bottom-6 right-6 text-sm select-none pointer-events-none opacity-25">🌱</span>
      <span className="absolute top-8 right-4 text-sm select-none pointer-events-none opacity-15">🌸</span>
    </div>
  );
};
export default ImpactTree;
