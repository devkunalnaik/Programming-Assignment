import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import App from './App';

const mockProducts = {
  total: 1,
  products: [
    { id: 1, name: 'Wireless Headphones', description: 'Noise cancelling audio', category: 'Electronics', price: 199, tags: ['audio'] }
  ]
};

beforeEach(() => {
  vi.restoreAllMocks();
});

describe('App', () => {
  it('renders results after a debounced search', async () => {
    const fetchMock = vi.fn((url) => {
      if (url.includes('/api/categories')) {
        return Promise.resolve({ ok: true, json: async () => ({ categories: ['Electronics'] }) });
      }
      return Promise.resolve({ ok: true, json: async () => mockProducts });
    });
    vi.stubGlobal('fetch', fetchMock);

    render(<App />);
    const input = screen.getByLabelText(/search products/i);
    await userEvent.type(input, 'wireless');

    expect(await screen.findByText('Wireless Headphones')).toBeTruthy();
  });

  it('combines current filters with search term', async () => {
    const fetchMock = vi.fn((url) => {
      if (url.includes('/api/categories')) {
        return Promise.resolve({ ok: true, json: async () => ({ categories: ['Electronics'] }) });
      }
      return Promise.resolve({ ok: true, json: async () => ({ total: 0, products: [] }) });
    });
    vi.stubGlobal('fetch', fetchMock);

    render(<App />);
    const input = screen.getByLabelText(/search products/i);
    await userEvent.type(input, 'wireless');
    expect(await screen.findByText(/no products match your search/i)).toBeTruthy();
  });
});
