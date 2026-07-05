const fs = require('fs');
const path = require('path');

const dataPath = path.join(__dirname, 'products.json');
const outputPath = path.join(__dirname, 'seededProducts.json');

const products = JSON.parse(fs.readFileSync(dataPath, 'utf8'));
fs.writeFileSync(outputPath, JSON.stringify(products, null, 2));
console.log(`Seeded ${products.length} products into ${path.basename(outputPath)}`);
