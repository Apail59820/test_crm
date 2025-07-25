import '@testing-library/jest-dom';
import { afterEach, vi } from 'vitest';
import { cleanup } from '@testing-library/react';

// Ensure cleanup after each test
afterEach(() => {
  cleanup();
});

// Provide a default Directus URL for tests
process.env.NEXT_PUBLIC_DIRECTUS_URL = 'http://localhost';

// Mock directus client to avoid real network calls
vi.mock('@/lib/directus', () => ({
  directus: { request: vi.fn(), login: vi.fn(), logout: vi.fn() }
}));

vi.mock('@/lib/auth-context', async () => {
  const actual = await import('@/lib/auth-context');
  return {
    ...actual,
    useAuth: vi.fn(() => ({ login: vi.fn(), logout: vi.fn(), user: null, loading: false })),
  };
});
