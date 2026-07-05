const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'products.json');
const products = JSON.parse(fs.readFileSync(filePath, 'utf8'));

const categories = ['Electronics', 'Furniture', 'Outdoors', 'Home', 'Fitness', 'Kitchen', 'Tools', 'Health', 'Beauty'];
const adjectives = ['Compact', 'Portable', 'Smart', 'Ergonomic', 'Quiet', 'Premium', 'Durable', 'Lightweight', 'Adjustable', 'Versatile', 'Stylish', 'Minimal', 'Weatherproof', 'Rechargeable', 'Travel'];
const items = ['Organizer', 'Lamp', 'Case', 'Bottle', 'Mat', 'Stand', 'Tray', 'Pillow', 'Candle', 'Scale', 'Gloves', 'Journal', 'Pouch', 'Backpack', 'Mug', 'Cushion', 'Tool', 'Kettle', 'Tote', 'Bowl', 'Rope', 'Socks', 'Mask', 'Towel', 'Harness', 'Lantern', 'Seat', 'Broom', 'Mirror', 'Planter', 'Clock', 'Thermos', 'Racket', 'Weights', 'Band', 'Roller', 'Scrubber', 'Monitor', 'Adapter', 'Hub', 'Dock', 'Controller', 'Cleaner', 'Wallet', 'Saddle', 'Pad', 'Speaker', 'Headset', 'Camera', 'Tripod', 'Flashlight', 'Lighter', 'Grill'];
const descriptions = [
  'Designed for everyday convenience and modern homes',
  'Built for comfort, durability, and practical use',
  'A reliable choice for work, travel, and daily routines',
  'Made to improve organization and streamline your routine',
  'Offers a balance of style, comfort, and performance'
];

for (let i = 0; i < 150; i += 1) {
  const id = products.length + 1 + i;
  const category = categories[(id + i) % categories.length];
  const item = items[(id * 3 + i) % items.length];
  const adjective = adjectives[(id * 2 + i) % adjectives.length];

  let name = `${adjective} ${item}`;
  if (id % 7 === 0) name = `Wireless ${item}`;
  else if (id % 11 === 0) name = `Travel ${item}`;
  else if (id % 13 === 0) name = `Smart ${item}`;
  else if (id % 17 === 0) name = `Ergonomic ${item}`;

  const description = `${descriptions[(id + i) % descriptions.length]} with dependable quality.`;
  const price = Number((((id % 30) + 1) * 7.5 + ((id % 8) * 10) + 12).toFixed(0));
  const tags = [category.toLowerCase(), name.toLowerCase().split(' ').slice(-1)[0], id % 2 === 0 ? 'daily' : 'practical'];

  products.push({ id, name, description, category, price, tags });
}

fs.writeFileSync(filePath, JSON.stringify(products, null, 2));
console.log(`Expanded catalog to ${products.length} products`);
