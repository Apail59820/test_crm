import { describe, it, expect, vi, beforeEach } from 'vitest';
import { waitFor } from '@testing-library/react';
import { renderHook } from './test-utils';
import { useParticipationStats } from '@/hooks/useParticipationStats';
import { directus } from '@/lib/directus';
import { readItems, readUsers } from '@directus/sdk';

vi.mock('@/lib/directus', () => ({ directus: { request: vi.fn() } }));
vi.mock('@directus/sdk', () => ({
  readItems: vi.fn((collection: string, params: unknown) => ({ collection, params })),
  readUsers: vi.fn((params: unknown) => params)
}));

beforeEach(() => {
  vi.mocked(directus.request).mockReset();
});

describe('useParticipationStats', () => {
  it('aggregates contributions statistics', async () => {
    const req = vi.mocked(directus.request);
    req.mockResolvedValueOnce([
      { date_created: '2024-01-01', user_created: { id: 'u1' } },
      { date_created: '2024-01-03', user_created: { id: 'u2' } }
    ]);
    req.mockResolvedValueOnce([
      { user_created: { id: 'u1' } },
      { user_created: { id: 'u2' } },
      { user_created: { id: 'u3' } }
    ]);
    req.mockResolvedValueOnce([
      { id: 'u1', first_name: 'John', last_name: 'Doe', email: 'j1', avatar: null, region: 'EU', entity: 'Acme' },
      { id: 'u2', first_name: 'Jane', last_name: 'Doe', email: 'j2', avatar: 'a2', region: 'NA', entity: 'Beta' },
      { id: 'u3', first_name: 'Bob', last_name: 'Smith', email: 'j3', avatar: null, region: 'APAC', entity: 'Gamma' }
    ]);

    const { result } = renderHook(() => useParticipationStats({ startDate: '2024-01-01', endDate: '2024-02-01' }));
    await waitFor(() => expect(result.current.data).toBeDefined());
    expect(readItems).toHaveBeenCalledTimes(2);
    expect(readUsers).toHaveBeenCalled();
    expect(result.current.data).toEqual([
      {
        id: 'u1',
        name: 'John Doe',
        avatar: undefined,
        entity: 'Acme',
        region: 'EU',
        hasContributed: true,
        contributionCount: 1,
        lastContribution: '2024-01-01'
      },
      {
        id: 'u2',
        name: 'Jane Doe',
        avatar: 'a2',
        entity: 'Beta',
        region: 'NA',
        hasContributed: true,
        contributionCount: 1,
        lastContribution: '2024-01-03'
      },
      {
        id: 'u3',
        name: 'Bob Smith',
        avatar: undefined,
        entity: 'Gamma',
        region: 'APAC',
        hasContributed: true,
        contributionCount: 0,
        lastContribution: undefined
      }
    ]);
  });
});
