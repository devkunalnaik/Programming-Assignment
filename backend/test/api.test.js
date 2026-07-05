const test = require('node:test');
const assert = require('node:assert/strict');
const request = require('supertest');
const app = require('../src/server');

test('GET /api/products returns matching products', async () => {
  const response = await request(app).get('/api/products').query({ query: 'wireless' });
  assert.equal(response.status, 200);
  assert.ok(response.body.products.length > 0);
  assert.equal(response.body.products[0].name.includes('Wireless') || response.body.products[0].tags.includes('wireless'), true);
});

test('GET /api/products supports category and price filters', async () => {
  const response = await request(app).get('/api/products').query({ query: 'cable', category: 'Electronics', minPrice: 20, maxPrice: 30 });
  assert.equal(response.status, 200);
  assert.equal(response.body.total, 1);
});
