const test = require('node:test');
const assert = require('node:assert/strict');
const { searchProducts } = require('../src/searchService');

const products = [
  { id: 1, name: 'Wireless Noise Cancelling Headphones', description: 'Immersive audio with Bluetooth and long battery life', category: 'Electronics', price: 199, tags: ['audio', 'wireless', 'headphones'] },
  { id: 2, name: 'Ergonomic Office Chair', description: 'Comfortable chair for long work sessions', category: 'Furniture', price: 149, tags: ['office', 'comfort'] },
  { id: 3, name: 'USB-C Charging Cable', description: 'Fast charging cable for modern phones', category: 'Electronics', price: 24, tags: ['cable', 'charging', 'usb-c'] },
  { id: 4, name: 'Travel Backpack', description: 'Water-resistant bag for everyday travel', category: 'Outdoors', price: 79, tags: ['travel', 'backpack', 'waterproof'] }
];

test('ranks name matches above description-only matches', () => {
  const results = searchProducts(products, { query: 'wireless', limit: 10, offset: 0 });
  assert.equal(results.products[0].id, 1);
  assert.ok(results.products[0].score > results.products[1]?.score || results.products[1] === undefined);
});

test('filters by category and price range together', () => {
  const results = searchProducts(products, { query: 'cable', category: 'Electronics', minPrice: 20, maxPrice: 30, limit: 10, offset: 0 });
  assert.equal(results.total, 1);
  assert.equal(results.products[0].id, 3);
});

test('returns empty results for no matching products', () => {
  const results = searchProducts(products, { query: 'kitchen', limit: 10, offset: 0 });
  assert.equal(results.total, 0);
  assert.equal(results.products.length, 0);
});
