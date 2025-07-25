import { describe, it, expect, vi, beforeEach } from 'vitest';
import { waitFor } from '@testing-library/react';
import { renderHook } from './test-utils';
import { useNewsletterContributions } from '@/hooks/useNewsletterContributions';
import { directus } from '@/lib/directus';
import { readItems } from '@directus/sdk';

vi.mock('@/lib/directus', () => ({ directus: { request: vi.fn() } }));
vi.mock('@directus/sdk', () => ({
  readItems: vi.fn((collection: string, params: unknown) => ({ collection, params }))
}));

beforeEach(() => {
  vi.mocked(directus.request).mockClear();
});

describe('useNewsletterContributions', () => {
  it('maps API items to newsletter format', async () => {
    const req = vi.mocked(directus.request);
    req.mockResolvedValueOnce([
      {
        id: '1',
        date_created: '2024-01-01',
        meeting_date: '2024-01-02',
        notes_raw: 'summary',
        is_public: true,
        organization: { name: 'Org' },
        contact: { region: 'EU' },
        user_created: { first_name: 'John', last_name: 'Doe', email: 'j@example.com' },
        status: { label: 'OPEN' }
      }
    ]);

    const { result } = renderHook(() => useNewsletterContributions({ startDate: '2024-01-01', endDate: '2024-02-01', userIds: ['u1'] }));

    await waitFor(() => expect(req).toHaveBeenCalled());
    await waitFor(() => expect(result.current.data).toBeDefined());
    expect(readItems).toHaveBeenCalled();
    expect(result.current.data).toEqual([
      {
        id: '1',
        organization: 'Org',
        region: 'EU',
        contributor: 'John Doe',
        date: '2024-01-02',
        summary: 'summary',
        visibility: 'PUBLIC',
        status: 'OPEN'
      }
    ]);
  });
});
