import { describe, it, expect, vi } from 'vitest';
import { act } from '@testing-library/react';
import { renderHook } from './test-utils';
import { useArchiveContribution } from '@/hooks/useArchiveContribution';
import { directus } from '@/lib/directus';
import { readItems, updateItem } from '@directus/sdk';

vi.mock('@/lib/directus', () => ({ directus: { request: vi.fn() } }));
vi.mock('@directus/sdk', () => ({
  readItems: vi.fn((collection: string, params: unknown) => ({ collection, params })),
  updateItem: vi.fn((collection: string, id: string, data: unknown) => ({ collection, id, data }))
}));

describe('useArchiveContribution', () => {
  it('updates contribution status to archived', async () => {
    const req = vi.mocked(directus.request);
    req.mockResolvedValueOnce([{ id: 'status1' }]);
    req.mockResolvedValueOnce({});

    const { result } = renderHook(() => useArchiveContribution());

    await act(async () => {
      await result.current.mutateAsync('contrib');
    });

    expect(readItems).toHaveBeenCalled();
    expect(updateItem).toHaveBeenCalledWith('contributions', 'contrib', { status: 'status1' });
    expect(req).toHaveBeenCalledTimes(2);
  });
});
