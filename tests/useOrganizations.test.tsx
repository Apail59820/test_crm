import { describe, it, expect, vi } from 'vitest';
import { renderHook } from './test-utils';
import { waitFor } from '@testing-library/react';
import { useOrganizations } from '@/hooks/useOrganizations';
import { directus } from '@/lib/directus';
import { readItems } from '@directus/sdk';

vi.mock('@/lib/directus', () => ({ directus: { request: vi.fn() } }));
vi.mock('@directus/sdk', () => ({
  readItems: vi.fn((collection: string, params: unknown) => ({ collection, params }))
}));

describe('useOrganizations', () => {
  it('skips query when search is empty', async () => {
    renderHook(() => useOrganizations(''));
    expect(directus.request).not.toHaveBeenCalled();
  });

  it('fetches organizations when searching', async () => {
    const req = vi.mocked(directus.request);
    req.mockResolvedValueOnce([{ id: '1', name: 'Org' }]);
    const { result } = renderHook(() => useOrganizations('Org'));
    await waitFor(() => expect(req).toHaveBeenCalled());
    expect(readItems).toHaveBeenCalled();
    expect(req.mock.calls[0][0]).toMatchObject({ collection: 'organizations' });
  });
});
