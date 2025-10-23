import sharp from 'sharp'
import { join } from 'path'

async function generateOGImage() {
  const width = 1200
  const height = 630

  // Create SVG for OG image
  const svg = `
    <svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="grad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" style="stop-color:#667eea;stop-opacity:1" />
          <stop offset="100%" style="stop-color:#764ba2;stop-opacity:1" />
        </linearGradient>
      </defs>

      <!-- Background -->
      <rect width="${width}" height="${height}" fill="url(#grad)"/>

      <!-- Grid pattern overlay -->
      <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
        <path d="M 40 0 L 0 0 0 40" fill="none" stroke="rgba(255,255,255,0.1)" stroke-width="1"/>
      </pattern>
      <rect width="${width}" height="${height}" fill="url(#grid)" opacity="0.5"/>

      <!-- Main content container -->
      <g>
        <!-- Logo/Brand Area -->
        <circle cx="600" cy="200" r="60" fill="white" opacity="0.2"/>
        <circle cx="600" cy="200" r="50" fill="white" opacity="0.3"/>
        <text x="600" y="215" font-family="Arial, sans-serif" font-size="48" font-weight="bold"
              fill="white" text-anchor="middle">S</text>

        <!-- Title -->
        <text x="600" y="320" font-family="Arial, sans-serif" font-size="64" font-weight="bold"
              fill="white" text-anchor="middle">SnapPChart</text>

        <!-- Subtitle -->
        <text x="600" y="380" font-family="Arial, sans-serif" font-size="32"
              fill="rgba(255,255,255,0.95)" text-anchor="middle">AI-Powered Stock Trading Analysis</text>

        <!-- Key benefit -->
        <rect x="350" y="420" width="500" height="80" rx="10" fill="rgba(255,255,255,0.2)"/>
        <text x="600" y="455" font-family="Arial, sans-serif" font-size="24" font-weight="600"
              fill="white" text-anchor="middle">Get instant trade recommendations</text>
        <text x="600" y="485" font-family="Arial, sans-serif" font-size="24" font-weight="600"
              fill="white" text-anchor="middle">in under 5 seconds</text>

        <!-- Stats -->
        <text x="350" y="560" font-family="Arial, sans-serif" font-size="20" font-weight="bold"
              fill="white" text-anchor="middle">40+ Signals</text>
        <text x="600" y="560" font-family="Arial, sans-serif" font-size="20" font-weight="bold"
              fill="white" text-anchor="middle">95% Accuracy</text>
        <text x="850" y="560" font-family="Arial, sans-serif" font-size="20" font-weight="bold"
              fill="white" text-anchor="middle">&lt;3s Analysis</text>
      </g>
    </svg>
  `

  const publicDir = join(process.cwd(), 'public')

  // Generate OG image
  await sharp(Buffer.from(svg))
    .png()
    .toFile(join(publicDir, 'og-image.png'))

  // Generate Twitter image (same design)
  await sharp(Buffer.from(svg))
    .png()
    .toFile(join(publicDir, 'twitter-image.png'))

  console.log('✅ Successfully generated OG and Twitter images!')
  console.log('📁 Location: /public/og-image.png and /public/twitter-image.png')
}

generateOGImage().catch(console.error)
