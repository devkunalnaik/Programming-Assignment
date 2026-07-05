const express = require('express');
const cors = require('cors');
const path = require('path');
const fs = require('fs');
const { searchProducts } = require('./searchService');

const app = express();
const PORT = process.env.PORT || 3001;
const productsPath = path.join(__dirname, 'data', 'seededProducts.json');

app.use(cors());
app.use(express.json());

function loadProducts() {
  if (!fs.existsSync(productsPath)) {
    return JSON.parse(fs.readFileSync(path.join(__dirname, 'data', 'products.json'), 'utf8'));
  }
  return JSON.parse(fs.readFileSync(productsPath, 'utf8'));
}

app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok' });
});

app.get('/api/categories', (_req, res) => {
  const products = loadProducts();
  const categories = [...new Set(products.map((product) => product.category))].sort();
  res.json({ categories });
});

app.get('/api/products', (req, res) => {
  const products = loadProducts();
  const { query = '', category = '', minPrice, maxPrice, limit = 8, offset = 0 } = req.query;
  const results = searchProducts(products, {
    query,
    category,
    minPrice,
    maxPrice,
    limit: Number(limit),
    offset: Number(offset),
  });
  res.json(results);
});

if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}`);
  });
}

module.exports = app;
