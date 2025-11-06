const sharp = require('sharp');
const path = require('path');

async function convertScreenshot() {
  const inputPath = './public/screenshot-original.png';
  const ogImagePath = './public/og-image.png';
  const twitterImagePath = './public/twitter-image.png';

  try {
    // Create OG image (1200x630)
    await sharp(inputPath)
      .resize(1200, 630, {
        fit: 'cover',
        position: 'center'
      })
      .png({ quality: 90 })
      .toFile(ogImagePath);

    console.log('✓ Created og-image.png (1200x630)');

    // Create Twitter image (same dimensions)
    await sharp(inputPath)
      .resize(1200, 630, {
        fit: 'cover',
        position: 'center'
      })
      .png({ quality: 90 })
      .toFile(twitterImagePath);

    console.log('✓ Created twitter-image.png (1200x630)');
    console.log('\nPreview images updated successfully!');
  } catch (error) {
    console.error('Error converting screenshot:', error);
    process.exit(1);
  }
}

convertScreenshot();
