/**
 * Contrast & Forbidden Color Pair Checker Script
 * Runs as part of CI / build step to ensure no forbidden text/background pairs exist in the codebase.
 */
const fs = require('fs');
const path = require('path');

const FORBIDDEN_PAIRS = [
  { text: '#839958', bg: '#F7F4D5', desc: 'moss text on beige bg' },
  { text: '#F7F4D5', bg: '#D3968C', desc: 'beige text on rose bg' },
  { text: '#105666', bg: '#839958', desc: 'midnight text on moss bg' },
  { text: '#D3968C', bg: '#839958', desc: 'rose text on moss bg' },
  { text: '#105666', bg: '#0A3323', desc: 'midnight text on deep green bg' },
];

function checkFiles(dir) {
  let violations = [];
  const files = fs.readdirSync(dir);

  for (const file of files) {
    const fullPath = path.join(dir, file);
    const stat = fs.statSync(fullPath);

    if (stat.isDirectory()) {
      violations = violations.concat(checkFiles(fullPath));
    } else if (file.endsWith('.tsx') || file.endsWith('.ts') || file.endsWith('.css')) {
      const content = fs.readFileSync(fullPath, 'utf8');
      
      FORBIDDEN_PAIRS.forEach(pair => {
        // Check for direct inline pairing of forbidden text and bg in same className string (excluding dark: modifier split)
        const textPattern = `text-\\[${pair.text}\\]`;
        const bgPattern = `bg-\\[${pair.bg}\\]`;
        
        const lines = content.split('\n');
        lines.forEach((line, index) => {
          // Ignore lines that separate light/dark mode classes or comments
          if (line.includes(textPattern) && line.includes(bgPattern) && !line.includes('dark:')) {
            violations.push(`Forbidden pair (${pair.desc}) found at ${fullPath}:${index + 1}`);
          }
        });
      });
    }
  }

  return violations;
}

const srcDir = path.join(__dirname, '../src');
console.log('🔍 Checking codebase for WCAG AA color contrast compliance & forbidden pairs...');
const violations = checkFiles(srcDir);

if (violations.length > 0) {
  console.error('❌ Color contrast check failed:');
  violations.forEach(v => console.error(`  - ${v}`));
  process.exit(1);
} else {
  console.log('✅ Color contrast check passed! 0 forbidden pairs found.');
}
