import { describe, it, expect, vi, beforeEach } from 'vitest';
import { waitFor } from '@testing-library/react';
import { renderHook } from './test-utils';
import { useUsers } from '@/hooks/useUsers';
import { directus } from '@/lib/directus';
import { readUsers } from '@directus/sdk';

vi.mock('@/lib/directus', () => ({ directus: { request: vi.fn() } }));
vi.mock('@directus/sdk', () => ({
  readUsers: vi.fn((params: unknown) => params)
}));

beforeEach(() => {
  vi.mocked(directus.request).mockClear();
});

describe('useUsers', () => {
  it('skips query when search is empty', () => {
    renderHook(() => useUsers(''));
    expect(directus.request).not.toHaveBeenCalled();
  });

  it('fetches users when searching', async () => {
    const req = vi.mocked(directus.request);
    req.mockResolvedValueOnce([{ id: '1', first_name: 'A' }]);
    const { result } = renderHook(() => useUsers('A'));
    await waitFor(() => expect(req).toHaveBeenCalled());
    await waitFor(() => expect(result.current.data).toBeDefined());
    expect(readUsers).toHaveBeenCalled();
    expect(result.current.data).toEqual([{ id: '1', first_name: 'A' }]);
  });
});
