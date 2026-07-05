function normalize(value) {
  return String(value || '').toLowerCase().trim();
}

function tokenize(value) {
  return normalize(value).split(/[^a-z0-9]+/).filter(Boolean);
}

function scoreProduct(product, query) {
  const q = normalize(query);
  const tokens = tokenize(q);
  const haystack = [product.name, product.description, ...(product.tags || [])].join(' ').toLowerCase();
  let score = 0;

  if (q && haystack.includes(q)) {
    score += 10;
  }

  if (tokens.length) {
    tokens.forEach((token) => {
      if (normalize(product.name).includes(token)) score += 20;
      else if (normalize(product.description).includes(token)) score += 8;
      else if ((product.tags || []).some((tag) => normalize(tag).includes(token))) score += 6;
    });
  }

  if (q && normalize(product.name).includes(q)) score += 15;
  return score;
}

function searchProducts(products, options = {}) {
  const query = options.query || '';
  const category = options.category || '';
  const minPrice = Number(options.minPrice || 0);
  const maxPrice = Number(options.maxPrice || Number.POSITIVE_INFINITY);
  const limit = Number(options.limit || 10);
  const offset = Number(options.offset || 0);

  const filtered = products.filter((product) => {
    const matchesCategory = !category || normalize(product.category) === normalize(category);
    const matchesPrice = product.price >= minPrice && product.price <= maxPrice;
    const matchesQuery = !query || [product.name, product.description, ...(product.tags || [])].some((field) => normalize(field).includes(normalize(query)));
    return matchesCategory && matchesPrice && matchesQuery;
  });

  const scored = filtered
    .map((product) => ({ product, score: scoreProduct(product, query) }))
    .sort((a, b) => b.score - a.score || a.product.name.localeCompare(b.product.name));

  return {
    total: scored.length,
    products: scored.slice(offset, offset + limit).map(({ product }) => product),
  };
}

module.exports = { searchProducts };
