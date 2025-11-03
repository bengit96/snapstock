const fs = require('fs');
const path = require('path');

// Create SVG templates for social media images
function createOGImage() {
  const svg = `<svg width="1200" height="630" viewBox="0 0 1200 630" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="bgGradient" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" style="stop-color:#faf5ff;stop-opacity:1" />
        <stop offset="50%" style="stop-color:#fdf2f8;stop-opacity:1" />
        <stop offset="100%" style="stop-color:#eff6ff;stop-opacity:1" />
      </linearGradient>
      <linearGradient id="textGradient" x1="0%" y1="0%" x2="100%" y2="0%">
        <stop offset="0%" style="stop-color:#9333ea;stop-opacity:1" />
        <stop offset="100%" style="stop-color:#ec4899;stop-opacity:1" />
      </linearGradient>
    </defs>

    <!-- Background -->
    <rect width="1200" height="630" fill="url(#bgGradient)"/>

    <!-- Grid pattern -->
    <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
      <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#e5e7eb" stroke-width="0.5" opacity="0.3"/>
    </pattern>
    <rect width="1200" height="630" fill="url(#grid)"/>

    <!-- Content -->
    <g transform="translate(600, 200)">
      <!-- Logo/Icon -->
      <circle cx="0" cy="-80" r="40" fill="#9333ea" opacity="0.1"/>
      <circle cx="0" cy="-80" r="30" fill="none" stroke="#9333ea" stroke-width="2"/>
      <circle cx="0" cy="-80" r="20" fill="none" stroke="#9333ea" stroke-width="1.5" opacity="0.3"/>

      <!-- Candlestick elements -->
      <rect x="-8" y="-60" width="4" height="15" fill="#10b981" rx="0.5"/>
      <line x1="-6" y1="-75" x2="-6" y2="-60" stroke="#10b981" stroke-width="1.5"/>
      <line x1="-6" y1="-45" x2="-6" y2="-35" stroke="#10b981" stroke-width="1.5"/>

      <rect x="4" y="-70" width="4" height="20" fill="#10b981" rx="0.5"/>
      <line x1="6" y1="-85" x2="6" y2="-70" stroke="#10b981" stroke-width="1.5"/>
      <line x1="6" y1="-50" x2="6" y2="-40" stroke="#10b981" stroke-width="1.5"/>

      <!-- Lightning bolt -->
      <path d="M 15 -85 L 10 -70 L 15 -70 L 12 -55 Z" fill="#fbbf24" stroke="#f59e0b" stroke-width="0.5"/>
    </g>

    <!-- Title -->
    <text x="600" y="320" text-anchor="middle" font-family="system-ui, -apple-system, sans-serif" font-size="48" font-weight="700" fill="#111827">
      Trade with Confidence using
    </text>
    <text x="600" y="380" text-anchor="middle" font-family="system-ui, -apple-system, sans-serif" font-size="48" font-weight="700" fill="url(#textGradient)">
      AI-Powered Analysis
    </text>

    <!-- Subtitle -->
    <text x="600" y="430" text-anchor="middle" font-family="system-ui, -apple-system, sans-serif" font-size="24" fill="#6b7280">
      SnapPChart is built for momentum traders targeting low float,
    </text>
    <text x="600" y="460" text-anchor="middle" font-family="system-ui, -apple-system, sans-serif" font-size="24" fill="#6b7280">
      fast-moving stocks. Get instant AI analysis from chart to trade.
    </text>

    <!-- Stats -->
    <g transform="translate(600, 520)">
      <g transform="translate(-300, 0)">
        <circle cx="0" cy="0" r="25" fill="#9333ea" opacity="0.1"/>
        <text x="0" y="8" text-anchor="middle" font-family="system-ui, -apple-system, sans-serif" font-size="20" font-weight="700" fill="#111827">AI</text>
        <text x="0" y="28" text-anchor="middle" font-family="system-ui, -apple-system, sans-serif" font-size="12" fill="#6b7280">Powered</text>
      </g>
      <g transform="translate(-100, 0)">
        <circle cx="0" cy="0" r="25" fill="#10b981" opacity="0.1"/>
        <text x="0" y="8" text-anchor="middle" font-family="system-ui, -apple-system, sans-serif" font-size="20" font-weight="700" fill="#111827">Fast</text>
        <text x="0" y="28" text-anchor="middle" font-family="system-ui, -apple-system, sans-serif" font-size="12" fill="#6b7280">Analysis</text>
      </g>
      <g transform="translate(100, 0)">
        <circle cx="0" cy="0" r="25" fill="#ec4899" opacity="0.1"/>
        <text x="0" y="8" text-anchor="middle" font-family="system-ui, -apple-system, sans-serif" font-size="20" font-weight="700" fill="#111827">Smart</text>
        <text x="0" y="28" text-anchor="middle" font-family="system-ui, -apple-system, sans-serif" font-size="12" fill="#6b7280">Insights</text>
      </g>
      <g transform="translate(300, 0)">
        <circle cx="0" cy="0" r="25" fill="#3b82f6" opacity="0.1"/>
        <text x="0" y="8" text-anchor="middle" font-family="system-ui, -apple-system, sans-serif" font-size="20" font-weight="700" fill="#111827">24/7</text>
        <text x="0" y="28" text-anchor="middle" font-family="system-ui, -apple-system, sans-serif" font-size="12" fill="#6b7280">Available</text>
      </g>
    </g>

    <!-- URL -->
    <text x="600" y="600" text-anchor="middle" font-family="system-ui, -apple-system, sans-serif" font-size="16" fill="#9ca3af">
      snappchart.app
    </text>
  </svg>`;

  return svg;
}

