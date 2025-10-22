const toIco = require('to-ico');
const fs = require('fs');
const path = require('path');

async function createIco() {
  console.log('Creating favicon.ico...');

  // Read the PNG files
  const files = [
    fs.readFileSync(path.join(__dirname, '../public/favicon-16x16.png')),
    fs.readFileSync(path.join(__dirname, '../public/favicon-32x32.png')),
    fs.readFileSync(path.join(__dirname, '../public/favicon-48x48.png')),
  ];

  // Create ICO file
  const ico = await toIco(files);

  // Write ICO file
  fs.writeFileSync(path.join(__dirname, '../public/favicon.ico'), ico);

  console.log('✅ favicon.ico created successfully!');
}

createIco().catch(console.error);
