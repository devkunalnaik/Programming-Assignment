# Product Search App

A small fullstack product search experience built with React and Node.js/Express. The backend uses a lightweight in-process ranking approach over name, description, and tags, and the frontend provides debounced search, filters, pagination, loading, and empty states.

## Features
- Search over product names, descriptions, and tags
- Relevance-based ranking that prefers name matches over description-only matches
- Category and price range filters
- Pagination with clear loading and empty states
- Seeded dataset and backend container support

## Tech stack
- Frontend: React + Vite
- Backend: Express + Node.js
- Testing: Node test runner + Vitest

## Local setup
1. Install dependencies:
   - npm install
2. Seed the backend dataset:
   - npm run seed
3. Start the full app:
   - npm run dev
4. Open the frontend at http://localhost:5173 and the backend at http://localhost:3001

## Docker
Build and run the backend container:
```bash
docker build -t product-search-backend ./backend
docker run -p 3001:3001 product-search-backend
```

## Ranking approach
Products are scored by a simple explainable rule:
- Direct name matches receive the highest weight
- Description matches receive a lower weight
- Tag matches receive a smaller weight
- Results are then sorted by score and then alphabetically by name

## Tradeoffs and next steps
- This uses an in-memory dataset rather than a dedicated search engine, which keeps the implementation simple and fast for this scope.
- With more time, I would add stemming, typo tolerance, fuzzy matching, and a more advanced ranking strategy such as BM25.

## Assumptions
- The dataset is intentionally compact and seeded from a local JSON file.
- Pagination is page-based with offset/limit query params for simplicity.