function createTwitterImage() {
  const svg = `<svg width="1200" height="600" viewBox="0 0 1200 600" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="bgGradient" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" style="stop-color:#faf5ff;stop-opacity:1" />
        <stop offset="50%" style="stop-color:#fdf2f8;stop-opacity:1" />
        <stop offset="100%" style="stop-color:#eff6ff;stop-opacity:1" />
      </linearGradient>
      <linearGradient id="textGradient" x1="0%" y1="0%" x2="100%" y2="0%">
        <stop offset="0%" style="stop-color:#9333ea;stop-opacity:1" />
        <stop offset="100%" style="stop-color:#ec4899;stop-opacity:1" />
      </linearGradient>
    </defs>

    <!-- Background -->
    <rect width="1200" height="600" fill="url(#bgGradient)"/>

    <!-- Grid pattern -->
    <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
      <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#e5e7eb" stroke-width="0.5" opacity="0.3"/>
    </pattern>
    <rect width="1200" height="600" fill="url(#grid)"/>

    <!-- Content -->
    <g transform="translate(600, 180)">
      <!-- Logo/Icon -->
      <circle cx="0" cy="-80" r="40" fill="#9333ea" opacity="0.1"/>
      <circle cx="0" cy="-80" r="30" fill="none" stroke="#9333ea" stroke-width="2"/>
      <circle cx="0" cy="-80" r="20" fill="none" stroke="#9333ea" stroke-width="1.5" opacity="0.3"/>

      <!-- Candlestick elements -->
      <rect x="-8" y="-60" width="4" height="15" fill="#10b981" rx="0.5"/>
      <line x1="-6" y1="-75" x2="-6" y2="-60" stroke="#10b981" stroke-width="1.5"/>
      <line x1="-6" y1="-45" x2="-6" y2="-35" stroke="#10b981" stroke-width="1.5"/>

      <rect x="4" y="-70" width="4" height="20" fill="#10b981" rx="0.5"/>
      <line x1="6" y1="-85" x2="6" y2="-70" stroke="#10b981" stroke-width="1.5"/>
      <line x1="6" y1="-50" x2="6" y2="-40" stroke="#10b981" stroke-width="1.5"/>

      <!-- Lightning bolt -->
      <path d="M 15 -85 L 10 -70 L 15 -70 L 12 -55 Z" fill="#fbbf24" stroke="#f59e0b" stroke-width="0.5"/>
    </g>

    <!-- Title -->
    <text x="600" y="300" text-anchor="middle" font-family="system-ui, -apple-system, sans-serif" font-size="44" font-weight="700" fill="#111827">
      Trade with Confidence using
    </text>
    <text x="600" y="350" text-anchor="middle" font-family="system-ui, -apple-system, sans-serif" font-size="44" font-weight="700" fill="url(#textGradient)">
      AI-Powered Analysis
    </text>

    <!-- Subtitle -->
    <text x="600" y="390" text-anchor="middle" font-family="system-ui, -apple-system, sans-serif" font-size="22" fill="#6b7280">
      SnapPChart • Momentum Trading Analysis Tool
    </text>
    <text x="600" y="420" text-anchor="middle" font-family="system-ui, -apple-system, sans-serif" font-size="22" fill="#6b7280">
      Get instant AI analysis from chart screenshot to trade recommendations
    </text>

    <!-- Stats -->
    <g transform="translate(600, 480)">
      <g transform="translate(-250, 0)">
        <circle cx="0" cy="0" r="22" fill="#9333ea" opacity="0.1"/>
        <text x="0" y="7" text-anchor="middle" font-family="system-ui, -apple-system, sans-serif" font-size="18" font-weight="700" fill="#111827">AI</text>
        <text x="0" y="25" text-anchor="middle" font-family="system-ui, -apple-system, sans-serif" font-size="11" fill="#6b7280">Powered</text>
      </g>
      <g transform="translate(-80, 0)">
        <circle cx="0" cy="0" r="22" fill="#10b981" opacity="0.1"/>
        <text x="0" y="7" text-anchor="middle" font-family="system-ui, -apple-system, sans-serif" font-size="18" font-weight="700" fill="#111827">Fast</text>
        <text x="0" y="25" text-anchor="middle" font-family="system-ui, -apple-system, sans-serif" font-size="11" fill="#6b7280">Analysis</text>
      </g>
      <g transform="translate(80, 0)">
        <circle cx="0" cy="0" r="22" fill="#ec4899" opacity="0.1"/>
        <text x="0" y="7" text-anchor="middle" font-family="system-ui, -apple-system, sans-serif" font-size="18" font-weight="700" fill="#111827">Smart</text>
        <text x="0" y="25" text-anchor="middle" font-family="system-ui, -apple-system, sans-serif" font-size="11" fill="#6b7280">Insights</text>
      </g>
      <g transform="translate(250, 0)">
        <circle cx="0" cy="0" r="22" fill="#3b82f6" opacity="0.1"/>
        <text x="0" y="7" text-anchor="middle" font-family="system-ui, -apple-system, sans-serif" font-size="18" font-weight="700" fill="#111827">24/7</text>
        <text x="0" y="25" text-anchor="middle" font-family="system-ui, -apple-system, sans-serif" font-size="11" fill="#6b7280">Available</text>
      </g>
    </g>

    <!-- URL -->
    <text x="600" y="570" text-anchor="middle" font-family="system-ui, -apple-system, sans-serif" font-size="14" fill="#9ca3af">
      snappchart.app
    </text>
  </svg>`;

  return svg;
}

// Generate and save the images
const ogSvg = createOGImage();
const twitterSvg = createTwitterImage();

fs.writeFileSync(path.join(__dirname, '..', 'public', 'og-image.svg'), ogSvg);
fs.writeFileSync(path.join(__dirname, '..', 'public', 'twitter-image.svg'), twitterSvg);

console.log('SVG images generated successfully!');
console.log('Next steps:');
console.log('1. Convert og-image.svg to og-image.png (1200x630)');
console.log('2. Convert twitter-image.svg to twitter-image.png (1200x600)');
console.log('3. Update layout.tsx to use the new images');
