import { useEffect, useMemo, useState } from 'react';

const API_URL = 'http://localhost:3001/api/products';

function App() {
  const [query, setQuery] = useState('');
  const [debouncedQuery, setDebouncedQuery] = useState('');
  const [category, setCategory] = useState('');
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [categories, setCategories] = useState([]);
  const limit = 8;

  useEffect(() => {
    const timer = window.setTimeout(() => setDebouncedQuery(query), 300);
    return () => window.clearTimeout(timer);
  }, [query]);

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      const params = new URLSearchParams({
        query: debouncedQuery,
        limit: String(limit),
        offset: String((page - 1) * limit),
      });
      if (category) params.set('category', category);
      if (minPrice) params.set('minPrice', minPrice);
      if (maxPrice) params.set('maxPrice', maxPrice);

      const res = await fetch(`${API_URL}?${params.toString()}`);
      if (!res?.ok) {
        setProducts([]);
        setTotal(0);
        setLoading(false);
        return;
      }
      const data = await res.json();
      setProducts(data.products || []);
      setTotal(data.total || 0);
      setLoading(false);
    };

    fetchProducts();
  }, [debouncedQuery, category, minPrice, maxPrice, page]);

  useEffect(() => {
    const fetchCategories = async () => {
      const res = await fetch(API_URL.replace('/api/products', '/api/categories'));
      const data = await res.json();
      setCategories(data.categories || []);
    };
    fetchCategories();
  }, []);

  useEffect(() => {
    setPage(1);
  }, [debouncedQuery, category, minPrice, maxPrice]);

  const totalPages = useMemo(() => Math.max(1, Math.ceil(total / limit)), [total]);

  return (
    <div className="app-shell">
      <header>
        <h1>Product Search</h1>
        <p>Search across names, descriptions, and tags with smart ranking.</p>
      </header>

      <section className="controls">
        <input
          aria-label="Search products"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search for products"
        />
        <select aria-label="Filter by category" value={category} onChange={(e) => setCategory(e.target.value)}>
          <option value="">All categories</option>
          {categories.map((item) => (
            <option key={item} value={item}>
              {item}
            </option>
          ))}
        </select>
        <input aria-label="Minimum price" type="number" value={minPrice} onChange={(e) => setMinPrice(e.target.value)} placeholder="Min price" />
        <input aria-label="Maximum price" type="number" value={maxPrice} onChange={(e) => setMaxPrice(e.target.value)} placeholder="Max price" />
      </section>

      {loading ? (
        <div className="status">Loading products...</div>
      ) : products.length === 0 ? (
        <div className="status empty">No products match your search.</div>
      ) : (
        <>
          <div className="results-grid">
            {products.map((product) => (
              <article key={product.id} className="product-card">
                <h2>{product.name}</h2>
                <p>{product.description}</p>
                <div className="meta">
                  <span>{product.category}</span>
                  <strong>${product.price}</strong>
                </div>
                <div className="tags">
                  {product.tags.map((tag) => (
                    <span key={tag}>{tag}</span>
                  ))}
                </div>
              </article>
            ))}
          </div>
          <div className="pagination">
            <button onClick={() => setPage((value) => Math.max(1, value - 1))} disabled={page === 1}>
              Previous
            </button>
            <span>
              Page {page} of {totalPages}
            </span>
            <button onClick={() => setPage((value) => Math.min(totalPages, value + 1))} disabled={page === totalPages}>
              Next
            </button>
          </div>
        </>
      )}
    </div>
  );
}

export default App;
