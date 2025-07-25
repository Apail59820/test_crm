import { describe, it, expect, vi, beforeEach } from 'vitest';
import { waitFor } from '@testing-library/react';
import { renderHook } from './test-utils';
import { useContribution } from '@/hooks/useContribution';
import { directus } from '@/lib/directus';
import { readItem } from '@directus/sdk';

vi.mock('@/lib/directus', () => ({ directus: { request: vi.fn() } }));
vi.mock('@directus/sdk', () => ({
  readItem: vi.fn((collection: string, id: string, params: unknown) => ({ collection, id, params }))
}));

beforeEach(() => {
  vi.mocked(directus.request).mockClear();
});

describe('useContribution', () => {
  it('fetches contribution details', async () => {
    const req = vi.mocked(directus.request);
    req.mockResolvedValueOnce({ id: '1', organization: { name: 'Org' } });

    const { result } = renderHook(() => useContribution('1'));

    await waitFor(() => expect(req).toHaveBeenCalled());
    await waitFor(() => expect(result.current.data).toBeDefined());
    expect(readItem).toHaveBeenCalledWith('contributions', '1', expect.anything());
    expect(result.current.data).toEqual({ id: '1', organization: { name: 'Org' } });
  });

  it('skips request when id is missing', async () => {
    const req = vi.mocked(directus.request);
    renderHook(() => useContribution(undefined));
    expect(req).not.toHaveBeenCalled();
  });
});
