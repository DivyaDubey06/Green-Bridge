const fs = require('fs');
const path = require('path');

const svgContent = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 160" width="200" height="160">
  <!-- Yellow Handles (Back) -->
  <path d="M 60 45 C 60 15, 140 15, 140 45" fill="none" stroke="#FBBF24" stroke-width="9" stroke-linecap="round" />
  
  <!-- Red Basket Main Body -->
  <path d="M 30 50 L 45 135 C 47 145, 153 145, 155 135 L 170 50 Z" fill="#DC2626" />
  
  <!-- Basket Top Rim -->
  <rect x="22" y="44" width="156" height="12" rx="6" fill="#EF4444" stroke="#B91C1C" stroke-width="2" />
  
  <!-- Basket Mesh Grid Openings (Vertical slots) -->
  <g fill="#991B1B">
    <rect x="52" y="66" width="8" height="55" rx="3" />
    <rect x="72" y="66" width="8" height="55" rx="3" />
    <rect x="92" y="66" width="8" height="55" rx="3" />
    <rect x="112" y="66" width="8" height="55" rx="3" />
    <rect x="132" y="66" width="8" height="55" rx="3" />
  </g>

  <!-- Horizontal Mesh Slots -->
  <g stroke="#B91C1C" stroke-width="2" opacity="0.6">
    <line x1="42" y1="80" x2="158" y2="80" />
    <line x1="44" y1="105" x2="156" y2="105" />
  </g>

  <!-- Yellow Handles (Front Lip Overlap) -->
  <path d="M 68 45 C 68 22, 132 22, 132 45" fill="none" stroke="#F59E0B" stroke-width="7" stroke-linecap="round" />
  <circle cx="68" cy="45" r="5" fill="#D97706" />
  <circle cx="132" cy="45" r="5" fill="#D97706" />

  <!-- Highlight overlay -->
  <path d="M 28 50 L 38 130" stroke="#FCA5A5" stroke-width="3" opacity="0.4" stroke-linecap="round" />
</svg>`;

const dir = path.join(__dirname, '../public/assets/cart');
if (!fs.existsSync(dir)) {
  fs.mkdirSync(dir, { recursive: true });
}

fs.writeFileSync(path.join(dir, 'basket.svg'), svgContent, 'utf8');
fs.writeFileSync(path.join(dir, 'basket.png'), svgContent, 'utf8');
console.log('✅ Generated red basket asset cleanly at frontend/public/assets/cart/basket.png');
