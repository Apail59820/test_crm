import { describe, it, expect, vi, beforeEach } from 'vitest';
import { waitFor } from '@testing-library/react';
import { renderHook } from './test-utils';
import { useContributionStats } from '@/hooks/useContributionStats';
import { directus } from '@/lib/directus';
import { readItems } from '@directus/sdk';

vi.mock('@/lib/directus', () => ({ directus: { request: vi.fn() } }));
vi.mock('@directus/sdk', () => ({
  readItems: vi.fn((collection: string, params: unknown) => ({ collection, params }))
}));

beforeEach(() => {
  vi.mocked(directus.request).mockClear();
});

describe('useContributionStats', () => {
  it('computes statistics from contributions', async () => {
    const items = [
      { date_created: '2024-01-01', status: { label: 'OPEN' } },
      { date_created: '2024-01-03', status: { label: 'OPEN' } },
      { date_created: '2024-01-08', status: { label: 'DONE' } }
    ];
    const req = vi.mocked(directus.request);
    req.mockResolvedValueOnce(items);

    const { result } = renderHook(() => useContributionStats({}));

    await waitFor(() => expect(req).toHaveBeenCalled());
    await waitFor(() => expect(result.current.data).toBeDefined());
    expect(readItems).toHaveBeenCalled();
    expect(result.current.data).toEqual({
      donutData: [
        { name: 'OPEN', value: 2 },
        { name: 'DONE', value: 1 }
      ],
      lineData: [
        { week: 'SWW', total: 3 }
      ],
      barData: [
        { week: 'SWW', OPEN: 2, DONE: 1 }
      ]
    });
  });
});
