const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

// Read the SVG favicon
const svgBuffer = fs.readFileSync(path.join(__dirname, '../public/favicon.svg'));

// Generate different sizes for favicon
async function generateFavicons() {
  const sizes = [16, 32, 48, 64, 128, 256];

  console.log('Generating favicon images...');

  for (const size of sizes) {
    await sharp(svgBuffer)
      .resize(size, size)
      .png()
      .toFile(path.join(__dirname, `../public/favicon-${size}x${size}.png`));

    console.log(`✓ Generated favicon-${size}x${size}.png`);
  }

  // Generate the main favicon.ico (32x32)
  await sharp(svgBuffer)
    .resize(32, 32)
    .png()
    .toFile(path.join(__dirname, '../public/favicon.png'));

  console.log('✓ Generated favicon.png');

  // Generate apple-touch-icon
  await sharp(svgBuffer)
    .resize(180, 180)
    .png()
    .toFile(path.join(__dirname, '../public/apple-touch-icon.png'));

  console.log('✓ Generated apple-touch-icon.png');

  console.log('\n✅ All favicons generated successfully!');
  console.log('\nNote: For favicon.ico, you can use an online converter like:');
  console.log('https://convertio.co/png-ico/ to convert favicon-32x32.png to favicon.ico');
}

generateFavicons().catch(console.error);
