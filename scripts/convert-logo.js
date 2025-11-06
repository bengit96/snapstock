const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

async function convertSvgToPng() {
  const inputPath = path.join(__dirname, '../public/logo.svg');
  const outputPath = path.join(__dirname, '../public/logo-120x120.png');

  try {
    // Read SVG and convert to 120x120 PNG with white background
    await sharp(inputPath)
      .resize(120, 120, {
        fit: 'contain',
        background: { r: 255, g: 255, b: 255, alpha: 1 }
      })
      .png()
      .toFile(outputPath);

    console.log(`✓ Successfully converted logo.svg to logo-120x120.png`);
    console.log(`  Output: ${outputPath}`);
  } catch (error) {
    console.error('Error converting SVG to PNG:', error);
    process.exit(1);
  }
}

convertSvgToPng();
