import { describe, it, expect, vi } from 'vitest';
import { act } from '@testing-library/react';
import { renderHook } from './test-utils';
import { useUpdateContribution } from '@/hooks/useUpdateContribution';
import { directus } from '@/lib/directus';
import { updateItem } from '@directus/sdk';

vi.mock('@/lib/directus', () => ({ directus: { request: vi.fn() } }));
vi.mock('@directus/sdk', () => ({
  updateItem: vi.fn((collection: string, id: string, data: unknown) => ({ collection, id, data }))
}));

describe('useUpdateContribution', () => {
  it('updates contribution data', async () => {
    const req = vi.mocked(directus.request);
    req.mockResolvedValueOnce({});
    const { result } = renderHook(() => useUpdateContribution());
    await act(async () => {
      await result.current.mutateAsync({ id: 'c1', data: { title: 'New' } });
    });
    expect(updateItem).toHaveBeenCalledWith('contributions', 'c1', { title: 'New' });
    expect(req).toHaveBeenCalled();
  });
});
